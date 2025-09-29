import {optional, z} from 'zod'

export const createUserSchema = z.object({
    email: z.string(),
    password: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    role_id: z.uuid(),
    is_active: z.boolean().optional(),
    is_new: z.boolean().optional(),
    is_lock: z.boolean().optional(),
    is_reset: z.boolean().optional(),
})

export const updateUserSchema = createUserSchema.partial()

export const getUserSchema = createUserSchema.partial().extend({
    page: z.string(),
    limit: z.string(),
    search: z.string().nullable().optional(),
})

export const userIdSchema = z.object({
    id: z.uuid()
})

export type createUserType = z.infer<typeof createUserSchema>
export type updateUserType = z.infer<typeof updateUserSchema>
export type getUserSchemaType = z.infer<typeof getUserSchema>
export type userIdSchemaType = z.infer<typeof userIdSchema>