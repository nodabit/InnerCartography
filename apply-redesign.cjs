const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') && f !== 'index.astro' && f !== 'search.astro');

// Get the template from journeys.astro (which we just updated)
const templatePath = path.join(pagesDir, 'journeys.astro');
const template = fs.readFileSync(templatePath, 'utf-8');

for (const file of files) {
    if (file === 'journeys.astro') continue; // already updated

    const filePath = path.join(pagesDir, file);
    const titleRaw = file.replace('.astro', '');
    const capitalizedTitle = titleRaw.charAt(0).toUpperCase() + titleRaw.slice(1);
    const upperTitle = titleRaw.toUpperCase();

    let newContent = template;

    // Replace categoryName variable
    newContent = newContent.replace(/const categoryName = "Journeys";/, `const categoryName = "${capitalizedTitle}";`);

    // The rest of the content uses {categoryName}, so it should be fine.
    // Except the uppercase matches if any were hardcoded, but I used {categoryName} in the template.

    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${file} with the new redesign template.`);
}
