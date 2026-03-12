const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && f !== 'index.astro');

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // h1 변경: text-neutral-800 font-bodoni font-bold -> text-neutral-600 font-aqua font-normal
  content = content.replace(/text-neutral-800 font-bodoni font-bold/g, 'text-neutral-600 font-aqua font-normal');

  // p 변경 (category page, p class): font-montserrat uppercase -> font-roboto-slab font-thin uppercase
  content = content.replace(/font-montserrat uppercase/g, 'font-roboto-slab font-thin uppercase');

  // p 변경 (search page)
  content = content.replace(/font-montserrat tracking-widest text-\[11px\] uppercase/g, 'font-roboto-slab font-thin tracking-widest text-[11px] uppercase');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated fonts in ${file}`);
}
