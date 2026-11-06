export type TransactionType = 'Income' | 'Expense';

export type TransactionCategory =
  'Seeds' | 'Fertilizer' | 'Labour' | 'Equipment' | 'Fuel' | 'Crop Sale' | 'Subsidy' | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: string;
  fieldId: string;
  note: string;
}

export const TRANSACTION_TYPES: TransactionType[] = ['Income', 'Expense'];
export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  'Seeds',
  'Fertilizer',
  'Labour',
  'Equipment',
  'Fuel',
  'Crop Sale',
  'Subsidy',
  'Other',
];
