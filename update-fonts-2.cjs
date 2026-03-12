const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && f !== 'index.astro');

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Title: uppercase, 50px, neutral-400
    content = content.replace(/class="text-4xl md:text-5xl text-neutral-600 font-aqua font-normal capitalize mb-4"/g, 'class="text-[50px] text-neutral-400 font-aqua font-normal uppercase mb-4 tracking-widest"');
    content = content.replace(/class="text-3xl md:text-4xl text-neutral-600 font-aqua font-normal uppercase"/g, 'class="text-[50px] text-neutral-400 font-aqua font-normal uppercase tracking-widest"');

    // Subtitle: brand-800, font-normal
    content = content.replace(/text-neutral-500 font-roboto-slab font-thin/g, 'text-brand-800 font-roboto-slab font-normal');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated fonts in ${file}`);
}
