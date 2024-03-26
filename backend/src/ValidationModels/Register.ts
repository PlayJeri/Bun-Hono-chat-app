import { z } from "zod";

const RegisterSchema = z.object({
    username: z.string().min(3).max(32),
    password: z.string().min(6).max(128),
    confirmPassword: z.string().min(6).max(128),
}).superRefine(( { password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: JSON.stringify({
                customCode: "PASSWORDS_DO_NOT_MATCH",
                message: "Passwords do not match"
            })
        })
    }
})

export { RegisterSchema };