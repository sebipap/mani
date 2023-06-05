'use client'

import { ChangeEvent, useCallback, useState } from 'react'

import { Expense } from '@/app/lib/type'

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
  TextInput,
} from '@tremor/react'
import { formatDate } from '../lib/utils'

type Props = {
  expenses: Expense[]
}

export const SpendTable = ({ expenses }: Props) => {
  const [expensesShown, setExpensesShown] = useState<Expense[]>(expenses)

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!expenses) return

      const {
        target: { value },
      } = event

      if (!value || value === '') return

      const filteredExpenses = expenses.filter(({ description }) =>
        description.toLowerCase().includes(value.toLowerCase())
      )

      setExpensesShown(filteredExpenses)
    },
    [expenses]
  )

  return (
    <Card>
      <Title>Last Spendings</Title>
      <TextInput
        className="mt-5"
        onChange={handleInputChange}
        name={'expense-search'}
        placeholder={'Search for a specific spend'}
        disabled={!expenses}
      />
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
          {expensesShown.map(
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
  )
}
