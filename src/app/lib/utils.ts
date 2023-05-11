import { CategoryInsights, Expense } from "./type";

export function groupByCategory(expenses: Expense[]): CategoryInsights[] {

	const categoryIds = [... new Set(expenses.map(expense => expense.category.id))]

	const categoryInsights = categoryIds.map(categoryId => ({
		id: categoryId,
		name: expenses.find(expense => expense.category.id === categoryId)?.category.name || '',
		total: expenses.filter(expense => expense.category.id === categoryId).reduce((acc, expense) => {

			const share = expense.repayments.length  === 0 ? expense.cost : 
				expense.repayments.find(repayment => repayment.to === expense.created_by.id)?.amount || expense.repayments.find(repayment => repayment.from === expense.created_by.id)?.amount || '0'

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


	return Object.entries(expensesByDay).reduce((acc, [day, expenses]) => ({
		...acc,
		[day]: groupByCategory(expenses)
	}), {} as Record<number, CategoryInsights[]>)
	


}
