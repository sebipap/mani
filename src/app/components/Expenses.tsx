import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../api/auth/[...nextauth]/route";
import { Profile } from "./Profile";
import { getExpenses } from "../lib/splitwise";
import { Chat } from "./Chat";
import { SpendChart } from "./SpendChart";
import { ExpensesTiles } from "./ExpensesTiles";
import { RecurrentExpenses } from "./RecurrentExpenses";
import { HistoricExpenses } from "./HistoricExpenses";

const Expenses = async () => {
  const session = await getServerSession(authOptions);

  const { accessToken } = (session as CustomSession | null) || {
    accessToken: undefined,
  };

  const expenses =
    session && accessToken ? await getExpenses(accessToken) : null;

  return (
    <>
      <Profile />
      {expenses && (
        <>
          <Chat {...{ expenses }} />
          <SpendChart {...{ expenses }} />
          <ExpensesTiles {...{ expenses }} />
          <RecurrentExpenses {...{ expenses }} />
          <HistoricExpenses {...{ expenses }} />
        </>
      )}
    </>
  );
};

export default Expenses;
