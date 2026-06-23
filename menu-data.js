// Menu transcribed verbatim from "menu items.html" — HIDEOUT AFTER HOURS by LES FLEURS.

// ↓ GO-LIVE SWITCH: when the Square Online ordering page is published, paste its
//   URL here (e.g. "https://lesfleurscafe.square.site"). While it is "" the
//   "Order Online" buttons stay hidden. This one line is all that flips it live.
window.ORDER_ONLINE_URL = "";

window.MENU_SECTIONS = [
  {
    id: "pinsa", navLabel: "Pizza", title: "PIZZA FOCACCIA", type: "list",
    items: [
      { name: "BIANCA", price: 10, desc: "Rosemary, extra virgin olive oil, sea salt" },
      { name: "ROSSA", price: 12, desc: "Tomato, mozzarella, basil, extra virgin olive oil, sea salt" },
      { name: "FRESCA", price: 15, desc: "Mozzarella, arugula, prosciutto, cherry tomatoes, Parmesan shavings, extra virgin olive oil, sea salt" },
      { name: "NAPOLETANA", price: 11 } // TODO: confirm Napoletana price + description
    ]
  },
  {
    id: "sandwiches", navLabel: "Sandwiches", title: "SANDWICHES", type: "list",
    items: [
      { name: "CAPRESE", price: 12, desc: "Mozzarella, tomato, basil, extra virgin olive oil, sea salt" },
      { name: "PARMA", price: 14, desc: "Mozzarella, prosciutto, arugula, tomato, Parmesan shavings, extra virgin olive oil, sea salt" },
      { name: "AFFUMICATO", price: 15, desc: "Philadelphia cream cheese, smoked salmon, mixed greens, avocado, extra virgin olive oil, sea salt" }
    ]
  },
  {
    id: "salads", navLabel: "Salads", title: "SALADS", type: "list",
    note: "Served with focaccia bread.",
    items: [
      { name: "PRAIANO", price: 12, desc: "Arugula, tomato, nuts, Parmesan shavings" },
      { name: "POMPEI", price: 14, desc: "Mixed greens, avocado, tomato, goat cheese" },
      { name: "SORRENTO", price: 15, desc: "Mozzarella, tomato, basil" }
    ]
  },
  {
    id: "snack", navLabel: "Snack", title: "SNACK", type: "list",
    items: [
      { name: "SNACK OF THE DAY", desc: "Ask us for today’s selection" }
    ]
  },
  {
    id: "cornetto", navLabel: "Cornetto", title: "CORNETTO", type: "list",
    items: [
      { name: "PLAIN", price: 3 },
      { name: "SWEET", price: 5 },
      { name: "SALTY", price: 7.50 }
    ]
  },
  {
    // ─── DAILY SPECIAL — EDIT THIS EACH DAY ──────────────────────────────────
    // Replace the placeholder item below with today's special. You can set a
    // name, an optional price, and an optional desc. Examples:
    //   { name: "TRUFFLE TAGLIATELLE", price: 16, desc: "Fresh pasta, black truffle, Parmesan, extra virgin olive oil, sea salt" }
    //   { name: "BURRATA & PEACH", price: 14, desc: "Burrata, grilled peach, basil, extra virgin olive oil, sea salt" }
    // On days with no special, leave the placeholder line as-is.
    id: "special", navLabel: "Special", title: "SPECIAL OF THE DAY", type: "list",
    items: [
      { name: "Ask us for today’s special", desc: "" } // ← replace with the day's special
    ]
  },
  {
    id: "board", navLabel: "Board", title: "BOARD", type: "list",
    items: [
      { name: "BOARD LES FLEURS MIX", price: 20, desc: "Selection of italian cheeses, cured meats, olives, caponata, warm focaccia, extra virgin olive oil, sea salt" },
      { name: "BUILD YOUR OWN BOARD", price: 10, desc: "Starts with warm focaccia — add your favorite ingredients and we’ll build it for you." }
    ]
  },
  {
    id: "builder", navLabel: "Build a Board", title: "BUILD YOUR OWN BOARD", type: "builder",
    base: 10,
    note: "All boards are served with warm focaccia, extra virgin olive oil and sea salt.",
    groups: [
      {
        title: "CURED MEATS",
        items: [
          { name: "Prosciutto", price: 3 },
          { name: "Cooked Ham", price: 3 },
          { name: "Mortadella", price: 3 },
          { name: "Salami Napoli", price: 3 },
          { name: "Turkey", price: 3 },
          { name: "Smoked Salmon", price: 5 },
          { name: "Tuna", price: 4 }
        ]
      },
      {
        title: "CHEESES",
        items: [
          { name: "Mozzarella", price: 3 },
          { name: "Parmesan", price: 3 },
          { name: "Goat cheese", price: 3 },
          { name: "Brie", price: 3 }, // TODO: confirm price
          { name: "Manchego", price: 3 } // TODO: confirm price
        ]
      },
      {
        title: "GREEN",
        items: [
          { name: "Arugula", price: 2 },
          { name: "Mixed Greens", price: 2 },
          { name: "Avocado", price: 3 },
          { name: "Tomato", price: 2 },
          { name: "Cherry Tomatoes", price: 2 },
          { name: "Black Olives", price: 2 },
          { name: "Caponata", price: 3 }
        ]
      }
    ]
  },
  {
    id: "dessert", navLabel: "Dessert", title: "DESSERT", type: "list",
    items: [
      { name: "PISTACHIO GELATO", price: 8, desc: "Pistachio gelato" },
      { name: "TIRAMISU", price: 8, desc: "Mascarpone, espresso-soaked ladyfingers, cocoa" },
      { name: "PISTACHIO TIRAMISU", price: 10 }, // TODO: confirm description
      { name: "COCONUT LEMON", price: 8 } // TODO: confirm description
    ]
  },
  {
    id: "beverages", navLabel: "Beverages", title: "BEVERAGES", type: "list",
    items: [
      { name: "STILL / SPARKLING WATER", price: 5, desc: "Large glass bottle, still or sparkling" },
      { name: "COKE / COKE ZERO", price: 4, desc: "Coca-Cola / Coca-Cola Zero" },
      { name: "SPRITE", price: 4, desc: "Lemon-lime soda" },
      { name: "ARANCIATA", price: 4, desc: "Italian orange soda" },
      { name: "LIMONATA", price: 4, desc: "Italian lemonade" },
      { name: "ICED TEA", price: 4, desc: "Peach or lemon iced tea" }
    ]
  },
  {
    id: "coffee", navLabel: "Coffee", title: "HIDEOUT COFFEE", type: "list",
    items: [
      { name: "ESPRESSO", price: 4, desc: "Classic espresso" },
      { name: "MACCHIATO", price: 4, desc: "Espresso with a dash of milk" },
      { name: "AMERICANO", price: 4, desc: "Espresso with hot water" },
      { name: "CAPPUCCINO", price: 6, desc: "Espresso, steamed milk, foam" },
      { name: "LATTE HOT / ICED", price: 6, desc: "Steamed milk with espresso" },
      { name: "MATCHA LATTE", price: 7, desc: "Matcha green tea latte" }
    ]
  }
];
