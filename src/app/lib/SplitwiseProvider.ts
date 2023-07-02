import { Provider } from "next-auth/providers";
import { User } from "./type";

const SPLITWISE_API_URL = "https://secure.splitwise.com";

export const SplitwiseProvider: Provider = {
  id: "splitwise",
  name: "Splitwise",
  type: "oauth",
  version: "2.0",
  authorization: {
    url: `${SPLITWISE_API_URL}/oauth/authorize`,
    params: { scope: "" },
  },
  token: {
    url: `${SPLITWISE_API_URL}/oauth/token`,
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
    url: `${SPLITWISE_API_URL}/api/v3.0/get_current_user`,
    request: (context) =>
      context.client.userinfo(`${context.tokens.access_token}`, {
        method: "GET",
        via: "header",
        tokenType: "Bearer",
      }),
  },
  profile: ({ user }: { user: User }) => {
    return {
      email: user.email,
      image: user.picture.medium,
      name: `${user.first_name} ${user.last_name}`,
      id: user.id.toString(),
    };
  },
};
