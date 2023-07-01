import { Badge } from "@/components/ui/badge";
import { Expense } from "../lib/type";
import { formatDate } from "../lib/utils";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

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
          <TableCell>{description}</TableCell>
          <TableCell>
            <Badge>{category.name}</Badge>
          </TableCell>
          <TableCell>
            {currencyCode} {groupTotal}
          </TableCell>
          <TableCell>{cost}</TableCell>

          <TableCell>{formatDate(new Date(date).getTime())}</TableCell>

          <TableCell>
            <div className="flex gap-2">
              {users.map(({ user }) => (
                <Badge key={user.id}>
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </Badge>
              ))}
            </div>
          </TableCell>
        </TableRow>
      );
    })}
  </TableBody>
);
