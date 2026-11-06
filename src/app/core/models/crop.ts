export type CropStage =
  'Sowing' | 'Germination' | 'Vegetative' | 'Flowering' | 'Harvest Ready' | 'Harvested';

export type CropHealth = 'Healthy' | 'At Risk' | 'Diseased';

export interface Crop {
  id: string;
  crop: string;
  variety: string;
  fieldId: string;
  sowingDate: string;
  harvestDate: string;
  stage: CropStage;
  health: CropHealth;
  expectedYield: number;
}

export const CROP_STAGES: CropStage[] = [
  'Sowing',
  'Germination',
  'Vegetative',
  'Flowering',
  'Harvest Ready',
  'Harvested',
];
export const CROP_HEALTH: CropHealth[] = ['Healthy', 'At Risk', 'Diseased'];
export const CROP_NAMES = [
  'Sugarcane',
  'Onion',
  'Pomegranate',
  'Soybean',
  'Cotton',
  'Wheat',
  'Tur',
  'Gram',
  'Jowar',
  'Maize',
];
