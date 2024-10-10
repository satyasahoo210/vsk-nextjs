import { auth } from "@/auth";

export const {
  user: { role, image = "/images/avatar.png", name },
  userId,
} = (await auth())!!;
