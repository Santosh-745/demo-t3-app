import z from 'zod';

export const todoInput = z.object({
    title: z.string({ required_error: 'Title required' })
        .min(1)
        .max(50)
})