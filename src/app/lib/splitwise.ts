import { Expense, ExpenseResponse } from "./type";

type ExpensesQueryParams = {
  group_id?: number;
  friend_id?: number;
  dated_after?: Date;
  dated_before?: Date;
  updated_after?: Date;
  updated_before?: Date;
  limit?: number | null;
  offset?: number;
};

export async function fetchExpenses(
  accessToken: string
): Promise<ExpenseResponse[]> {
  const queryParams: ExpensesQueryParams = {
    limit: null,
  };

  const urlParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [
        key,
        value?.toString() || "",
      ])
    )
  );

  const { expenses } = await fetch(
    `https://secure.splitwise.com/api/v3.0/get_expenses?${urlParams}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  ).then((res) => res.json());

  return expenses;
}

export async function getExpenses(accessToken: string): Promise<Expense[]> {
  const expenses = await fetchExpenses(accessToken);

  if (!expenses) return [];

  const notDeletedExpenses = expenses.filter(({ deleted_at }) => !deleted_at);

  return notDeletedExpenses.map((expense) => {
    const {
      id,
      description,
      details,
      payment,
      currency_code,
      repayments,
      date,
      created_at,
      deleted_at,
      category,
      users,
      cost,
    } = expense;
    return {
      id,
      description,
      details,
      payment,
      currencyCode: currency_code,
      date: new Date(date),
      createdAt: new Date(created_at),
      deletedAt: new Date(deleted_at),
      category,
      users,
      groupTotal: Number(cost),
      cost: expenseShareCost(expense),
    };
  });
}

/**
 * get how much is your share of an expense.
 * examples for a $100 expense:
 * 1. no repayments, you are the creator: $100
 * 2. one repayment from someone else to me of $100: $100
 * 3. one repayment from me to someone else of $100: $0
 * 4. one repayment from someone else to me of $70: $30
 * 5. one repayment from me to someone else of $70: $70
 */
export function expenseShareCost(expense: ExpenseResponse) {
  const myId = Number(process.env.NEXT_PUBLIC_SPLITWISE_USER_ID);

  if (!myId)
    throw new Error(
      `NEXT_SPLITWISE_USER_ID env variable is not set, ${process.env.NEXT_PUBLIC_SPLITWISE_USER_ID}`
    );

  if (expense.repayments.length === 0) {
    return parseFloat(expense.cost);
  }

  let totalSpent = 0;
  for (const repayment of expense.repayments) {
    const { amount, from: expenseBorrower, to: expensePayer } = repayment;

    if (expenseBorrower === myId) {
      totalSpent += parseFloat(amount);
    }
    if (expensePayer === myId) {
      totalSpent += parseFloat(expense.cost) - parseFloat(amount);
    }
  }
  return totalSpent;
}
