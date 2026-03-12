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

    // 1. 스크립트 영역 교체 (더 공격적인 매칭)
    const scriptRegex = /---\s*[\s\S]*?\s*const posts = \[\];[\s\S]*?---/;
    const newScript = `---
import Layout from '../layouts/Layout.astro';
import { sanityClient } from "sanity:client";

const query = \`*[_type == "post" && category->title == "${capitalizedTitle}"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "mainImage": mainImage.asset->url
}\`;
const posts = await sanityClient.fetch(query);
console.log('Fetched posts for ${capitalizedTitle}:', posts.length);
---`;
    content = content.replace(scriptRegex, newScript);

    // 2. Empty State UI 제거 (기존 {posts.length > 0 ? (...) : (...)} 패턴 매칭)
    // 35번 라인 근처의 Empty State 부분을 날려버리고 단순 리스트만 남깁니다.
    const emptyStateRegex = /\{\s*posts\.length\s*>\s*0\s*\?\s*\([\s\S]*?\)\s*:\s*\([\s\S]*?<!-- 'Empty\.\.\.' 텍스트 [\s\S]*?<\/span>\s*<\/div>\s*\)\s*\}/;

    const newListUI = `<div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map(post => (
        <article class="border border-neutral-200 p-6 hover:shadow-md transition-shadow">
          {post.mainImage && (
            <img src={post.mainImage} alt={post.title} class="w-full h-48 object-cover mb-4" />
          )}
          <h2 class="font-aqua text-neutral-600 text-xl">{post.title}</h2>
          <p class="font-roboto-slab text-neutral-400 mt-2 text-sm">{post.excerpt || ""}</p>
          <span class="text-xs text-neutral-300 mt-4 block">{new Date(post.publishedAt).toLocaleDateString()}</span>
        </article>
      ))}
    </div>`;

    content = content.replace(emptyStateRegex, newListUI);

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}: Removed Empty state and injected Sanity logic.`);
}
