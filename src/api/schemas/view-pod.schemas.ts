import {z} from 'zod'

export const getPODSchema = z.object({
    page: z.string(),
    limit: z.string(),
    search: z.string().optional(),
    location_code: z.string().optional(),
    ship_to_code: z.string().optional(),
    principal: z.string().optional(),
    delivery_status: z.string().optional(),
    rud_status: z.string().optional(),
    delivery_date_from: z.string().optional(),
    delivery_date_to: z.string().optional(),

})

export type getPODSChemaType = z.infer<typeof getPODSchema>