
export type CategoryInsights = {
	id: number
	name: string
	total: number
	currency_code: string
	
}




export interface Expense {
  id: number
  group_id: any
  friendship_id: any
  expense_bundle_id: any
  description: string
  repeats: boolean
  repeat_interval: any
  email_reminder: boolean
  email_reminder_in_advance: number
  next_repeat: any
  details: any
  comments_count: number
  payment: boolean
  creation_method: any
  transaction_method: string
  transaction_confirmed: boolean
  transaction_id: any
  transaction_status: any
  cost: string
  currency_code: string
  repayments: Repayment[]
  date: string
  created_at: string
  created_by: CreatedBy
  updated_at: string
  updated_by?: UpdatedBy
  deleted_at: any
  deleted_by: any
  category: Category
  receipt: Receipt
  users: User[]
}

export interface Repayment {
  from: number
  to: number
  amount: string
}

export interface CreatedBy {
  id: number
  first_name: string
  last_name: string
  picture: Picture
  custom_picture: boolean
}

export interface Picture {
  medium: string
}

export interface UpdatedBy {
  id: number
  first_name: string
  last_name: string
  picture: Picture2
  custom_picture: boolean
}

export interface Picture2 {
  medium: string
}

export interface Category {
  id: number
  name: string
}

export interface Receipt {
  large?: string
  original?: string
}

export interface User {
  user: User2
  user_id: number
  paid_share: string
  owed_share: string
  net_balance: string
}

export interface User2 {
  id: number
  first_name: string
  last_name: string
  picture: Picture3
}

export interface Picture3 {
  medium: string
}
