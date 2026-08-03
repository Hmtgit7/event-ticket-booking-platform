import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * NextAuth's ONLY job in this app is running Google's OAuth handshake and
 * handing us back a Google ID token - see /auth/oauth-bridge, which exchanges
 * that token with auth-service for our own JWT. NextAuth's session is never
 * used as the app's actual auth state (our zustand store + cookies are).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.googleIdToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      return { ...session, googleIdToken: token.googleIdToken as string | undefined };
    },
  },
});
