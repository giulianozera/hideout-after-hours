# Online ordering — Cloudflare Worker setup (Les Fleurs)

This sets up the small "helper service" that lets customers pay on the website
with the money landing in your existing Square account. Card numbers never touch
your site — customers pay on Square's secure page. ~15 minutes, no coding.

We do this in **Square Sandbox (test mode) first**. Nothing is real until the
go-live step at the bottom. Your current "Order Online" button keeps working the
whole time.

---

## 1. Create a free Cloudflare account
- Go to https://dash.cloudflare.com/sign-up and sign up (free). No credit card needed.

## 2. Get your Square SANDBOX test credentials
- Go to https://developer.squareup.com/apps → open your app (or create one).
- Switch the toggle to **Sandbox**.
- Copy the **Sandbox Access Token** (a long secret — keep it private).
- That's the only value you must copy. (The Worker finds your test location automatically.)

## 3. Create the Worker
- In Cloudflare: left menu **Workers & Pages** → **Create application** → **Create Worker**.
- Give it a name like `lesfleurs-checkout` → **Deploy** (it deploys a placeholder).
- Click **Edit code**. Delete everything in the editor.
- Open the file `worker.js` from this project, copy ALL of it, paste it in, then **Deploy**.

## 4. Add your secret settings
- In the Worker, go to **Settings** → **Variables and Secrets** → **Add**.
- Add these:
  | Name | Value | Type |
  |---|---|---|
  | `SQUARE_ACCESS_TOKEN` | your **Sandbox** access token | **Secret / Encrypt** |
  | `SQUARE_ENVIRONMENT` | `sandbox` | Text |
  | `TAX_RATE` *(optional)* | e.g. `8.875` for 8.875% sales tax, or leave it out | Text |
- **Save / Deploy** again so the settings take effect.

## 5. Send me your Worker URL
- At the top of the Worker page you'll see its address, like
  `https://lesfleurs-checkout.YOURNAME.workers.dev`.
- Send me that URL. I'll connect it to a hidden test version of the website and
  we'll run a fake order with Square's test card (`4111 1111 1111 1111`, any
  future expiry / any CVV / any ZIP) to confirm the whole flow works.

---

## 6. Go live (later, after the test passes)
1. In Square Developer Console, switch to **Production** and copy your
   **Production Access Token**.
2. In the Worker's Variables: set `SQUARE_ACCESS_TOKEN` to the **production** token
   and `SQUARE_ENVIRONMENT` to `production`. Save/Deploy.
3. We do one real small order with a real card, confirm it lands in your live
   Square Dashboard / Point of Sale as a pickup order, then refund it from Square.
4. I switch the website so the on-site cart is the main "Order" button (keeping
   the old Square link as a backup).

## Whenever you change menu prices later
Prices the customer is charged come from `menu.json` on the site. After editing
the menu, regenerate it by running `node tools-build-menu-json.js` and pushing —
or just ask me to do it.
