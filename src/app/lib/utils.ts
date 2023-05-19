import { CategoryInsights, Expense } from "./type";

export function groupByCategory(expenses: Expense[]): CategoryInsights[] {

	const categoryIds = [... new Set(expenses.map(expense => expense.category.id))]

	const categoryInsights = categoryIds.map(categoryId => ({
		id: categoryId,
		name: expenses.find(expense => expense.category.id === categoryId)?.category.name || '',
		total: expenses.filter(expense => expense.category.id === categoryId).reduce((acc, expense) => {

			const isIndividualExpense = expense.repayments.length === 0

			const shareOfGroupExpense = expense.repayments.find(repayment => repayment.to === expense.created_by.id)?.amount || expense.repayments.find(repayment => repayment.from === expense.created_by.id)?.amount || '0'

			const share = isIndividualExpense ? expense.cost : shareOfGroupExpense
				

			return acc + parseFloat(share)
		}, 0),
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
	for (let day = firstDay; day <= lastDay; day +=  1000 * 60 * 60 * 24) {
		days.push(day)
	}

	return days.reduce((acc, day) => ({
		...acc,
		[day]: expByDay[day] || []
	}), {} as Record<number, CategoryInsights[]>)

}

export function flipArray<T>(array: T[]): T[] {
	return array.map((_, i) => array[array.length - 1 - i])
}

// example: Friday May 3
export function formatDate(date: number): string {
	const dateObj = new Date(date)
	return `${dateObj.toLocaleDateString('en-US', { weekday: 'long' })} ${dateObj.toLocaleDateString('en-US', { month: 'long' })} ${dateObj.getDate()}`
}