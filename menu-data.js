// Menu transcribed verbatim from "menu items.html" — HIDEOUT AFTER HOURS by LES FLEURS.
window.MENU_SECTIONS = [
  {
    id: "pinsa", navLabel: "Pinsa", title: "PINSA FOCACCIA", type: "list",
    items: [
      { name: "BIANCA", price: 10, desc: "Rosemary, extra virgin olive oil, sea salt" },
      { name: "ROSSA", price: 12, desc: "Tomato, mozzarella, basil, extra virgin olive oil, sea salt" },
      { name: "FRESCA", price: 15, desc: "Mozzarella, arugula, prosciutto, cherry tomatoes, Parmesan shavings, extra virgin olive oil, sea salt" },
      { name: "MARINARA", price: 11, desc: "Tomato, cherry tomatoes, oregano, garlic, basil, extra virgin olive oil, sea salt" }
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
    id: "snack", navLabel: "Snack", title: "SNACK", type: "list",
    items: [
      { name: "SNACK OF THE DAY", desc: "Ask us for today’s selection" }
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
          { name: "Parmesan", price: 3 },
          { name: "Pecorino", price: 3 },
          { name: "Provolone", price: 3 },
          { name: "Ricotta", price: 3 },
          { name: "Mozzarella", price: 3 },
          { name: "Burrata", price: 5 },
          { name: "Feta", price: 3 }
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
      { name: "COCONUT CHEESECAKE", price: 8, desc: "Coconut cream cheesecake, crunchy base" },
      { name: "PISTACHIO MAGNUM", price: 8, desc: "Pistachio ice cream bar, chocolate shell" },
      { name: "TIRAMISU", price: 8, desc: "Mascarpone, espresso-soaked ladyfingers, cocoa" }
    ]
  },
  {
    id: "beverages", navLabel: "Beverages", title: "BEVERAGES", type: "list",
    items: [
      { name: "STILL / SPARKLING WATER", price: 5, desc: "Large glass bottle, still or sparkling" },
      { name: "COKE / COKE ZERO", price: 4, desc: "Coca-Cola / Coca-Cola Zero" },
      { name: "SPRITE", price: 4, desc: "Lemon-lime soda" },
      { name: "ORANGE SODA", price: 4, desc: "Italian orange soda" },
      { name: "LEMON SODA", price: 4, desc: "Italian lemonade" },
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
