import { SplitwiseProvider } from "@/app/lib/SplitwiseProvider";
import NextAuth, { AuthOptions } from "next-auth";
import { Session } from "next-auth";
import authOptions from "../../../../lib/authOptions";

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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
