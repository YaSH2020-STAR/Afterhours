import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { ensureDemoUser } from "@/lib/ensure-demo-user";
import { prisma } from "@/lib/prisma";

const demoEmails =
  process.env.DEMO_LOGIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean) ?? [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
        const u = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { onboardingCompleted: true },
        });
        if (u) token.onboardingCompleted = u.onboardingCompleted;
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
            from: process.env.EMAIL_FROM ?? "AfterHours <noreply@localhost>",
          }),
        ]
      : []),
    Credentials({
      id: "demo",
      name: "Demo login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
        const password = (credentials?.password as string | undefined)?.trim();
        if (!email || !password) return null;

        const allowedEmail = process.env.ALLOWED_LOGIN_EMAIL?.trim().toLowerCase();
        const allowedPass = process.env.ALLOWED_LOGIN_PASSWORD?.trim();
        if (allowedEmail && allowedPass && email === allowedEmail && password === allowedPass) {
          try {
            return await ensureDemoUser(email);
          } catch (e) {
            console.error("[auth credentials] ensureDemoUser failed", e);
            return null;
          }
        }

        const secret = process.env.DEMO_LOGIN_PASSWORD?.trim();
        if (!secret || demoEmails.length === 0) return null;
        if (!demoEmails.includes(email) || password !== secret) return null;
        try {
          return await ensureDemoUser(email);
        } catch (e) {
          console.error("[auth demo] ensureDemoUser failed", e);
          return null;
        }
      },
    }),
  ],
});
