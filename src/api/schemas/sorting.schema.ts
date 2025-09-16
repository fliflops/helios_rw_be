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

export const getSortingCountSchema = z.object({
    service_type:       z.string(),
    principal:          z.string(),
    ship_to_code:       z.string().optional(),
    location_code:      z.string(),
    delivery_date_from: z.string(),
    delivery_date_to:   z.string()
})

export type getSortingCountType = z.infer<typeof getSortingCountSchema>
