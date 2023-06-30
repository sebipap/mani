import axios from "axios";
import NextAuth, { AuthOptions, Profile } from "next-auth";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  registration_status: string;
  notifications_read: string;
  notifications_count: number;
  default_currency: string;
  locale: string;
  picture: { medium: string };
};

export interface CustomSession extends Session {
  accessToken?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    {
      id: "splitwise",
      name: "Splitwise",
      type: "oauth",
      version: "2.0",

      authorization: {
        url: "https://secure.splitwise.com/oauth/authorize",
        params: { scope: "" },
      },
      token: {
        url: "https://secure.splitwise.com/oauth/token",
        params: { grant_type: "authorization_code" },
        request: (context) =>
          context.client
            .grant({
              grant_type: "authorization_code",
              code: context.params.code,
              redirect_uri: context.provider.callbackUrl,
              client_id: context.provider.clientId,
              client_secret: context.provider.clientSecret,
            })
            .then((response) => ({
              tokens: response,
            })),
      },
      clientId: process.env.SPLITWISE_CLIENT_ID,
      clientSecret: process.env.SPLITWISE_CLIENT_SECRET,
      userinfo: {
        url: "https://secure.splitwise.com/api/v3.0/get_current_user",
        request: (context) =>
          axios
            .get<{ user: User }>((context.provider.userinfo as any).url, {
              headers: {
                Authorization: `Bearer ${context.tokens.access_token}`,
              },
            })
            .then((result) => result.data.user),
      },
      profile: (profile: User) => ({
        email: profile.email,
        image: profile.picture.medium,
        name: `${profile.first_name} ${profile.last_name}`,
        id: profile.id.toString(),
      }),
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      (session as CustomSession).accessToken = token.accessToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
