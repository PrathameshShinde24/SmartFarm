export type SensorStatus = 'Normal' | 'Warning' | 'Critical';

export interface SensorReading {
  fieldId: string;
  fieldName: string;
  moisture: number;
  temperature: number;
  humidity: number;
  ph: number;
  irrigating: boolean;
}

export interface SensorAlert {
  time: Date;
  fieldName: string;
  message: string;
  status: SensorStatus;
}
