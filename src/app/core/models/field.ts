export type IrrigationType = 'Drip' | 'Sprinkler' | 'Flood' | 'Rainfed';
export type FieldStatus = 'Active' | 'Fallow';

export interface Field {
  id: string;
  name: string;
  area: number;
  soilType: string;
  irrigation: IrrigationType;
  location: string;
  status: FieldStatus;
}

export const IRRIGATION_TYPES: IrrigationType[] = ['Drip', 'Sprinkler', 'Flood', 'Rainfed'];
export const FIELD_STATUSES: FieldStatus[] = ['Active', 'Fallow'];
export const SOIL_TYPES = [
  'Black Cotton',
  'Medium Black',
  'Alluvial',
  'Red Laterite',
  'Clay Loam',
  'Sandy Loam',
];
