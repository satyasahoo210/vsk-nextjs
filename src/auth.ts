import NextAuth from "next-auth";
import "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import { SignInSchema } from "./lib/definitions";
import { Admin, Parent, Role, Student, Teacher } from "@prisma/client";
import { compareSync } from "bcrypt-ts";
import { routeAccessMap } from "./lib/settings";

type MergeUnionOfRecordTypes<U extends Record<string, unknown>> = {
  [K in U extends unknown ? keyof U : never]: U extends unknown
    ? K extends keyof U
      ? U[K]
      : never
    : never;
};
export type UserType = MergeUnionOfRecordTypes<
  Admin | Teacher | Student | Parent | { role: Role; name: string }
>;

declare module "next-auth" {
  interface Session {
    user: { role: Role; name: string; image: string };
    userId: string;
  }
}

const DEFAULT_IMAGE = "/images/avatar.png";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { username, password } = await SignInSchema.parseAsync({
          username: credentials.username,
          password: credentials.password,
        });

        try {
          return await getUserFromDb(username, password);
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/logout",
  },
  session: { strategy: "jwt", maxAge: 1 * 60 * 60 },
  callbacks: {
    authorized: async ({ auth, request }) => {
      if (!!auth) {
        const pathname = request.nextUrl.pathname;
        for (const [pathPattern, allowedRoles] of Object.entries(
          routeAccessMap
        )) {
          if (
            (pathname === pathPattern || pathname.startsWith(pathPattern)) &&
            !allowedRoles.includes(auth.user.role)
          ) {
            console.log(pathname);
            return false;
          }
        }

        return true;
      } else {
        return false;
      }
    },
    jwt({ trigger, user, token }) {
      if (trigger === "signIn") {
        const { id, img, firstName, lastName, username, role } =
          user as UserType;
        token.name = [firstName, lastName].join(" ").trim() || username;
        token.id = id;
        token.role = role;
        token.picture = img || DEFAULT_IMAGE;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.role = token.role as Role;
      session.user.image = token.picture!!;
      session.userId = token.id as string;
      return session;
    },
  },
  jwt: {},
});

const getUserFromDb = async (username: string, password: string) => {
  const data = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (data !== null && compareSync(password, data.secret)) {
    let user;
    switch (data.role) {
      case Role.ADMIN:
        user = await prisma.admin.findUnique({ where: { id: data.id } });
        break;
      case Role.TEACHER:
        user = await prisma.teacher.findUnique({
          where: { id: data.id },
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            img: true,
          },
        });
        break;
      case Role.STUDENT:
        user = await prisma.student.findUnique({
          where: { id: data.id },
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            img: true,
          },
        });
        break;
      case Role.PARENT:
        user = await prisma.parent.findUnique({
          where: { id: data.id },
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            img: true,
          },
        });
        break;
      default:
        return null;
    }

    return { ...user, role: data.role };
  } else {
    return null;
  }
};
