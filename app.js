(function () {
  "use strict";

  const SECTIONS = window.MENU_SECTIONS;
  const nav = document.getElementById("section-nav");
  const menu = document.getElementById("menu");

  if (!Array.isArray(SECTIONS) || !menu) {
    if (menu) menu.innerHTML = '<p class="desc">Menu could not be loaded.</p>';
    return;
  }

  const money = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));

  // ---- Build section nav ----
  SECTIONS.forEach((sec) => {
    const a = document.createElement("a");
    a.href = "#" + sec.id;
    a.textContent = sec.navLabel || sec.title;
    a.dataset.target = sec.id;
    nav.appendChild(a);
  });

  // ---- Render sections ----
  SECTIONS.forEach((sec) => {
    const section = document.createElement("section");
    section.className = "menu-section reveal";
    section.id = sec.id;

    const h2 = document.createElement("h2");
    h2.className = "section-title";
    h2.textContent = sec.title;
    section.appendChild(h2);

    if (sec.type === "builder") renderBuilder(section, sec);
    else renderList(section, sec);

    menu.appendChild(section);
  });

  function renderList(section, sec) {
    const wrap = document.createElement("div");
    wrap.className = "items";
    sec.items.forEach((it) => {
      const dish = document.createElement("article");
      dish.className = "dish";

      const head = document.createElement("div");
      head.className = "dish-head";
      const name = document.createElement("span");
      name.className = "dish-name";
      name.textContent = it.name;
      head.appendChild(name);

      if (it.price != null) {
        const leader = document.createElement("span");
        leader.className = "leader";
        const price = document.createElement("span");
        price.className = "price";
        price.textContent = money(it.price);
        head.append(leader, price);
      }
      dish.appendChild(head);

      if (it.desc) {
        const d = document.createElement("p");
        d.className = "desc";
        d.textContent = it.desc;
        dish.appendChild(d);
      }
      wrap.appendChild(dish);
    });
    section.appendChild(wrap);
  }

  // ---- Build-your-own-board ----
  const selected = new Map(); // key -> price
  let base = 10;

  function renderBuilder(section, sec) {
    base = sec.base || 0;

    const note = document.createElement("p");
    note.className = "builder-note";
    note.innerHTML =
      '<span class="builder-base">Starts at ' + money(base) +
      ' &mdash; warm focaccia.</span> ' + (sec.note || "");
    section.appendChild(note);

    sec.groups.forEach((group, gi) => {
      const g = document.createElement("div");
      g.className = "builder-group";

      const sub = document.createElement("h3");
      sub.className = "builder-sub";
      sub.textContent = group.title;
      g.appendChild(sub);

      const chips = document.createElement("div");
      chips.className = "chips";
      group.items.forEach((it, ii) => {
        const key = gi + ":" + ii;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip";
        btn.setAttribute("aria-pressed", "false");
        btn.innerHTML =
          '<span class="chip-mark">✓</span>' +
          '<span class="chip-name">' + it.name + "</span>" +
          '<span class="chip-price">+' + money(it.price) + "</span>";
        btn.addEventListener("click", () => {
          if (selected.has(key)) {
            selected.delete(key);
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
          } else {
            selected.set(key, { name: it.name, price: it.price });
            btn.classList.add("active");
            btn.setAttribute("aria-pressed", "true");
          }
          updateBar();
        });
        chips.appendChild(btn);
      });
      g.appendChild(chips);
      section.appendChild(g);
    });
  }

  // ---- Builder bar ----
  const bar = document.getElementById("board-bar");
  const barTotal = document.getElementById("bb-total");
  const barDetail = document.getElementById("bb-detail");
  const barReset = document.getElementById("bb-reset");

  function updateBar() {
    let total = base;
    const names = [];
    selected.forEach((v) => {
      total += v.price;
      names.push(v.name);
    });

    if (selected.size === 0) {
      bar.classList.remove("show");
      bar.hidden = true;
      return;
    }
    bar.hidden = false;
    // allow the element to register as un-hidden before transitioning
    requestAnimationFrame(() => bar.classList.add("show"));
    barTotal.textContent = money(total);
    barDetail.textContent =
      selected.size + (selected.size === 1 ? " add-on" : " add-ons") + " · " + names.join(", ");
  }

  if (barReset) {
    barReset.addEventListener("click", () => {
      selected.clear();
      document.querySelectorAll(".chip.active").forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      updateBar();
    });
  }

  // ---- Scroll reveal (progressive enhancement only) ----
  const reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  // Failsafe: never let content stay hidden. If the observer hasn't revealed an
  // element shortly after load, show it unconditionally.
  function revealAll() {
    reveals.forEach((el) => {
      el.classList.remove("pending");
      el.classList.add("in");
    });
  }
  window.setTimeout(revealAll, 1400);
  window.addEventListener("load", function () {
    window.setTimeout(revealAll, 200);
  });

  if ("IntersectionObserver" in window) {
    reveals.forEach((el) => el.classList.add("pending"));
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("pending");
            e.target.classList.add("in");
            revealIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.04, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => revealIO.observe(el));

    // ---- Active nav highlight ----
    const links = new Map();
    nav.querySelectorAll("a").forEach((a) => links.set(a.dataset.target, a));
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((a) => a.classList.remove("active"));
            const a = links.get(e.target.id);
            if (a) a.classList.add("active");
          }
        });
      },
      { rootMargin: "-20% 0px -75% 0px" }
    );
    document.querySelectorAll(".menu-section").forEach((s) => navIO.observe(s));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }
})();
