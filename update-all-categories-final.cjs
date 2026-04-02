const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const categories = ['books', 'creations', 'downloads', 'games', 'handicrafts', 'journeys', 'languages', 'movies'];

categories.forEach(cat => {
    const filePath = path.join(pagesDir, `${cat}.astro`);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Update the loop to use <a> tag and BASE_URL
    const articleRegex = /<article\s+class="post-item group flex items-center py-6 border-b border-neutral-50 hover:bg-neutral-50\/50 transition-colors"\s+data-title=\{post\.title\.toLowerCase\(\)\}\s+data-class=\{post\.classification \|\| ""\}\s+data-date=\{post\.publishedAt\}\s+>([\s\S]*?)<\/article>/g;
    
    // Check if it's already an <a> tag (like in creations.astro) or needs update
    if (content.includes('<article class="post-item')) {
        content = content.replace(articleRegex, (match, inner) => {
            return `<a 
            href={\`\${import.meta.env.BASE_URL}posts/\${post.slug}/\`}
            class="post-item group flex items-center py-6 border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors no-underline block"
            data-title={post.title.toLowerCase()}
            data-class={post.classification || ""}
            data-date={post.publishedAt}
          >${inner}</a>`;
        });
    }

    // 2. Insert Pagination Logic in the script section
    if (!content.includes('const postsPerPage = 100;')) {
        content = content.replace('const posts = await sanityClient.fetch(query);', 
`const posts = await sanityClient.fetch(query);

const postsPerPage = 100;
const totalPages = Math.ceil(posts.length / postsPerPage);`);
    }

    // 3. Add Pagination UI below the posts container
    if (!content.includes('id="pagination-container"')) {
        const postsContainerEnd = '</div>\n    </div>\n  </div>\n</Layout>';
        const paginationHtml = `
      <!-- Pagination -->
      {totalPages > 1 && (
        <div id="pagination-container" class="mt-12 flex justify-center items-center gap-4">
          <button id="prev-page" class="px-4 py-2 border border-neutral-100 text-[10px] font-aqua tracking-widest text-neutral-300 uppercase hover:border-brand-300 hover:text-brand-900 disabled:opacity-30 disabled:pointer-events-none">Prev</button>
          <span class="text-[11px] font-aqua text-neutral-400 tracking-widest">
            PAGE <span id="current-page-text">1</span> / {totalPages}
          </span>
          <button id="next-page" class="px-4 py-2 border border-neutral-100 text-[10px] font-aqua tracking-widest text-neutral-300 uppercase hover:border-brand-300 hover:text-brand-900 disabled:opacity-30 disabled:pointer-events-none">Next</button>
        </div>
      )}
    </div>
  </div>
</Layout>`;
        content = content.replace(postsContainerEnd, paginationHtml);
    }

    // 4. Update Client Script for Pagination
    if (!content.includes('let currentPage = 1;')) {
        const scriptStart = 'let currentSort = \'desc\';';
        const paginationScript = `let currentPage = 1;
  const postsPerPage = 100;
  let currentSort = 'desc';`;
        content = content.replace(scriptStart, paginationScript);

        const updateDisplayFunc = 'function updateDisplay() {';
        const updateDisplayWithPagination = `function updateDisplay() {
    // 0. Pagination State
    const totalVisible = postItems.filter(item => {
      const title = item.getAttribute('data-title') || "";
      const classification = item.getAttribute('data-class') || "";
      const matchesFilter = currentFilter === 'all' || classification === currentFilter;
      const matchesSearch = title.includes(currentSearch.toLowerCase()) || classification.toLowerCase().includes(currentSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    }).length;
    const maxPage = Math.ceil(totalVisible / postsPerPage) || 1;
    if (currentPage > maxPage) currentPage = maxPage;

    const prevBtn = document.getElementById('prev-page') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-page') as HTMLButtonElement;
    const pageText = document.getElementById('current-page-text');
    if (pageText) pageText.innerText = currentPage.toString();
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === maxPage;

    let visibleCount = 0;
    let matchCount = 0;
`;
        content = content.replace(updateDisplayFunc, updateDisplayWithPagination);

        // Update the filtering loop to handle pagination
        const filterLoopRegex = /\/\/ 1\. Filter & Search[\s\S]*?item\.style\.display = isVisible \? 'flex' : 'none';\s+return isVisible;\s+\}\);/g;
        const newFilterLoop = `// 1. Filter, Search & Pagination
    let visibleItems = postItems.filter(item => {
      const title = item.getAttribute('data-title') || "";
      const classification = item.getAttribute('data-class') || "";
      
      const matchesFilter = currentFilter === 'all' || classification === currentFilter;
      const matchesSearch = title.includes(currentSearch.toLowerCase()) || classification.toLowerCase().includes(currentSearch.toLowerCase());
      
      const isMatch = matchesFilter && matchesSearch;
      
      let isVisible = false;
      if (isMatch) {
         matchCount++;
         if (matchCount > (currentPage - 1) * postsPerPage && matchCount <= currentPage * postsPerPage) {
           isVisible = true;
         }
      }

      item.style.display = isVisible ? 'flex' : 'none';
      return isVisible;
    });`;
        content = content.replace(filterLoopRegex, newFilterLoop);

        // Update Event Listeners to reset page or handle next/prev
        content = content.replace('updateDisplay();', 'currentPage = 1; updateDisplay();'); // For filters/search
        
        // Add Pagination Event Listeners
        const scriptEnd = '</script>';
        const paginationEvents = `
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateDisplay();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const totalVisible = postItems.filter(item => {
        const title = item.getAttribute('data-title') || "";
        const classification = item.getAttribute('data-class') || "";
        return (currentFilter === 'all' || classification === currentFilter) && 
               (title.includes(currentSearch.toLowerCase()) || classification.toLowerCase().includes(currentSearch.toLowerCase()));
      }).length;
      if (currentPage < Math.ceil(totalVisible / postsPerPage)) {
        currentPage++;
        updateDisplay();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
</script>`;
        content = content.replace(scriptEnd, paginationEvents);
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${cat}.astro`);
});
