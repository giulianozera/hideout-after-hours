/**
 * Les Fleurs — online ordering payment backend (Cloudflare Worker).
 *
 * What it does: receives a cart from lesfleurscafe.com, prices it SERVER-SIDE
 * from the trusted menu.json (never trusting prices sent by the browser),
 * creates a Square Payment Link (hosted checkout) for a PICKUP order, and
 * returns the checkout URL. The browser then redirects the customer to pay.
 * Money + the pickup order land in the cafe's existing Square account.
 *
 * Secrets live ONLY in this Worker's encrypted environment variables — never
 * in the website. Set these in Cloudflare → Worker → Settings → Variables:
 *   SQUARE_ACCESS_TOKEN   (secret)  — sandbox token for testing, production token for go-live
 *   SQUARE_LOCATION_ID    (secret)  — the cafe's Square location id (sandbox or production)
 *   SQUARE_ENVIRONMENT               — "sandbox" or "production"
 * Optional (have sensible defaults):
 *   SQUARE_VERSION                   — Square API version date (default below)
 *   ALLOWED_ORIGIN                   — default "https://lesfleurscafe.com"
 *   MENU_URL                         — default "https://lesfleurscafe.com/menu.json"
 *   REDIRECT_URL                     — where Square sends the customer after paying
 *   TAX_RATE                         — sales-tax percentage as a string, e.g. "8.875" (omit/"0" = no added tax)
 */

const DEFAULTS = {
  SQUARE_VERSION: "2025-06-18",
  ALLOWED_ORIGIN: "https://lesfleurscafe.com",
  MENU_URL: "https://lesfleurscafe.com/menu.json",
  REDIRECT_URL: "https://lesfleurscafe.com/?order=success",
};

// Small in-memory cache so we don't refetch menu.json on every order.
let MENU_CACHE = { at: 0, data: null };
const MENU_TTL_MS = 5 * 60 * 1000;

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || DEFAULTS.ALLOWED_ORIGIN;
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method === "GET") {
      return json({ ok: true, service: "lesfleurs-checkout" }, 200, cors);
    }
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, cors);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "bad_json" }, 400, cors); }

    // ---- load the trusted menu (prices live here, NOT in the request) ----
    let menu;
    try { menu = await loadMenu(env); }
    catch (e) { return json({ error: "menu_unavailable", detail: String(e) }, 502, cors); }

    const itemIndex = new Map(menu.items.map(i => [i.id, i]));
    const addonIndex = new Map();
    if (menu.builder) for (const g of menu.builder.groups) for (const o of g.options) addonIndex.set(o.id, o);

    // ---- build Square line items from trusted prices ----
    const lineItems = [];
    const currency = menu.currency || "USD";

    for (const it of (body.items || [])) {
      const ref = itemIndex.get(it && it.id);
      const qty = clampQty(it && it.qty);
      if (!ref) return json({ error: "unknown_item", id: it && it.id }, 400, cors);
      lineItems.push({
        name: ref.name,
        quantity: String(qty),
        base_price_money: { amount: ref.priceCents, currency },
      });
    }

    for (const b of (body.boards || [])) {
      if (!menu.builder) return json({ error: "builder_unavailable" }, 400, cors);
      const qty = clampQty(b && b.qty);
      const modifiers = [];
      for (const id of ((b && b.addons) || [])) {
        const add = addonIndex.get(id);
        if (!add) return json({ error: "unknown_addon", id }, 400, cors);
        modifiers.push({ name: add.name, base_price_money: { amount: add.priceCents, currency } });
      }
      lineItems.push({
        name: menu.builder.name,
        quantity: String(qty),
        base_price_money: { amount: menu.builder.baseCents, currency },
        ...(modifiers.length ? { modifiers } : {}),
      });
    }

    if (lineItems.length === 0) return json({ error: "empty_cart" }, 400, cors);

    // ---- resolve which Square location the order belongs to ----
    const isProd = (env.SQUARE_ENVIRONMENT || "sandbox") === "production";
    const apiBase = isProd ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com";
    const version = env.SQUARE_VERSION || DEFAULTS.SQUARE_VERSION;

    let locationId = env.SQUARE_LOCATION_ID;
    if (!locationId) {
      try { locationId = await resolveLocation(env, apiBase, version); }
      catch (e) { return json({ error: "location_unresolved", detail: String(e) }, 502, cors); }
    }

    // ---- assemble the order ----
    const pickup = body.pickup || {};
    const order = {
      location_id: locationId,
      line_items: lineItems,
      fulfillments: [{
        type: "PICKUP",
        state: "PROPOSED",
        pickup_details: {
          recipient: {
            display_name: (pickup.name || "Online order").slice(0, 80),
            ...(pickup.phone ? { phone_number: pickup.phone } : {}),
          },
          schedule_type: "ASAP",
          note: (pickup.time && pickup.time !== "ASAP") ? `Requested time: ${String(pickup.time).slice(0,60)}` : undefined,
        },
      }],
    };
    if (body.note) order.note = String(body.note).slice(0, 500);

    const taxRate = parseFloat(env.TAX_RATE || "0");
    if (taxRate > 0) {
      order.taxes = [{ name: "Sales Tax", percentage: String(taxRate), scope: "ORDER" }];
    }

    // ---- create the Square Payment Link ----
    const redirect = env.REDIRECT_URL || DEFAULTS.REDIRECT_URL;

    const payload = {
      idempotency_key: crypto.randomUUID(),
      order,
      checkout_options: { redirect_url: redirect, ask_for_shipping_address: false },
      ...(pickup.phone ? { pre_populated_data: { buyer_phone_number: pickup.phone } } : {}),
    };

    let sqRes, sqBody;
    try {
      sqRes = await fetch(`${apiBase}/v2/online-checkout/payment-links`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
          "Square-Version": version,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      sqBody = await sqRes.json();
    } catch (e) {
      return json({ error: "square_unreachable", detail: String(e) }, 502, cors);
    }

    if (!sqRes.ok || !sqBody.payment_link) {
      // Surface Square's error so we can debug during sandbox testing.
      return json({ error: "square_error", status: sqRes.status, square: sqBody.errors || sqBody }, 502, cors);
    }

    return json({
      url: sqBody.payment_link.url,
      orderId: sqBody.payment_link.order_id,
    }, 200, cors);
  },
};

let LOCATION_CACHE = null;
async function resolveLocation(env, apiBase, version) {
  if (LOCATION_CACHE) return LOCATION_CACHE;
  const res = await fetch(`${apiBase}/v2/locations`, {
    headers: {
      "Authorization": `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
      "Square-Version": version,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.locations || !data.locations.length) {
    throw new Error("no locations on account");
  }
  const active = data.locations.find(l => l.status === "ACTIVE") || data.locations[0];
  LOCATION_CACHE = active.id;
  return LOCATION_CACHE;
}

async function loadMenu(env) {
  const now = Date.now();
  if (MENU_CACHE.data && (now - MENU_CACHE.at) < MENU_TTL_MS) return MENU_CACHE.data;
  const url = env.MENU_URL || DEFAULTS.MENU_URL;
  const res = await fetch(url, { cf: { cacheTtl: 300 } });
  if (!res.ok) throw new Error(`menu fetch ${res.status}`);
  const data = await res.json();
  MENU_CACHE = { at: now, data };
  return data;
}

function clampQty(q) {
  const n = Math.floor(Number(q));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 50);
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
