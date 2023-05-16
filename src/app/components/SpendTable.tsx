"use client";

import { Expense } from "@/app/lib/type";
import { StatusOnlineIcon } from "@heroicons/react/outline";

import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Title,
  Badge,
} from "@tremor/react";
import { formatDate } from "../lib/utils";

type Props = {
  expenses: Expense[];
};

export const SpendTable = ({ expenses }: Props) => (
  <Card>
    <Title>Last Spendings</Title>
    <Table className="mt-5">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Details</TableHeaderCell>
          <TableHeaderCell>Cost</TableHeaderCell>
          <TableHeaderCell>Created At</TableHeaderCell>
          <TableHeaderCell>Users</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {expenses.map(
          ({
            category,
            cost,
            created_at,
            id,
            currency_code,
            description,
            users,
          }) => (
            <TableRow key={id}>
              <TableCell>
                {description} <Badge>{category.name}</Badge>
              </TableCell>
              <TableCell>
                {currency_code} {cost}
              </TableCell>

              <TableCell>
                {formatDate(new Date(created_at).getTime())}
              </TableCell>

              <TableCell>
                {users.map(({ user, user_id }) => (
                  <Badge key={user_id}>
                    {user.first_name} {user.last_name}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  </Card>
);
