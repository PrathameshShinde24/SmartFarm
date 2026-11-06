export type InventoryCategory = 'Seeds' | 'Fertilizer' | 'Pesticide' | 'Equipment' | 'Fuel';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  reorderLevel: number;
  costPerUnit: number;
}

export const INVENTORY_CATEGORIES: InventoryCategory[] = [
  'Seeds',
  'Fertilizer',
  'Pesticide',
  'Equipment',
  'Fuel',
];
export const UNITS = ['kg', 'bag', 'litre', 'pcs', 'roll'];
