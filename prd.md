# Product Requirements Document (PRD): Inner Cartography

## 1. Overview
Inner Cartography is a heavily aesthetics-focused personal blog and archive ("An Atlas of the Mind"). The project uses Astro for its lightning-fast static generation and dynamic capabilities, styled with Tailwind CSS, and uses Sanity.io as its headless CMS for a comfortable writing experience.

## 2. Target Audience & Goal
- **Audience:** Visitors looking for curated thoughts, reviews, and personal archives in a beautifully formatted UI.
- **Goal:** To provide the author with a seamless, comfortable Markdown/Block-based writing environment while presenting the content to readers in a layout that feels like a premium, dynamic digital atlas.

## 3. Core Features
- **Sidebar Navigation:** Expandable sidebar containing an index of all categories (`Journeys`, `Games`, `Books`, `Movies`, `Handicrafts`, `Languages`, `Creations`, `Nodabit`, `Downloads`) and a search tool.
- **Search System:** Keyword search across all articles with Date ascending/descending sorting.
- **Typography & Aesthetics:** 
  - Main Titles: Aqua Grotesque (Uppercase, subtle grayscale)
  - Subtitles & Categories: Roboto Slab (Normal, brand sky blue)
- **Headless CMS Integration:** Sanity.io configuration for easy writing, editing, and publishing without touching code.

## 4. Technical Stack
- Main Framework: Astro
- Styling: Tailwind CSS
- CMS: Sanity.io (`@sanity/client`, `@portabletext/react`)
- Deployment: Vercel / Netlify (TBD)
