import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: '카테고리 이름 (예: Journeys, Games, Books 등)',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: '카테고리에 대한 짧은 설명',
        }),
    ],
})
