import { defaultSchema } from 'rehype-sanitize';

export const sanitizeSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        a: [
            ...(
                defaultSchema.attributes?.a ?? []
            ), 'target', 'rel'
        ],
        img: [
            ...(
                defaultSchema.attributes?.img ?? []
            ), 'src', 'alt', 'title'
        ]
    }
};