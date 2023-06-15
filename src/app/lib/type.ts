export type CategoryInsight = {
  id: number;
  name: string;
  total: number;
  currency_code: string;
};

export interface Expense {
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
  repayments: Repayment[];
  date: string;
  created_at: string;
  created_by: CreatedBy;
  updated_at: string;
  updated_by?: UpdatedBy;
  deleted_at: any;
  deleted_by: any;
  category: Category;
  receipt: Receipt;
  users: UserShares[];
}

export interface Repayment {
  from: number;
  to: number;
  amount: string;
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

export interface UserShares {
  user: OtherUser;
  user_id: number;
  paid_share: string;
  owed_share: string;
  net_balance: string;
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
  19: "Entretenimiento",
  25: "Comidas y bebidas",
  27: "Casa",
  31: "Transporte",
  40: "Vida",
  48: "Limpieza",
  5: "Electricidad",
  6: "Calefacción",
  11: "Otro",
  37: "Basura",
  8: "TV/teléfono/Internet",
  7: "Agua",
  18: "General",
  20: "Juegos",
  21: "Películas",
  22: "Música",
  23: "Otro",
  24: "Deportes",
  13: "Restaurantes",
  12: "Alimentos",
  38: "Licor",
  26: "Otro",
  39: "Electrónica",
  16: "Muebles",
  14: "Suministros del hogar",
  17: "Mantenimiento",
  4: "Hipoteca",
  28: "Otro",
  29: "Mascotas",
  3: "Alquiler",
  30: "Servicios",
  46: "Bicicleta",
  32: "Autobús/tren",
  15: "Coche",
  33: "Gasolina",
  47: "Hotel",
  34: "Otro",
  9: "Estacionamiento",
  35: "Avión",
  36: "Taxi",
  50: "Guardería",
  41: "Ropa",
  49: "Formación",
  42: "Regalos",
  10: "Seguro",
  43: "Gastos médicos",
  44: "Otro",
  45: "Impuestos",
};

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
