import {z} from 'zod'

export const createPrincipalSchema = z.object({
    customer_code: z.string(),
    customer_name: z.string(),
    customer_desc: z.string().optional(),
    customer_address: z.string().optional(),
    is_active: z.boolean(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional()
})

export const updatePrincipalSchema = createPrincipalSchema.partial()

export const getPrincipalSchema = createPrincipalSchema.partial().extend({
    page: z.string(),
    limit: z.string(),
    search: z.string().nullable().optional(),
})

export const principalIdSchema = z.object({
    id: z.uuid()
})

export type createPrincipalType = z.infer<typeof createPrincipalSchema>
export type updatePrincipalType = z.infer<typeof updatePrincipalSchema>
export type getPrincipalSchemaType = z.infer<typeof getPrincipalSchema>
export type principalIdSchemaType = z.infer<typeof principalIdSchema>