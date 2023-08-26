export type CategoryInsight = {
  id: number;
  name: string;
  total: number;
  currency_code: string;
};

export interface ExpenseResponse {
  id: number;
  group_id: any;
  friendship_id: any;
  expense_bundle_id: any;
  description: string;
  repeats: boolean;
  repeat_interval: any;
  email_reminder: boolean;
  email_reminder_in_advance: number;
  next_repeat: any;
  details: string;
  comments_count: number;
  payment: boolean;
  creation_method: any;
  transaction_method: string;
  transaction_confirmed: boolean;
  transaction_id: any;
  transaction_status: any;
  cost: string;
  currency_code: string;
  repayments: RepaymentResponse[];
  date: string;
  created_at: string;
  created_by: CreatedBy;
  updated_at: string;
  updated_by?: UpdatedBy;
  deleted_at: any;
  deleted_by: any;
  category: Category;
  users: UserShares[];
}

export interface Expense {
  id: number;
  description: string;
  details: string;
  payment: boolean;
  cost: number;
  currencyCode: string;
  date: Date;
  createdAt: Date;
  deletedAt: Date;
  category: Category;
  users: UserShares[];
  groupTotal: number;
  costUSD?: number;
}

export type Currency = Expense["currencyCode"];

export interface RepaymentResponse {
  from: number;
  to: number;
  amount: string;
}

export interface Repayment {
  from: number;
  to: number;
  amount: number;
}

export interface CreatedBy {
  id: number;
  first_name: string;
  last_name: string;
  picture: Picture;
  custom_picture: boolean;
}

export interface Picture {
  medium: string;
}

export interface UpdatedBy {
  id: number;
  first_name: string;
  last_name: string;
  picture: Picture2;
  custom_picture: boolean;
}

export interface Picture2 {
  medium: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Receipt {
  large?: string;
  original?: string;
}

export interface UserSharesResponse {
  user: OtherUser;
  user_id: number;
  paid_share: string;
  owed_share: string;
  net_balance: string;
}

export interface UserShares {
  user: OtherUser;
  userId: number;
  paidShare: number;
  owedShare: number;
  netBalance: number;
}

export interface OtherUser {
  id: number;
  first_name: string;
  last_name: string;
  picture: Picture3;
}

export interface Picture3 {
  medium: string;
}

export const categoriesById = {
  1: "Utilidades",
  2: "Sin categoría",
  3: "Alquiler",
  4: "Hipoteca",
  5: "Electricidad",
  6: "Calefacción",
  7: "Agua",
  8: "TV/teléfono/Internet",
  9: "Estacionamiento",
  10: "Seguro",
  11: "Otro",
  12: "Alimentos",
  13: "Restaurantes",
  14: "Suministros del hogar",
  15: "Coche",
  16: "Muebles",
  17: "Mantenimiento",
  18: "General",
  19: "Entretenimiento",
  20: "Juegos",
  21: "Películas",
  22: "Música",
  23: "Otro",
  24: "Deportes",
  25: "Comidas y bebidas",
  26: "Otro",
  27: "Casa",
  28: "Otro",
  29: "Mascotas",
  30: "Servicios",
  31: "Transporte",
  32: "Autobús/tren",
  33: "Gasolina",
  34: "Otro",
  35: "Avión",
  36: "Taxi",
  37: "Basura",
  38: "Licor",
  39: "Electrónica",
  40: "Vida",
  41: "Ropa",
  42: "Regalos",
  43: "Gastos médicos",
  44: "Otro",
  45: "Impuestos",
  46: "Bicicleta",
  47: "Hotel",
  48: "Limpieza",
  49: "Formación",
  50: "Guardería",
};

export type ConsumptionDuration =
  | "instant"
  | "monthly"
  | "yearly"
  | "eternal"
  | "not a spending";

export const categoriesConsumption: Record<string, ConsumptionDuration> = {
  1: "monthly",
  2: "monthly",
  3: "monthly",
  4: "monthly",
  5: "monthly",
  6: "monthly",
  7: "monthly",
  8: "monthly",
  9: "monthly",
  10: "monthly",
  11: "instant",
  12: "instant",
  13: "instant",
  14: "monthly",
  15: "monthly",
  16: "eternal",
  17: "monthly",
  18: "not a spending",
  19: "instant",
  20: "eternal",
  21: "instant",
  22: "instant",
  23: "instant",
  24: "instant",
  25: "instant",
  26: "instant",
  27: "monthly",
  28: "monthly",
  29: "monthly",
  30: "monthly",
  31: "monthly",
  32: "monthly",
  33: "monthly",
  34: "monthly",
  35: "monthly",
  36: "monthly",
  37: "monthly",
  38: "instant",
  39: "eternal",
  40: "monthly",
  41: "eternal",
  42: "eternal",
  43: "monthly",
  44: "monthly",
  45: "monthly",
  46: "monthly",
  47: "monthly",
  48: "monthly",
  49: "monthly",
  50: "monthly",
};

export const RECURRENT_CATEGORIES = [
  1, // Utilidades
  2, // Sin categoría
  3, // Alquiler
  4, // Hipoteca
  5, // Electricidad
  6, // Calefacción
  7, // Agua
  8, // TV/teléfono/Internet
  9, // Estacionamiento
  10, // Seguro
  11, // Otro
  19, // Entretenimiento
  37, // Basura
  44, // "Otro",
  43, // Gastos médicos
  44, // Vida - otro
  45, // Impuestos
  49, // Formación
  50, // Guardería
];

export const splitwiseCategories = Object.keys(categoriesById);

export type CategoryId = keyof typeof categoriesById;

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  registration_status: string;
  picture: any;
  notifications_read: Date;
  notifications_count: number;
  notifications: any;
  default_currency: string;
  locale: string;
};

// open AI

export type OpenAIResponse = {
  id: string;
  object: string;
  created: number;
  choices: Choice[];
  usage: Usage;
};

export type Choice = {
  index: number;
  message: Message;
  finish_reason: string;
};

export type Message = {
  role: string;
  content: string;
};

export type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};
