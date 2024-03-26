import { z } from "zod";

export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(6).max(128),
    newPassword: z.string().min(6).max(128),
    confirmPassword: z.string().min(6).max(128),
}).superRefine(( { newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: JSON.stringify({
                customCode: "PASSWORDS_DO_NOT_MATCH",
                message: "Passwords do not match"
            })
        })
    }
})