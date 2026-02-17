import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          console.log("Authorization failed: Missing credentials");
          return null;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email.toString())) {
          console.log("Authorization failed: Invalid email format");
          return null;
        }

        // Validate password length
        if (credentials.password.toString().length < 6) {
          console.log("Authorization failed: Password too short");
          return null;
        }

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toString() },
          });

          if (!user) {
            console.log("Authorization failed: User not found");
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password.toString(),
            user.password
          );

          if (!isValidPassword) {
            console.log("Authorization failed: Invalid password");
            return null;
          }

          console.log(`Authorization successful for user: ${user.email}`);
          
          // Return user object
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Solo agregar datos del usuario al token en el primer login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Pasar datos del token a la sesión
      if (token.email && token.id) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth?.user?.email;
    },
  },
});
