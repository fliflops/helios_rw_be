import {z} from 'zod'


export const createLocationSchema = z.object({
    loc_code: z.string(),
    loc_name: z.string(),
    is_active: z.boolean()
})

export type createLocationType = z.infer<typeof createLocationSchema>

export const getLocationSchema = createLocationSchema.partial().extend({
    page: z.string(),
    limit: z.string(),
    search: z.string().nullable().optional(),
    id: z.uuid().nullable().optional(),
})

export type getLocationSchemaType = z.infer<typeof getLocationSchema>