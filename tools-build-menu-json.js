const fs = require('fs');
const SRC = '/Users/giuliano/Desktop/menu/menu-data.js';
const OUT = '/Users/giuliano/Desktop/menu/menu.json';
const code = fs.readFileSync(SRC, 'utf8');
const window = {};
new Function('window', code)(window);
const sections = window.MENU_SECTIONS || [];
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
  .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const cents = n => Math.round(Number(n) * 100);
const out = { generatedFrom: 'menu-data.js', currency: 'USD', items: [], builder: null };
for (const sec of sections) {
  if (sec.type === 'builder') {
    out.builder = {
      id: slug(sec.title || sec.id),
      name: sec.title,
      baseCents: cents(sec.base || 0),
      groups: (sec.groups || []).map(g => ({
        title: g.title,
        options: g.items.map(it => ({ id: 'addon-' + slug(it.name), name: it.name, priceCents: cents(it.price || 0) }))
      }))
    };
  } else if (sec.type === 'list') {
    for (const it of (sec.items || [])) {
      if (typeof it.price !== 'number') continue; // skip price-less placeholders (snack/special of the day)
      out.items.push({ id: slug(sec.id) + '-' + slug(it.name), section: sec.title, name: it.name, priceCents: cents(it.price) });
    }
  }
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log('orderable items:', out.items.length);
console.log('builder groups:', out.builder ? out.builder.groups.map(g=>g.title+'('+g.options.length+')').join(', ') : 'none');
