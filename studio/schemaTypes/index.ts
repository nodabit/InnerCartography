import category from './category'
import post from './post'

export const schemaTypes = [
    category,
    post,
    {
        name: 'test',
        title: 'Test Connection',
        type: 'document',
        fields: [
            {
                name: 'name',
                title: 'Name',
                type: 'string',
            },
        ],
    },
]
