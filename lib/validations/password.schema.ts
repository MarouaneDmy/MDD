import { z } from "zod";
import { PASSWORD_RULES } from "./password-rules";

function checkPassword(value: string, ctx: z.RefinementCtx) {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: rule.message });
    }
  }
}

export const passwordSchema = z.string().superRefine(checkPassword);

export const optionalPasswordSchema = z
  .string()
  .optional()
  .superRefine((value, ctx) => {
    if (value) checkPassword(value, ctx);
  });
