import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import AuthenticationPage from "./components/AuthenticationPage";
import Expenses from "./components/Expenses";

export default async function Home() {
  const session = await getServerSession(authOptions);
  /* @ts-expect-error Server Component */
  return <div>{session ? <Expenses /> : <AuthenticationPage />}</div>;
}
