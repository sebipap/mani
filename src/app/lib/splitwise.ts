import { Expense } from "./type"

const Splitwise = require('splitwise')


type ExpensesQueryParams = {
	group_id?: number
	friend_id?: number	
	dated_after?: Date
	dated_before?: Date	
	updated_after	?: Date	
	updated_before?: Date		
	limit?: number | null
	offset?: number
}


export async function getExpenses(): Promise<Expense[]> {

	const queryParams: ExpensesQueryParams = {
		limit: null,
	}

	const urlParams = new URLSearchParams(Object.fromEntries(Object.entries(queryParams).map(([key, value]) => [key, value?.toString()||''])))

	const response = await fetch(`https://secure.splitwise.com/api/v3.0/get_expenses?${urlParams}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${process.env.SPLITWISE_API_KEY}`
		}}
	).then(res => res.json())

	return response.expenses
}