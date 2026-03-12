const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

// 인덱스, 서치, 그리고 기타 비카테고리 폴더 제외하고 실제 글 목록이 들어갈 수 있는 카테고리만 필터링합니다.
// (search, nodabit, downloads 도 일단 "비어있음" 표시가 들어갈 수 있게 전부 덮어씌웁니다. 원하신다면 필터링 조정 가능)
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && f !== 'index.astro' && f !== 'search.astro');

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    // 원본 타이틀 이름 추출 (예: 'journeys.astro' -> 'Journeys')
    const titleMatch = file.match(/^(.+?)\.astro$/);
    const titleRaw = titleMatch ? titleMatch[1] : '';
    const title = titleRaw.charAt(0).toUpperCase() + titleRaw.slice(1);
    const uppercaseTitle = title.toUpperCase();

    const newContent = `---
// Layout과 향후 글 목록을 불러올 때 사용할 수 있는 컴포넌트들을 임포트합니다.
import Layout from '../layouts/Layout.astro';

// 향후 Markdown 렌더링이나 글 목록을 이 위치에서 fetch 합니다.
// 예: const posts = await Astro.glob('../posts/${titleRaw}/*.md');
const posts = []; // 현재는 글이 없다고 가정합니다.
---

<Layout title="${title}">
  <div class="w-full min-h-screen flex flex-col items-center justify-start bg-white p-8 pt-24 pr-24">
    <!-- 페이지 상단 헤더 구역 -->
    <div class="w-full max-w-4xl flex flex-col items-center justify-center mb-16 border-b border-neutral-100 pb-12">
      <h1 class="text-[50px] text-neutral-400 font-aqua font-normal uppercase mb-4 tracking-widest text-center">
        ${uppercaseTitle}
      </h1>
      <p class="text-brand-800 font-roboto-slab font-normal uppercase tracking-widest text-sm text-center">
        Explore the ${titleRaw}
      </p>
    </div>

    <!-- 글 목록 및 Empty State 표시 구역 -->
    <div class="w-full max-w-4xl flex flex-col items-center justify-center flex-1">
      {posts.length > 0 ? (
        <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 글이 있을 때 배열을 순회하며 카드나 리스트 형태로 보여줍니다 -->
          {posts.map(post => (
            <article class="border border-neutral-200 p-6 hover:shadow-md transition-shadow">
              <h2 class="font-aqua text-neutral-600 text-xl">{post.frontmatter.title}</h2>
              <p class="font-roboto-slab text-neutral-400 mt-2">{post.frontmatter.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <!-- 글이 비어있을 때 (Empty State) 보여지는 디자인 -->
        <div class="flex flex-col items-center justify-center space-y-6 opacity-60 mt-12 mb-auto">
          <!-- 빈 상태 이미지/일러스트가 들어갈 플레이스홀더 -->
          <div class="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-dashed border-brand-300 flex items-center justify-center bg-brand-50/50">
            <svg class="w-12 h-12 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <!-- 'Empty...' 텍스트 (서브타이틀 폰트 적용) -->
          <span class="font-roboto-slab font-normal text-brand-700 text-lg uppercase tracking-[0.3em]">
            Empty...
          </span>
        </div>
      )}
    </div>
  </div>
</Layout>
`;

    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated layout and empty state for ${file}`);
}
