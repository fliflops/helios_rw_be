import {z} from 'zod'

export const getShipPointSchema = z.object({
    page: z.string(),
    limit: z.string(),
    search: z.string().nullable().optional(),
    ship_point_code: z.string().nullable().optional(),
    ship_point_desc: z.string().nullable().optional(),
    ship_point_address: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    ship_pt_zone: z.string().nullable().optional(),
    postal_code: z.string().nullable().optional(),
    is_active: z.string().nullable().optional()
})

export type getShipPointSchemaType = z.infer<typeof getShipPointSchema>

export const createShipPointSchema = z.object({
    ship_point_code: z.string(),
    ship_point_desc: z.string(),
    ship_point_address: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    ship_pt_zone: z.string().nullable().optional(),
    postal_code: z.string().nullable().optional(),
    is_active: z.boolean()
})

export type createShipPointType = z.infer<typeof createShipPointSchema>