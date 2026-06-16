import { z } from "zod";
import { ROLES } from "../../../constant/role.constant.js";

export const loginSchema = {
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  }),
};

export const registerSchema = {
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: z.string().min(6),
    picture: z.string().trim().url().optional(),
  }),
};

export const makeAdminSchema = {
  body: z.object({
    email: z.string().trim().email(),
    role: z.enum([
      ROLES.ADMIN,
      ROLES.SUPER_ADMIN,
      ROLES.SCORER,
    ]),
  }),
};