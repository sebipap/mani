import { startOfWeek } from "date-fns";
import { CategoryInsights, Expense } from "./type";

export function groupByCategory(expenses: Expense[]): CategoryInsights[] {

	const categoryIds = [... new Set(expenses.map(expense => expense.category.id))]

	const categoryInsights = categoryIds.map(categoryId => ({
		id: categoryId,
		name: expenses.find(expense => expense.category.id === categoryId)?.category.name || '',
		total: expenses.filter(expense => expense.category.id === categoryId).reduce((acc, expense) => acc + expenseShareCost(expense), 0),
		currency_code: expenses.find(expense => expense.category.id === categoryId)?.currency_code || ''
	}))

	return categoryInsights.sort((a, b) => b.total - a.total)

}

export function groupByCategoryByDay(expenses: Expense[]): Record<number, CategoryInsights[]> {

	const expensesByDay: Record<number, Expense[]> = expenses.reduce((acc, expense) => {
		const date = new Date(expense.date)
		const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
		return {
			...acc,
			[day]: [...(acc[day] || []), expense]
		}
	}
		, {} as Record<number, Expense[]>)


	const expByDay = Object.entries(expensesByDay).reduce((acc, [day, expenses]) => ({
		...acc,
		[Number(day)]: groupByCategory(expenses)
	}), {} as Record<number, CategoryInsights[]>)


	// fill days with no expenses

	const firstDay = Number(Object.keys(expByDay)[Object.keys(expByDay).length - 1])
	const lastDay = Number(Object.keys(expByDay)[0])

	const days = []
	for (let day = firstDay; day <= lastDay; day += 1000 * 60 * 60 * 24) {
		days.push(day)
	}

	return days.reduce((acc, day) => ({
		...acc,
		[day]: expByDay[day] || []
	}), {} as Record<number, CategoryInsights[]>)

}

export function groupByCategoryByWeek(expenses: Expense[]): Record<number, CategoryInsights[]> {
	const expensesByDay = groupByCategoryByDay(expenses)

	return Object.entries(expensesByDay).reduce((acc, [day, categoryInsights]) => {
		const date = startOfWeek(Number(day))

		return {
			...acc,
			[date.getTime()]: categoryInsights.map(({ currency_code, id, name, total }) => ({
				currency_code,
				id,
				name,
				total: total + categoryInsights.filter(insight => insight.id === id).reduce((acc, insight) => acc + insight.total, 0)
			}))
		}
	}, {} as Record<number, CategoryInsights[]>)
}


// example: Friday May 3
export function formatDate(date: number): string {
	const dateObj = new Date(date)
	return `${dateObj.toLocaleDateString('en-US', { weekday: 'long' })} ${dateObj.toLocaleDateString('en-US', { month: 'long' })} ${dateObj.getDate()}`
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
export function expenseShareCost(expense: Expense) {

	const myId = Number(process.env.NEXT_PUBLIC_SPLITWISE_USER_ID)

	if (!myId) throw new Error(`NEXT_SPLITWISE_USER_ID env variable is not set, ${process.env.NEXT_PUBLIC_SPLITWISE_USER_ID}`)

	if (expense.repayments.length === 0) {
		return parseFloat(expense.cost);
	}

	let totalSpent = 0;
	for (const repayment of expense.repayments) {
		const { amount, from: expenseBorrower, to: expensePayer } = repayment

		if (expenseBorrower === myId) {
			totalSpent += parseFloat(amount)
		}
		if (expensePayer === myId) {
			totalSpent += parseFloat(expense.cost) - parseFloat(amount)
		}

	}
	return totalSpent
}

export function isExpense(thing: any): thing is Expense {

	if (!thing) return false

	return thing.hasOwnProperty('id')
		&& thing.hasOwnProperty('cost')
		&& thing.hasOwnProperty('date')
		&& thing.hasOwnProperty('description')
		&& thing.hasOwnProperty('category')
		&& thing.hasOwnProperty('repayments')
}