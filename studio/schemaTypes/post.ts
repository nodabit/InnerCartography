import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
        defineField({
            name: 'classification',
            title: 'Classification (말머리)',
            type: 'string',
            description: '글의 분류/말머리 (예: [여행], [일상], [리뷰] 등)',
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: '포스트 제목',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
            description: 'URL 경로 이름',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (Rule) => Rule.required(),
            description: '작성할 카테고리 분류 (ex. Journeys, Games)',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
            description: '이 글의 작성/발행 시각',
            initialValue: () => new Date().toISOString()
        }),
        defineField({
            name: 'mainImage',
            title: 'Main image',
            type: 'image',
            options: {
                hotspot: true,
            },
            description: '커버 이미지',
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            description: '목록에 표시될 짧은 요약 내용 (카드 뷰 등)',
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            of: [
                { type: 'block' },
                {
                    type: 'image',
                    options: { hotspot: true },
                },
            ],
            description: '본문 텍스트 에디터',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            category: 'category.title',
            media: 'mainImage',
        },
        prepare(selection) {
            const { category } = selection
            return { ...selection, subtitle: category && `카테고리: ${category}` }
        },
    },
})
