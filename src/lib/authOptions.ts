import { AuthOptions } from "next-auth";
import { SplitwiseProvider } from "../app/lib/SplitwiseProvider";
import { CustomSession } from "../app/api/auth/[...nextauth]/route";

const authOptions: AuthOptions = {
  providers: [SplitwiseProvider],
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

export default authOptions;
