const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && f !== 'index.astro' && f !== 'search.astro');

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 추출할 카테고리 이름
    const titleMatch = file.match(/^(.+?)\.astro$/);
    const titleRaw = titleMatch ? titleMatch[1] : '';
    const capitalizedTitle = titleRaw.charAt(0).toUpperCase() + titleRaw.slice(1);

    // 상단 스크립트 영역 교체: sanity 데이터 페칭 구문 추가
    content = content.replace(
        /\/\/ 예: const posts = await Astro\.glob\('..\/posts\/\$\{titleRaw\}\/\*\.md'\);\nconst posts = \[\]; \/\/ 현재는 글이 없다고 가정합니다\./,
        `import { sanityClient } from "sanity:client";\n\nconst query = \`*[_type == "post" && category->title == "${capitalizedTitle}"] | order(publishedAt desc)\`;\nconst posts = await sanityClient.fetch(query);`
    );

    // 빈 화면 부분에서 "null" 에러가 날 수 있는 참조 교체 (post.frontmatter.title -> post.title)
    content = content.replace(/post\.frontmatter\.title/g, 'post.title');
    content = content.replace(/post\.frontmatter\.description/g, 'post.excerpt || ""');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Integrated Sanity fetching logic into ${file}`);
}
