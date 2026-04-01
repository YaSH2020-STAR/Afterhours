import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAuthSecret } from "@/lib/auth-secret";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: getAuthSecret(),
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      if (token.sub) {
        try {
          const u = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { onboardingCompleted: true },
          });
          if (u) token.onboardingCompleted = u.onboardingCompleted;
        } catch (e) {
          console.error("[auth jwt] onboarding lookup failed", e);
          token.onboardingCompleted = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
      }
      return session;
    },
  },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    ...(process.env.EMAIL_SERVER
      ? [
          Nodemailer({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM ?? "AfterHours <noreply@example.com>",
          }),
        ]
      : []),
    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
          const password = credentials?.password as string | undefined;
          if (!email || !password) return null;

          const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, passwordHash: true },
          });
          if (!user?.passwordHash) return null;

          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return null;

          return { id: user.id, email: user.email, name: user.name };
        } catch (e) {
          console.error("[auth credentials] authorize failed", e);
          return null;
        }
      },
    }),
  ],
});
