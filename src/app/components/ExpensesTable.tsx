import { Badge, TableBody, TableCell, TableRow } from "@tremor/react";
import { Expense } from "../lib/type";
import { formatDate } from "../lib/utils";

type Props = {
  expenses: Expense[];
};

export const ExpensesTable = ({ expenses }: Props) => (
  <TableBody>
    {expenses.map((expense) => {
      const {
        category,
        cost,
        date,
        id,
        currencyCode,
        description,
        users,
        groupTotal,
      } = expense;
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
            {currencyCode} {groupTotal}
          </TableCell>
          <TableCell>{cost}</TableCell>

          <TableCell>{formatDate(new Date(date).getTime())}</TableCell>

          <TableCell>
            {users.map(({ user }) => (
              <Badge key={user.id}>
                {user.first_name} {user.last_name}
              </Badge>
            ))}
          </TableCell>
        </TableRow>
      );
    })}
  </TableBody>
);
