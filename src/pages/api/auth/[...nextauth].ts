import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    // async jwt({ token, user, account, profile }) {
    //   if (user) {
    //     token.accessToken = account?.access_token;
    //     token.id = user.id;
    //   }
    //   return token;
    // },
    async session({ session, token, user }) {
      // session.accessToken = token.accessToken as string;

      if (session.user) {
        session.user.id = user.id as string;
      }

      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      token: "https://discord.com/api/oauth2/token",
      authorization: { params: { scope: "identify" } },
    }),
    // ...add more providers here
  ],
  // session: {
  //   strategy: "jwt",
  // },
  secret: process.env.NEXTAUTH_URL,
  // jwt: {
  //   secret: process.env.NEXTAUTH_JWT_SECRET,
  // },
};

export default NextAuth(authOptions);
