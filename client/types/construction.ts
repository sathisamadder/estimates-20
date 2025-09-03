export interface ConstructionItem {
  id: string;
  itemId: string;
  type: string;
  category: string;
  description: string;
  
  // Basic dimensions
  length?: number;
  width?: number;
  height?: number;
  depth?: number;
  diameter?: number;
  thickness?: number;
  
  // Reinforcement details
  mainBarDia?: number;
  mainBarSpacing?: number;
  stirrupDia?: number;
  stirrupSpacing?: number;
  numberOfBars?: number;
  
  // Calculated values
  volume: number;
  reinforcement: number;
  totalCost: number;
  
  // Material quantities
  cement?: number;
  sand?: number;
  stoneChips?: number;
  brickQuantity?: number;
  plasterArea?: number;
  
  // Units
  lengthUnit: string;
  widthUnit: string;
  heightUnit: string;
  depthUnit: string;
  
  // Quantity multiplication
  isMultiple: boolean;
  quantity: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRates {
  cement: number; // BDT per bag
  sand: number; // BDT per cft
  stoneChips: number; // BDT per cft
  reinforcement: number; // BDT per kg
  brick: number; // BDT per piece
  labor: number; // BDT per cft
}

export interface ConstructionType {
  id: string;
  name: string;
  category: string;
  icon: any;
  color: string;
  bgColor: string;
  fields: FieldConfig[];
  calculations: CalculationConfig;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'number' | 'select';
  unit: string;
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  description?: string;
}

export interface CalculationConfig {
  volume: string; // Formula for volume calculation
  reinforcement: string; // Formula for reinforcement calculation
  cement: string; // Formula for cement calculation
  sand: string; // Formula for sand calculation
  stoneChips: string; // Formula for stone chips calculation
  labor: string; // Formula for labor calculation
}