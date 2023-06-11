import { Badge, TableBody, TableCell, TableRow } from "@tremor/react";
import { Expense } from "../lib/type";
import { expenseShareCost, formatDate } from "../lib/utils";

type Props = {
  expenses: Expense[];
};

export const ExpensesTable = ({ expenses }: Props) => (
  <TableBody>
    {expenses.map((expense) => {
      const { category, cost, date, id, currency_code, description, users } =
        expense;
      return (
        <TableRow
          key={id}
          onClick={() => {
            // copy stringified expense to clipboard
            navigator.clipboard.writeText(JSON.stringify(expense));
          }}
        >
          <TableCell>
            {description} <Badge>{category.name}</Badge>
          </TableCell>
          <TableCell>
            {currency_code} {cost}
          </TableCell>
          <TableCell>{expenseShareCost(expense)}</TableCell>

          <TableCell>{formatDate(new Date(date).getTime())}</TableCell>

          <TableCell>
            {users.map(({ user, user_id }) => (
              <Badge key={user_id}>
                {user.first_name} {user.last_name}
              </Badge>
            ))}
          </TableCell>
        </TableRow>
      );
    })}
  </TableBody>
);
