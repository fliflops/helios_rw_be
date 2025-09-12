import {z} from 'zod'

export const getBarcodeSchema = z.object({
    page: z.string(),
    limit: z.string(),
    search: z.string().optional(),
    location: z.string().optional(),
    is_assigned: z.string().optional()
})

export type getBarcodeSchemaType = z.infer<typeof getBarcodeSchema>

export const createBarcodeSchema = z.object({
    location: z.string(),
    count: z.number()
})

export type createBarcodeType = z.infer<typeof createBarcodeSchema>
