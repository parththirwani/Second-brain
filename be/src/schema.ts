import * as z from "zod";

export const UserSchema = z.object({
    username: z.string().min(5, {message: "Username should be atleast 5 chars"}).max(30, {message: "Username cant be longer than 30 chars"}),
    password: z.string().min(8, {message: "Password should be longer than 8 chars"})
})

export const DocumentSchema = z.object({
  type: z.enum(["Document", "Tweet", "Youtube", "Link"]),
  link: z.url(),
  title: z.string().min(3,{message: "Title should be atleast 3 chars"}).max(64,{message: "Title should be max 64 chars"}),
  tags: z.array(
    z.string()
      .min(1)
      .max(32)
      .regex(/^[a-zA-Z0-9-_]+$/, "Invalid tag format")
  ),
  sharable: z.boolean().default(false),
  sharableId: z.string().optional()
})