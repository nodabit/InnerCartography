import { sanityClient } from "sanity:client";

export async function getPostsByCategory(categoryTitle) {
    // 특정 카테고리의 이름을 가진 참조(Reference)를 찾아서 그에 속한 글들만 가져옵니다.
    // 카테고리를 소문자로 변환하여 비교할 수도 있지만, 우선 Sanity 스키마의 category.title 정방향 일치를 기준으로 합니다.
    const query = `*[_type == "post" && category->title == $categoryTitle] | order(publishedAt desc) {
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage {
      asset->{
        _id,
        url
      }
    }
  }`;

    const posts = await sanityClient.fetch(query, { categoryTitle });
    return posts;
}

export async function getSearchPosts(keyword) {
    // 제목, 내용 등에 검색어가 포함된 모든 글을 가져옵니다.
    const query = `*[_type == "post" && (title match $keyword || excerpt match $keyword || pt::text(body) match $keyword)] | order(publishedAt desc) {
    title,
    slug,
    publishedAt,
    excerpt,
    category->{
        title
    },
    mainImage {
      asset->{
        _id,
        url
      }
    }
  }`;

    const posts = await sanityClient.fetch(query, { keyword: `*${keyword}*` });
    return posts;
}
