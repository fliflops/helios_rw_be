import z from "zod"

export const roleAccessSchema = z.object({
    id: z.uuid().nullable().optional(),
    role_id: z.uuid().nullable().optional(),
    header_key: z.string(),
    module_key: z.string(),
    module_name: z.string(),
    view: z.boolean().optional().default(false),
    edit: z.boolean().optional().default(false),
    create: z.boolean().optional().default(false),
    export: z.boolean().optional().default(false),
})

export const roleSchema = z.object({
    role_name: z.string(),
    is_active: z.boolean().optional().default(true),
    is_admin: z.boolean().optional(),
    modules: z.array(roleAccessSchema).optional(),
})

export const updateRoleSchema = roleSchema.partial()

export const getRoleSchema = updateRoleSchema.extend({
    page: z.string(),
    limit: z.string(),
    search: z.string().nullable().optional(),
})

export const getRoleAccessSchema = roleAccessSchema.partial().extend({
    page: z.string(),
    limit: z.string(),
    search: z.string().nullable().optional(),
})

export const roleIdSchema = z.object({
    id: z.uuid()
})

export type roleType = z.infer<typeof roleSchema>
export type roleAccessType = z.infer<typeof roleAccessSchema>
export type getRoleAccessType = z.infer<typeof getRoleAccessSchema>
export type updateRoleType = z.infer<typeof updateRoleSchema>
export type getRoleType = z.infer<typeof getRoleSchema>
export type roleIdType = z.infer<typeof roleIdSchema>