import * as z from "zod";

export const UserSchema = z.object({
    username: z.string().min(5, {message: "Username should be atleast 5 chars"}).max(30, {message: "Username cant be longer than 30 chars"}),
    password: z.string().min(8, {message: "Password should be longer than 8 chars"})
})

export const DocumentSchema = z.object({
  type: z.enum(["Document", "Tweet", "Youtube", "Link"]),
  link: z.url(),
  title: z.string().min(3,{message: "Title should be atleast 3 chars"}).max(64,{message: "Title should be max 64 chars"}),
  description : z.string().min(3,{message: "Description should be atleast 3 chars"}).max(300,{message: "Description should be max 300 chars"}).optional(),
  tags: z.array(
    z.string()
      .min(1)
      .max(32)
      .regex(/^[a-zA-Z0-9-_]+$/, "Invalid tag format")
  ),
  sharable: z.boolean().default(false),
  sharableId: z.string().optional()
})

export const ProfileSchema = z.object({
  username: z.string().min(5, {message: "Username should be atleast 5 chars"}).max(30, {message: "Username cant be longer than 30 chars"}),
  profession: z.string().optional(),
  avatar: z.string().optional(),
  socialLinks: z.object({
    XLink: z.url().optional(),
    InstagramLink: z.url().optional(),
    Whatsapp: z.string().optional,
    MediumLink: z.url().optional()
  }),
  bio: z.string().min(3,{message: "Bio should be atleast 3 chars"}).max(300,{message: "Bio should be max 300 chars"}).optional(),
  publicProfile: z.boolean().default(false)
})

export const ProfileUpdateSchema = ProfileSchema.partial();
export const DocumentUpdateSchema = DocumentSchema.partial();
