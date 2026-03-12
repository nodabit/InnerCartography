const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && f !== 'index.astro' && f !== 'search.astro');

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // "EMPTY..." 대문자 강제 정렬을 지우고 "Empty..." 형태로 변경
    content = content.replace(/<span class="font-roboto-slab font-normal text-brand-700 text-lg uppercase tracking-\[0\.3em\]">\s*Empty\.\.\.\s*<\/span>/, '<span class="font-roboto-slab font-normal text-brand-700 text-lg tracking-[0.3em]">\n            Empty...\n          </span>');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated Empty text casing in ${file}`);
}
