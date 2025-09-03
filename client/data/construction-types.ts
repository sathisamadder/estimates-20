import {
  Building2,
  Layers,
  Square,
  Circle,
  Zap,
  Home,
  Hammer,
  Wrench,
  Paintbrush,
  Truck,
  Foundation,
  Pillar,
  Beam,
  Stairs,
  Roof,
} from "lucide-react";
import { ConstructionType } from "@/types/construction";

export const constructionTypes: ConstructionType[] = [
  // Foundation Works
  {
    id: "pile",
    name: "Pile Work",
    category: "Foundation",
    icon: Foundation,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    fields: [
      {
        name: "diameter",
        label: "Pile Diameter",
        type: "number",
        unit: "inch",
        required: true,
        min: 12,
        max: 48,
        step: 1,
        placeholder: "18",
        description: "Diameter of the pile in inches"
      },
      {
        name: "height",
        label: "Pile Height",
        type: "number",
        unit: "ft",
        required: true,
        min: 10,
        max: 100,
        step: 1,
        placeholder: "40",
        description: "Total height of pile in feet"
      },
      {
        name: "mainBarDia",
        label: "Main Bar Diameter",
        type: "select",
        unit: "mm",
        required: true,
        options: [
          { value: 12, label: "12mm" },
          { value: 16, label: "16mm" },
          { value: 20, label: "20mm" },
          { value: 25, label: "25mm" },
        ],
        description: "Main reinforcement bar diameter"
      },
      {
        name: "numberOfBars",
        label: "Number of Main Bars",
        type: "number",
        unit: "nos",
        required: true,
        min: 4,
        max: 20,
        step: 1,
        placeholder: "8",
        description: "Total number of main bars"
      },
      {
        name: "stirrupDia",
        label: "Stirrup Diameter",
        type: "select",
        unit: "mm",
        required: true,
        options: [
          { value: 8, label: "8mm" },
          { value: 10, label: "10mm" },
          { value: 12, label: "12mm" },
        ],
        description: "Stirrup bar diameter"
      },
      {
        name: "stirrupSpacing",
        label: "Stirrup Spacing",
        type: "number",
        unit: "inch",
        required: true,
        min: 4,
        max: 12,
        step: 1,
        placeholder: "6",
        description: "Center to center spacing of stirrups"
      }
    ],
    calculations: {
      volume: "(3.14159 * (diameter/12)^2 * height) / 4",
      reinforcement: "((numberOfBars * height * 3.28 * (mainBarDia/1000)^2 * 3.14159 * 7850) + (3.14159 * (diameter/12 - 0.1) * (height * 12 / stirrupSpacing) * (stirrupDia/1000)^2 * 7850)) / 1000",
      cement: "volume * 6.5",
      sand: "volume * 0.45 * 35.31",
      stoneChips: "volume * 0.9 * 35.31",
      labor: "volume"
    }
  },
  
  // Footing
  {
    id: "footing",
    name: "Footing",
    category: "Foundation",
    icon: Square,
    color: "text-stone-600",
    bgColor: "bg-stone-100",
    fields: [
      {
        name: "length",
        label: "Length",
        type: "number",
        unit: "ft",
        required: true,
        min: 2,
        max: 20,
        step: 0.5,
        placeholder: "8",
        description: "Length of footing in feet"
      },
      {
        name: "width",
        label: "Width",
        type: "number",
        unit: "ft",
        required: true,
        min: 2,
        max: 20,
        step: 0.5,
        placeholder: "8",
        description: "Width of footing in feet"
      },
      {
        name: "depth",
        label: "Depth",
        type: "number",
        unit: "inch",
        required: true,
        min: 6,
        max: 36,
        step: 1,
        placeholder: "18",
        description: "Depth of footing in inches"
      },
      {
        name: "mainBarDia",
        label: "Main Bar Diameter",
        type: "select",
        unit: "mm",
        required: true,
        options: [
          { value: 12, label: "12mm" },
          { value: 16, label: "16mm" },
          { value: 20, label: "20mm" },
          { value: 25, label: "25mm" },
        ],
        description: "Main reinforcement bar diameter"
      },
      {
        name: "mainBarSpacing",
        label: "Bar Spacing",
        type: "number",
        unit: "inch",
        required: true,
        min: 4,
        max: 12,
        step: 1,
        placeholder: "6",
        description: "Center to center spacing of main bars"
      }
    ],
    calculations: {
      volume: "length * width * (depth/12)",
      reinforcement: "((length * 12 / mainBarSpacing + 1) * width + (width * 12 / mainBarSpacing + 1) * length) * (mainBarDia/1000)^2 * 3.14159 * 7850 / 1000",
      cement: "volume * 6.5",
      sand: "volume * 0.45 * 35.31",
      stoneChips: "volume * 0.9 * 35.31",
      labor: "volume"
    }
  },

  // Column
  {
    id: "column",
    name: "Column",
    category: "Structure",
    icon: Pillar,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    fields: [
      {
        name: "length",
        label: "Length",
        type: "number",
        unit: "inch",
        required: true,
        min: 8,
        max: 36,
        step: 1,
        placeholder: "12",
        description: "Length of column in inches"
      },
      {
        name: "width",
        label: "Width",
        type: "number",
        unit: "inch",
        required: true,
        min: 8,
        max: 36,
        step: 1,
        placeholder: "15",
        description: "Width of column in inches"
      },
      {
        name: "height",
        label: "Height",
        type: "number",
        unit: "ft",
        required: true,
        min: 8,
        max: 20,
        step: 0.5,
        placeholder: "10",
        description: "Height of column in feet"
      },
      {
        name: "mainBarDia",
        label: "Main Bar Diameter",
        type: "select",
        unit: "mm",
        required: true,
        options: [
          { value: 16, label: "16mm" },
          { value: 20, label: "20mm" },
          { value: 25, label: "25mm" },
          { value: 32, label: "32mm" },
        ],
        description: "Main reinforcement bar diameter"
      },
      {
        name: "numberOfBars",
        label: "Number of Main Bars",
        type: "number",
        unit: "nos",
        required: true,
        min: 4,
        max: 16,
        step: 1,
        placeholder: "8",
        description: "Total number of main bars"
      },
      {
        name: "stirrupDia",
        label: "Stirrup Diameter",
        type: "select",
        unit: "mm",
        required: true,
        options: [
          { value: 8, label: "8mm" },
          { value: 10, label: "10mm" },
          { value: 12, label: "12mm" },
        ],
        description: "Stirrup bar diameter"
      },
      {
        name: "stirrupSpacing",
        label: "Stirrup Spacing",
        type: "number",
        unit: "inch",
        required: true,
        min: 4,
        max: 12,
        step: 1,
        placeholder: "6",
        description: "Center to center spacing of stirrups"
      }
    ],
    calculations: {
      volume: "(length/12) * (width/12) * height",
      reinforcement: "(numberOfBars * height * 3.28 * (mainBarDia/1000)^2 * 3.14159 * 7850 + 2 * (length + width - 6) / 12 * (height * 12 / stirrupSpacing) * (stirrupDia/1000)^2 * 3.14159 * 7850) / 1000",
      cement: "volume * 6.5",
      sand: "volume * 0.45 * 35.31",
      stoneChips: "volume * 0.9 * 35.31",
      labor: "volume"
    }
  },

  // Beam
  {
    id: "beam",
    name: "Beam",
    category: "Structure",
    icon: Beam,
    color: "text-green-600",
    bgColor: "bg-green-100",
    fields: [
      {
        name: "length",
        label: "Length",
        type: "number",
        unit: "ft",
        required: true,
        min: 5,
        max: 30,
        step: 0.5,
        placeholder: "12",
        description: "Length of beam in feet"
      },
      {
        name: "width",
        label: "Width",
        type: "number",
        unit: "inch",
        required: true,
        min: 8,
        max: 24,
        step: 1,
        placeholder: "12",
        description: "Width of beam in inches"
      },
      {
        name: "height",
        label: "Height",
        type: "number",
        unit: "inch",
        required: true,
        min: 12,
        max: 36,
        step: 1,
        placeholder: "18",
        description: "Height of beam in inches"
      },
      {
        name: "mainBarDia",
        label: "Main Bar Diameter",
        type: "select",
        unit: "mm",
        required: true,
        options: [
          { value: 16, label: "16mm" },
          { value: 20, label: "20mm" },
          { value: 25, label: "25mm" },
          { value: 32, label: "32mm" },
        ],
        description: "Main reinforcement bar diameter"
      },
      {
        name: "numberOfBars",
        label: "Number of Main Bars",
        type: "number",
        unit: "nos",
        required: true,
        min: 2,
        max: 12,
        step: 1,
        placeholder: "4",
        description: "Total number of main bars"
      },
      {
        name: "stirrupDia",
        label: "Stirrup Diameter",
        type: "select",
        unit: "mm",
        required: true,
        options: [
          { value: 8, label: "8mm" },
          { value: 10, label: "10mm" },
          { value: 12, label: "12mm" },
        ],
        description: "Stirrup bar diameter"
      },
      {
        name: "stirrupSpacing",
        label: "Stirrup Spacing",
        type: "number",
        unit: "inch",
        required: true,
        min: 4,
        max: 12,
        step: 1,
        placeholder: "6",
        description: "Center to center spacing of stirrups"
      }
    ],
    calculations: {
      volume: "length * (width/12) * (height/12)",
      reinforcement: "(numberOfBars * length * 3.28 * (mainBarDia/1000)^2 * 3.14159 * 7850 + 2 * (width + height - 6) / 12 * (length * 12 / stirrupSpacing) * (stirrupDia/1000)^2 * 3.14159 * 7850) / 1000",
      cement: "volume * 6.5",
      sand: "volume * 0.45 * 35.31",
      stoneChips: "volume * 0.9 * 35.31",
      labor: "volume"
    }
  },

  // Slab
  {
    id: "slab",
    name: "Slab",
    category: "Structure",
    icon: Layers,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    fields: [
      {
        name: "length",
        label: "Length",
        type: "number",
        unit: "ft",
        required: true,
        min: 5,
        max: 50,
        step: 0.5,
        placeholder: "20",
        description: "Length of slab in feet"
      },
      {
        name: "width",
        label: "Width",
        type: "number",
        unit: "ft",
        required: true,
        min: 5,
        max: 50,
        step: 0.5,
        placeholder: "15",
        description: "Width of slab in feet"
      },
      {
        name: "thickness",
        label: "Thickness",
        type: "number",
        unit: "inch",
        required: true,
        min: 4,
        max: 12,
        step: 0.5,
        placeholder: "5",
        description: "Thickness of slab in inches"
      },
      {
        name: "mainBarDia",
        label: "Main Bar Diameter",
        type: "select",
        unit: "mm",
        required: true,
        options: [
          { value: 10, label: "10mm" },
          { value: 12, label: "12mm" },
          { value: 16, label: "16mm" },
          { value: 20, label: "20mm" },
        ],
        description: "Main reinforcement bar diameter"
      },
      {
        name: "mainBarSpacing",
        label: "Bar Spacing",
        type: "number",
        unit: "inch",
        required: true,
        min: 4,
        max: 12,
        step: 1,
        placeholder: "6",
        description: "Center to center spacing of bars"
      }
    ],
    calculations: {
      volume: "length * width * (thickness/12)",
      reinforcement: "((length * 12 / mainBarSpacing + 1) * width + (width * 12 / mainBarSpacing + 1) * length) * 2 * (mainBarDia/1000)^2 * 3.14159 * 7850 / 1000",
      cement: "volume * 6.5",
      sand: "volume * 0.45 * 35.31",
      stoneChips: "volume * 0.9 * 35.31",
      labor: "volume"
    }
  },

  // Staircase
  {
    id: "staircase",
    name: "Staircase",
    category: "Structure",
    icon: Stairs,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    fields: [
      {
        name: "length",
        label: "Total Length",
        type: "number",
        unit: "ft",
        required: true,
        min: 8,
        max: 25,
        step: 0.5,
        placeholder: "12",
        description: "Total length of staircase"
      },
      {
        name: "width",
        label: "Width",
        type: "number",
        unit: "ft",
        required: true,
        min: 3,
        max: 8,
        step: 0.5,
        placeholder: "4",
        description: "Width of staircase"
      },
      {
        name: "thickness",
        label: "Waist Thickness",
        type: "number",
        unit: "inch",
        required: true,
        min: 5,
        max: 10,
        step: 0.5,
        placeholder: "6",
        description: "Waist slab thickness"
      },
      {
        name: "mainBarDia",
        label: "Main Bar Diameter",
        type: "select",
        unit: "mm",
        required: true,
        options: [
          { value: 12, label: "12mm" },
          { value: 16, label: "16mm" },
          { value: 20, label: "20mm" },
        ],
        description: "Main reinforcement bar diameter"
      },
      {
        name: "mainBarSpacing",
        label: "Bar Spacing",
        type: "number",
        unit: "inch",
        required: true,
        min: 4,
        max: 8,
        step: 1,
        placeholder: "6",
        description: "Center to center spacing of bars"
      }
    ],
    calculations: {
      volume: "length * width * (thickness/12) * 1.414",
      reinforcement: "((length * 12 / mainBarSpacing + 1) * width + (width * 12 / mainBarSpacing + 1) * length) * 1.414 * (mainBarDia/1000)^2 * 3.14159 * 7850 / 1000",
      cement: "volume * 6.5",
      sand: "volume * 0.45 * 35.31",
      stoneChips: "volume * 0.9 * 35.31",
      labor: "volume * 1.5"
    }
  },

  // Brick Wall
  {
    id: "brickwall",
    name: "Brick Wall",
    category: "Masonry",
    icon: Home,
    color: "text-red-600",
    bgColor: "bg-red-100",
    fields: [
      {
        name: "length",
        label: "Length",
        type: "number",
        unit: "ft",
        required: true,
        min: 1,
        max: 100,
        step: 0.5,
        placeholder: "20",
        description: "Length of wall in feet"
      },
      {
        name: "height",
        label: "Height",
        type: "number",
        unit: "ft",
        required: true,
        min: 1,
        max: 15,
        step: 0.5,
        placeholder: "10",
        description: "Height of wall in feet"
      },
      {
        name: "thickness",
        label: "Wall Thickness",
        type: "select",
        unit: "inch",
        required: true,
        options: [
          { value: 4.5, label: "4.5\" (Single)" },
          { value: 9, label: "9\" (Double)" },
          { value: 13.5, label: "13.5\" (Triple)" },
        ],
        description: "Thickness of brick wall"
      }
    ],
    calculations: {
      volume: "length * height * (thickness/12)",
      reinforcement: "0",
      cement: "volume * 6.5",
      sand: "volume * 0.3 * 35.31",
      stoneChips: "0",
      labor: "length * height"
    }
  },

  // Plaster Work
  {
    id: "plaster",
    name: "Plaster Work",
    category: "Finishing",
    icon: Paintbrush,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    fields: [
      {
        name: "length",
        label: "Length",
        type: "number",
        unit: "ft",
        required: true,
        min: 1,
        max: 100,
        step: 0.5,
        placeholder: "20",
        description: "Length of surface in feet"
      },
      {
        name: "height",
        label: "Height",
        type: "number",
        unit: "ft",
        required: true,
        min: 1,
        max: 15,
        step: 0.5,
        placeholder: "10",
        description: "Height of surface in feet"
      },
      {
        name: "thickness",
        label: "Plaster Thickness",
        type: "select",
        unit: "inch",
        required: true,
        options: [
          { value: 0.5, label: "0.5\" (12mm)" },
          { value: 0.75, label: "0.75\" (19mm)" },
          { value: 1, label: "1\" (25mm)" },
        ],
        description: "Thickness of plaster"
      }
    ],
    calculations: {
      volume: "length * height * (thickness/12)",
      reinforcement: "0",
      cement: "volume * 12",
      sand: "volume * 1.2 * 35.31",
      stoneChips: "0",
      labor: "length * height * 0.8"
    }
  },

  // Roof Slab
  {
    id: "roof",
    name: "Roof Slab",
    category: "Structure",
    icon: Roof,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    fields: [
      {
        name: "length",
        label: "Length",
        type: "number",
        unit: "ft",
        required: true,
        min: 8,
        max: 50,
        step: 0.5,
        placeholder: "25",
        description: "Length of roof slab in feet"
      },
      {
        name: "width",
        label: "Width",
        type: "number",
        unit: "ft",
        required: true,
        min: 8,
        max: 50,
        step: 0.5,
        placeholder: "20",
        description: "Width of roof slab in feet"
      },
      {
        name: "thickness",
        label: "Thickness",
        type: "number",
        unit: "inch",
        required: true,
        min: 4,
        max: 8,
        step: 0.5,
        placeholder: "5",
        description: "Thickness of roof slab in inches"
      },
      {
        name: "mainBarDia",
        label: "Main Bar Diameter",
        type: "select",
        unit: "mm",
        required: true,
        options: [
          { value: 12, label: "12mm" },
          { value: 16, label: "16mm" },
          { value: 20, label: "20mm" },
        ],
        description: "Main reinforcement bar diameter"
      },
      {
        name: "mainBarSpacing",
        label: "Bar Spacing",
        type: "number",
        unit: "inch",
        required: true,
        min: 4,
        max: 10,
        step: 1,
        placeholder: "6",
        description: "Center to center spacing of bars"
      }
    ],
    calculations: {
      volume: "length * width * (thickness/12)",
      reinforcement: "((length * 12 / mainBarSpacing + 1) * width + (width * 12 / mainBarSpacing + 1) * length) * 2 * (mainBarDia/1000)^2 * 3.14159 * 7850 / 1000",
      cement: "volume * 6.5",
      sand: "volume * 0.45 * 35.31",
      stoneChips: "volume * 0.9 * 35.31",
      labor: "volume * 1.2"
    }
  }
];

// Helper function to get construction type by id
export function getConstructionType(id: string): ConstructionType | undefined {
  return constructionTypes.find(type => type.id === id);
}

// Helper function to get construction types by category
export function getConstructionTypesByCategory(category: string): ConstructionType[] {
  return constructionTypes.filter(type => type.category === category);
}

// Categories
export const categories = [
  "Foundation",
  "Structure", 
  "Masonry",
  "Finishing"
];