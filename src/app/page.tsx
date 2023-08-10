import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import AuthenticationPage from "./components/AuthenticationPage";
import Expenses from "./components/Expenses";

export default async function Home() {
  /* @ts-expect-error Server Component */
  return <Expenses />;
}
