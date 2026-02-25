/**
 * Phase 2 — NextAuth configuration with Credentials provider
 * Role-based session: id, role, name, phone, city
 */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

/** Role → protected path prefix */
export const ROLE_DASHBOARDS = {
  LABOUR: "/dashboard/labour",
  CONTRACTOR: "/dashboard/contractor",
  ADMIN: "/admin",
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone.trim() },
        });

        if (!user || !user.password) return null;

        const valid = await compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          city: user.city,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.city = user.city;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.city = token.city;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign in, redirect to role-specific dashboard if no custom url
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin !== baseUrl) return baseUrl;
      return url;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export default handler;
export { authOptions };
