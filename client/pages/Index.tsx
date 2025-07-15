import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  Building2,
  FileText,
  Save,
  Download,
  Printer,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Copy,
  BarChart3,
  Settings,
  Filter,
  Search,
  TrendingUp,
  PieChart,
  Home,
  Hammer,
  Wrench,
  Layers,
  Square,
  Triangle,
  Zap,
  Droplets,
  Navigation,
  Grid3X3,
  Package,
  Paintbrush2,
  HardHat,
  User,
  Activity,
  Anchor,
  DollarSign,
  Cog,
} from "lucide-react";

type ItemType =
  | "pile"
  | "pile_cap"
  | "mat_foundation"
  | "footing"
  | "retaining_wall"
  | "water_reservoir"
  | "lift_core"
  | "septic_tank"
  | "column"
  | "beam"
  | "stair"
  | "slab"
  | "overhead_tank"
  | "brick_work"
  | "plaster_work";

interface ReinforcementDetails {
  mainReinforcement?: number;
  distributionReinforcement?: number;
  stirrups?: number;
  spiralReinforcement?: number;
  extraTopReinforcement?: number;
  longDirection?: number;
  shortDirection?: number;
  topReinforcement?: number;
  bottomReinforcement?: number;
}

interface EstimateItem {
  id: string;
  itemId: string; // P1, PC1, MF1, F1, RW1, WR1, LC1, ST1, C1, B1, S1, SL1, OT1, BW1, PL1
  type: ItemType;
  description: string;
  dimensions: Record<string, string>;
  results: {
    cement: number;
    sand: number;
    stoneChips: number;
    reinforcement: number;
    reinforcementDetails: ReinforcementDetails;
    totalCost: number;
    volume: number;
    brickQuantity?: number;
    plasterArea?: number;
  };
  unit: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  location: string;
  items: EstimateItem[];
  totalBudget: number;
  customRates?: MaterialRates;
  createdAt: string;
  updatedAt: string;
}

interface MaterialRates {
  cement: number;
  sand: number;
  stoneChips: number;
  reinforcement: number;
  brick: number;
  labor: number;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("items");
  const [currentProject, setCurrentProject] = useState<Project>({
    id: "1",
    name: "Construction Project",
    description: "Professional estimation project",
    client: "",
    location: "",
    items: [],
    totalBudget: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [materialRates, setMaterialRates] = useState<MaterialRates>({
    cement: 450,
    sand: 45,
    stoneChips: 55,
    reinforcement: 75,
    brick: 12,
    labor: 300,
  });

  const [editingItem, setEditingItem] = useState<EstimateItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ItemType>("column");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ItemType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [tempRates, setTempRates] = useState<MaterialRates>(materialRates);

  // Form states
  const [formData, setFormData] = useState({
    description: "",
    length: "",
    width: "",
    height: "",
    diameter: "",
    quantity: "1",
    reinforcementCount: "6",
    // Additional fields for specific items
    thickness: "",
    spacing: "",
    brickSize: "",
    plasterThickness: "",
    wallHeight: "",
    doorWidth: "",
    doorHeight: "",
    windowWidth: "",
    windowHeight: "",
    footingType: "",
    stirrupSpacing: "4",
    barDiameter: "20",
    clearCover: "1.5",
    stirrupDiameter: "8",
    mixingRatio: "1:1.5:3",
  });

  // Format currency to BDT
  const formatBDT = (amount: number): string => {
    return `BDT ${amount.toLocaleString()}`;
  };

  const itemTypeConfig = {
    // Foundation Works
    pile: {
      prefix: "P",
      name: "Pile Work",
      category: "Foundation",
      icon: Triangle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    pile_cap: {
      prefix: "PC",
      name: "Pile Cap",
      category: "Foundation",
      icon: Square,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    mat_foundation: {
      prefix: "MF",
      name: "Mat Foundation",
      category: "Foundation",
      icon: Layers,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    footing: {
      prefix: "F",
      name: "Footing",
      category: "Foundation",
      icon: Anchor,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },

    // Structural Works
    column: {
      prefix: "C",
      name: "Column",
      category: "Structure",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    beam: {
      prefix: "B",
      name: "Beam",
      category: "Structure",
      icon: Hammer,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    slab: {
      prefix: "SL",
      name: "Slab",
      category: "Structure",
      icon: Grid3X3,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    stair: {
      prefix: "S",
      name: "Stair",
      category: "Structure",
      icon: Navigation,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    retaining_wall: {
      prefix: "RW",
      name: "Retaining Wall",
      category: "Structure",
      icon: Layers,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },

    // Utility Works
    water_reservoir: {
      prefix: "WR",
      name: "Water Reservoir",
      category: "Utility",
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    septic_tank: {
      prefix: "ST",
      name: "Septic Tank",
      category: "Utility",
      icon: Package,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    overhead_tank: {
      prefix: "OT",
      name: "Overhead Tank",
      category: "Utility",
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    lift_core: {
      prefix: "LC",
      name: "Lift Core",
      category: "Utility",
      icon: Zap,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },

    // Masonry & Finishing
    brick_work: {
      prefix: "BW",
      name: "Brick Work",
      category: "Masonry",
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    plaster_work: {
      prefix: "PL",
      name: "Plaster Work",
      category: "Finishing",
      icon: Paintbrush2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  };

  const categories = [
    {
      name: "Foundation",
      icon: Triangle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: ["pile", "pile_cap", "mat_foundation", "footing"],
    },
    {
      name: "Structure",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: ["column", "beam", "slab", "stair", "retaining_wall"],
    },
    {
      name: "Utility",
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      items: ["water_reservoir", "septic_tank", "overhead_tank", "lift_core"],
    },
    {
      name: "Masonry",
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      items: ["brick_work"],
    },
    {
      name: "Finishing",
      icon: Paintbrush2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: ["plaster_work"],
    },
  ];

  // Load custom rates if available
  useEffect(() => {
    if (currentProject.customRates) {
      setMaterialRates(currentProject.customRates);
      setTempRates(currentProject.customRates);
    }
  }, [currentProject.customRates]);

  // Generate next item ID based on type
  const generateItemId = (type: ItemType): string => {
    const config = itemTypeConfig[type];
    const existingItems = currentProject.items.filter(
      (item) => item.type === type,
    );
    const nextNumber = existingItems.length + 1;
    return `${config.prefix}${nextNumber}`;
  };

  // Enhanced calculation functions with detailed reinforcement
  const calculateEstimate = (
    type: ItemType,
    dimensions: Record<string, string>,
  ) => {
    const {
      length = "0",
      width = "0",
      height = "0",
      diameter = "0",
      quantity = "1",
      reinforcementCount = "6",
      thickness = "0",
      spacing = "0",
      plasterThickness = "0",
      wallHeight = "0",
      footingType = "isolated",
      stirrupSpacing = "4",
      barDiameter = "20",
      clearCover = "1.5",
      stirrupDiameter = "8",
      mixingRatio = "1:1.5:3",
    } = dimensions;

    const qty = parseFloat(quantity);
    let volume = 0;
    let reinforcement = 0;
    let brickQuantity = 0;
    let plasterArea = 0;
    let dryVolume = 0;
    let cement = 0;
    let sand = 0;
    let stoneChips = 0;

    // Initialize reinforcement details
    let reinforcementDetails: ReinforcementDetails = {};

    switch (type) {
      case "pile": {
        // Formula: πD²h/4 with dry volume = 1.50
        const pileLength = parseFloat(length);
        const pileDiameter = parseFloat(diameter) / 12; // inches to feet
        volume = ((Math.PI * Math.pow(pileDiameter, 2) * pileLength) / 4) * qty;
        dryVolume = volume * 1.5;
        // Dynamic concrete ratio based on mixing ratio
        const ratios = mixingRatio.split(":").map(Number);
        const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);
        cement = ((dryVolume * ratios[0]) / totalRatio) * 1.25;
        sand = (dryVolume * ratios[1]) / totalRatio;
        stoneChips = (dryVolume * ratios[2]) / totalRatio;

        // Detailed reinforcement calculation for pile
        const mainBarWeight =
          parseFloat(barDiameter) === 10
            ? 0.19
            : parseFloat(barDiameter) === 12
              ? 0.27
              : parseFloat(barDiameter) === 16
                ? 0.48
                : parseFloat(barDiameter) === 20
                  ? 0.75
                  : parseFloat(barDiameter) === 25
                    ? 1.17
                    : 1.88;
        const stirrupBarWeight =
          parseFloat(stirrupDiameter) === 8 ? 0.12 : 0.19;
        const longReinforcement =
          parseFloat(reinforcementCount) *
          (pileLength + 2.5) *
          mainBarWeight *
          qty;
        const spiralLength = pileLength / (parseFloat(stirrupSpacing) / 12); // Number of spirals
        const spiralPerimeter = (Math.PI * (parseFloat(diameter) - 3)) / 12; // Diameter minus clear cover
        const spiralReinforcement =
          spiralLength * spiralPerimeter * stirrupBarWeight;

        reinforcementDetails = {
          mainReinforcement: longReinforcement,
          spiralReinforcement: spiralReinforcement,
        };
        reinforcement = longReinforcement + spiralReinforcement;
        break;
      }

      case "pile_cap":
        // Pile cap calculation
        volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
        dryVolume = volume * 1.5;
        // Dynamic concrete ratio based on mixing ratio
        const pcRatios = mixingRatio.split(":").map(Number);
        const pcTotalRatio = pcRatios.reduce((sum, ratio) => sum + ratio, 0);
        cement = ((dryVolume * pcRatios[0]) / pcTotalRatio) * 1.25;
        sand = (dryVolume * pcRatios[1]) / pcTotalRatio;
        stoneChips = (dryVolume * pcRatios[2]) / pcTotalRatio;

        // Pile cap reinforcement - both directions
        const pcMainReinforcement =
          (parseFloat(length) / 0.5) * parseFloat(width) * 0.48;
        const pcDistributionReinforcement =
          (parseFloat(width) / 0.5) * parseFloat(length) * 0.48;

        reinforcementDetails = {
          mainReinforcement: pcMainReinforcement,
          distributionReinforcement: pcDistributionReinforcement,
        };
        reinforcement = pcMainReinforcement + pcDistributionReinforcement;
        break;

      case "mat_foundation":
        // Mat foundation calculation from document
        volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
        dryVolume = volume * 1.5;
        // Dynamic concrete ratio based on mixing ratio
        const mfRatios = mixingRatio.split(":").map(Number);
        const mfTotalRatio = mfRatios.reduce((sum, ratio) => sum + ratio, 0);
        cement = ((dryVolume * mfRatios[0]) / mfTotalRatio) * 1.25;
        sand = (dryVolume * mfRatios[1]) / mfTotalRatio;
        stoneChips = (dryVolume * mfRatios[2]) / mfTotalRatio;

        // Mat foundation - two-way reinforcement system
        const mfLongDirection =
          (parseFloat(width) / 0.42) * parseFloat(length) * 0.48; // 5" spacing
        const mfShortDirection =
          (parseFloat(length) / 0.58) * parseFloat(width) * 0.48; // 7" spacing

        reinforcementDetails = {
          mainReinforcement: (mfLongDirection + mfShortDirection) * 2,
          longDirection: mfLongDirection * 2, // Top and bottom
          shortDirection: mfShortDirection * 2, // Top and bottom
          topReinforcement: mfLongDirection + mfShortDirection,
          bottomReinforcement: mfLongDirection + mfShortDirection,
        };
        reinforcement = (mfLongDirection + mfShortDirection) * 2;
        break;

      case "footing":
        // Isolated/Combined footing calculation
        volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
        dryVolume = volume * 1.5;
        // Dynamic concrete ratio based on mixing ratio
        const footingRatios = mixingRatio.split(":").map(Number);
        const footingTotalRatio = footingRatios.reduce(
          (sum, ratio) => sum + ratio,
          0,
        );
        cement = ((dryVolume * footingRatios[0]) / footingTotalRatio) * 1.25;
        sand = (dryVolume * footingRatios[1]) / footingTotalRatio;
        stoneChips = (dryVolume * footingRatios[2]) / footingTotalRatio;

        // Footing reinforcement (both ways)
        const footingMainReinforcement =
          (parseFloat(length) / 0.5) * parseFloat(width) * 0.48;
        const footingDistributionReinforcement =
          (parseFloat(width) / 0.5) * parseFloat(length) * 0.48;

        reinforcementDetails = {
          mainReinforcement: footingMainReinforcement,
          distributionReinforcement: footingDistributionReinforcement,
        };
        reinforcement =
          footingMainReinforcement + footingDistributionReinforcement;
        break;

      case "retaining_wall":
        // Retaining wall calculation
        volume =
          parseFloat(length) * parseFloat(thickness) * parseFloat(height);
        dryVolume = volume * 1.5;
        cement = ((dryVolume * 1) / 5.5) * 1.25;
        sand = (dryVolume * 1.5) / 5.5;
        stoneChips = (dryVolume * 3) / 5.5;

        // Retaining wall reinforcement
        const rwMainReinforcement =
          (parseFloat(length) / 0.42) * parseFloat(height) * 0.27 * 2; // Both faces
        const rwDistributionReinforcement =
          (parseFloat(height) / 0.58) * parseFloat(length) * 0.19;
        const rwExtraTop = (parseFloat(length) / 0.5) * 3.12 * 0.19; // Extra top bars

        reinforcementDetails = {
          mainReinforcement: rwMainReinforcement,
          distributionReinforcement: rwDistributionReinforcement,
          extraTopReinforcement: rwExtraTop,
        };
        reinforcement =
          rwMainReinforcement + rwDistributionReinforcement + rwExtraTop;
        break;

      case "water_reservoir":
        // Underground water reservoir
        const wallVolume =
          2 *
          (parseFloat(length) + parseFloat(width)) *
          parseFloat(thickness) *
          parseFloat(height);
        const slabVolume =
          parseFloat(length) * parseFloat(width) * parseFloat(thickness) * 2; // Top and bottom
        volume = wallVolume + slabVolume;
        dryVolume = volume * 1.5;
        cement = ((dryVolume * 1) / 5.5) * 1.25;
        sand = (dryVolume * 1.5) / 5.5;
        stoneChips = (dryVolume * 3) / 5.5;

        // Water reservoir reinforcement
        const wrBottomSlabReinforcement =
          ((parseFloat(width) / 0.42) * parseFloat(length) +
            (parseFloat(length) / 0.58) * parseFloat(width)) *
          0.27 *
          2;
        const wrWallReinforcement =
          (parseFloat(length) / 0.83 + parseFloat(width) / 0.83) *
          parseFloat(height) *
          0.19 *
          2;
        const wrBinderReinforcement =
          (parseFloat(height) / 0.67) *
          (parseFloat(length) + parseFloat(width)) *
          0.19;

        reinforcementDetails = {
          bottomReinforcement: wrBottomSlabReinforcement,
          mainReinforcement: wrWallReinforcement,
          distributionReinforcement: wrBinderReinforcement,
        };
        reinforcement =
          wrBottomSlabReinforcement +
          wrWallReinforcement +
          wrBinderReinforcement;
        break;

      case "column": {
        const colLength = parseFloat(length) / 12; // inches to feet
        const colWidth = parseFloat(width) / 12; // inches to feet
        const colHeight = parseFloat(height);
        volume = colLength * colWidth * colHeight * qty;
        dryVolume = volume * 1.5;
        cement = ((dryVolume * 1) / 5.5) * 1.25;
        sand = (dryVolume * 1.5) / 5.5;
        stoneChips = (dryVolume * 3) / 5.5;

        // Enhanced column reinforcement with multiple bar sizes and stirrup options
        const mainBarWeight =
          parseFloat(barDiameter) === 10
            ? 0.19
            : parseFloat(barDiameter) === 12
              ? 0.27
              : parseFloat(barDiameter) === 16
                ? 0.48
                : parseFloat(barDiameter) === 20
                  ? 0.75
                  : parseFloat(barDiameter) === 25
                    ? 1.17
                    : 1.88;
        const stirrupBarWeight =
          parseFloat(stirrupDiameter) === 8 ? 0.12 : 0.19;

        const colMainReinforcement =
          parseFloat(reinforcementCount) *
          (colHeight + 2.5) *
          mainBarWeight *
          qty;

        // Advanced stirrup calculation with three different strips
        const stirrupSpacingFt = parseFloat(stirrupSpacing) / 12;
        const numberOfStirups = colHeight / stirrupSpacingFt;

        // Stirrup perimeters for different configurations
        const clearCoverInches = parseFloat(clearCover);
        const stirrup1Perimeter =
          (2 *
            (parseFloat(length) + parseFloat(width) - clearCoverInches * 2)) /
          12;
        const stirrup2Perimeter =
          (2 *
            (parseFloat(length) + parseFloat(width) - clearCoverInches * 2)) /
          12;
        const stirrup3Perimeter =
          (Math.sqrt(
            Math.pow(parseFloat(length) - clearCoverInches, 2) +
              Math.pow(parseFloat(width) - clearCoverInches, 2),
          ) *
            4) /
          12;

        const totalStirrups =
          (stirrup1Perimeter + stirrup2Perimeter + stirrup3Perimeter) *
          numberOfStirups *
          stirrupBarWeight;

        reinforcementDetails = {
          mainReinforcement: colMainReinforcement,
          stirrups: totalStirrups,
        };
        reinforcement = colMainReinforcement + totalStirrups;
        break;
      }

      case "beam": {
        const beamLength = parseFloat(length);
        const beamWidth = parseFloat(width) / 12;
        const beamHeight = parseFloat(height) / 12;
        volume = beamLength * beamWidth * beamHeight * qty;
        dryVolume = volume * 1.5;
        // Dynamic concrete ratio based on mixing ratio
        const beamRatios = mixingRatio.split(":").map(Number);
        const beamTotalRatio = beamRatios.reduce(
          (sum, ratio) => sum + ratio,
          0,
        );
        cement = ((dryVolume * beamRatios[0]) / beamTotalRatio) * 1.25;
        sand = (dryVolume * beamRatios[1]) / beamTotalRatio;
        stoneChips = (dryVolume * beamRatios[2]) / beamTotalRatio;

        // Enhanced beam reinforcement with variable bar sizes
        const beamMainBarWeight =
          parseFloat(barDiameter) === 10
            ? 0.19
            : parseFloat(barDiameter) === 12
              ? 0.27
              : parseFloat(barDiameter) === 16
                ? 0.48
                : parseFloat(barDiameter) === 20
                  ? 0.75
                  : parseFloat(barDiameter) === 25
                    ? 1.17
                    : 1.88;
        const beamStirrupBarWeight =
          parseFloat(stirrupDiameter) === 8 ? 0.12 : 0.19;

        const beamMainReinforcement =
          parseFloat(reinforcementCount) * beamLength * beamMainBarWeight;
        const beamExtraTopReinforcement =
          3 * (beamLength / 4) * beamMainBarWeight; // L/4 length at supports

        // Beam stirrups - different spacing zones with custom spacing
        const customSpacing = parseFloat(stirrupSpacing);
        const stirrupLength6inch = (beamLength * 0.5) / (customSpacing / 12); // Custom spacing
        const stirrupLength8inch =
          (beamLength * 0.5) / ((customSpacing + 2) / 12); // Custom spacing + 2
        const clearCoverInches = parseFloat(clearCover);
        const beamStirrupPerimeter =
          (2 *
            (parseFloat(width) + parseFloat(height) - clearCoverInches * 2)) /
            12 +
          4 / 12; // Add hooks
        const beamStirrupReinforcement =
          (stirrupLength6inch + stirrupLength8inch) *
          beamStirrupPerimeter *
          beamStirrupBarWeight;

        reinforcementDetails = {
          mainReinforcement: beamMainReinforcement,
          extraTopReinforcement: beamExtraTopReinforcement,
          stirrups: beamStirrupReinforcement,
        };
        reinforcement =
          beamMainReinforcement +
          beamExtraTopReinforcement +
          beamStirrupReinforcement;
        break;
      }

      case "stair":
        // Stair calculation with flight and landing
        const treads = 10; // Number of treads
        const riser = 5.5 / 12; // 5.5" riser in feet
        const tread = 10 / 12; // 10" tread in feet
        const flightLength = Math.sqrt(
          Math.pow(treads * tread, 2) + Math.pow(treads * riser, 2),
        );
        const stairWidth = parseFloat(width);
        const slabThickness = parseFloat(thickness) / 12;

        const flightVolume = 0.5 * tread * riser * treads * stairWidth; // Triangular steps
        const landingVolume =
          parseFloat(length) * stairWidth * slabThickness * 2; // Two landings
        volume = flightVolume + landingVolume;
        dryVolume = volume * 1.5;
        cement = ((dryVolume * 1) / 5.5) * 1.25;
        sand = (dryVolume * 1.5) / 5.5;
        stoneChips = (dryVolume * 3) / 5.5;

        // Stair reinforcement
        const stairLongReinforcement =
          (stairWidth / 0.42) * flightLength * 0.27;
        const stairShortReinforcement =
          (flightLength / 0.42) * stairWidth * 0.27;
        const stairExtraTopReinforcement =
          (stairWidth / 0.42) * (parseFloat(length) / 4) * 0.27 * 2; // At landings

        reinforcementDetails = {
          mainReinforcement:
            stairLongReinforcement +
            stairShortReinforcement +
            stairExtraTopReinforcement,
          longDirection: stairLongReinforcement,
          shortDirection: stairShortReinforcement,
          extraTopReinforcement: stairExtraTopReinforcement,
        };
        reinforcement =
          stairLongReinforcement +
          stairShortReinforcement +
          stairExtraTopReinforcement;
        break;

      case "slab":
        volume =
          parseFloat(length) *
          parseFloat(width) *
          (parseFloat(thickness) / 12) *
          qty;
        dryVolume = volume * 1.5;
        cement = ((dryVolume * 1) / 5.5) * 1.25;
        sand = (dryVolume * 1.5) / 5.5;
        stoneChips = (dryVolume * 3) / 5.5;

        // Two-way slab reinforcement
        const slabLongReinforcement =
          (parseFloat(width) / 0.42) * parseFloat(length) * 0.27;
        const slabShortReinforcement =
          (parseFloat(length) / 0.58) * parseFloat(width) * 0.19;

        reinforcementDetails = {
          mainReinforcement:
            (slabLongReinforcement + slabShortReinforcement) * 2,
          longDirection: slabLongReinforcement,
          shortDirection: slabShortReinforcement,
          topReinforcement: slabLongReinforcement + slabShortReinforcement,
          bottomReinforcement: slabLongReinforcement + slabShortReinforcement,
        };
        reinforcement = (slabLongReinforcement + slabShortReinforcement) * 2; // Top and bottom
        break;

      case "overhead_tank":
        // Similar to water reservoir but elevated
        const tankWallVolume =
          2 *
          (parseFloat(length) + parseFloat(width)) *
          parseFloat(thickness) *
          parseFloat(height);
        const tankSlabVolume =
          parseFloat(length) * parseFloat(width) * parseFloat(thickness) * 2;
        volume = tankWallVolume + tankSlabVolume;
        dryVolume = volume * 1.5;
        cement = ((dryVolume * 1) / 5.5) * 1.25;
        sand = (dryVolume * 1.5) / 5.5;
        stoneChips = (dryVolume * 3) / 5.5;

        // Overhead tank reinforcement (similar to water reservoir)
        const otBottomSlabReinforcement =
          ((parseFloat(width) / 0.42) * parseFloat(length) +
            (parseFloat(length) / 0.58) * parseFloat(width)) *
          0.27 *
          2;
        const otWallReinforcement =
          (parseFloat(length) / 0.83 + parseFloat(width) / 0.83) *
          parseFloat(height) *
          0.19 *
          2;

        reinforcementDetails = {
          bottomReinforcement: otBottomSlabReinforcement,
          mainReinforcement: otWallReinforcement,
        };
        reinforcement = otBottomSlabReinforcement + otWallReinforcement;
        break;

      case "septic_tank":
        // Septic tank calculation
        const septicWallVolume =
          2 *
          (parseFloat(length) + parseFloat(width)) *
          parseFloat(thickness) *
          parseFloat(height);
        const septicSlabVolume =
          parseFloat(length) * parseFloat(width) * parseFloat(thickness) * 2;
        volume = septicWallVolume + septicSlabVolume;
        dryVolume = volume * 1.5;
        cement = ((dryVolume * 1) / 5.5) * 1.25;
        sand = (dryVolume * 1.5) / 5.5;
        stoneChips = (dryVolume * 3) / 5.5;

        // Septic tank reinforcement
        const stBottomSlabReinforcement =
          ((parseFloat(width) / 0.42) * parseFloat(length) +
            (parseFloat(length) / 0.58) * parseFloat(width)) *
          0.27;
        const stWallReinforcement =
          (parseFloat(length) / 0.5 + parseFloat(width) / 0.5) *
          parseFloat(height) *
          0.19;

        reinforcementDetails = {
          bottomReinforcement: stBottomSlabReinforcement,
          mainReinforcement: stWallReinforcement,
        };
        reinforcement = stBottomSlabReinforcement + stWallReinforcement;
        break;

      case "lift_core":
        // Lift core shaft calculation
        const liftWallVolume =
          4 * parseFloat(length) * parseFloat(thickness) * parseFloat(height);
        volume = liftWallVolume;
        dryVolume = volume * 1.5;
        cement = ((dryVolume * 1) / 5.5) * 1.25;
        sand = (dryVolume * 1.5) / 5.5;
        stoneChips = (dryVolume * 3) / 5.5;

        // Lift core reinforcement (higher due to dynamic loads)
        const lcMainReinforcement =
          ((parseFloat(length) * 4) / 0.33) * parseFloat(height) * 0.48; // 4" spacing
        const lcDistributionReinforcement =
          (parseFloat(height) / 0.33) * parseFloat(length) * 4 * 0.19;

        reinforcementDetails = {
          mainReinforcement: lcMainReinforcement,
          distributionReinforcement: lcDistributionReinforcement,
        };
        reinforcement = lcMainReinforcement + lcDistributionReinforcement;
        break;

      case "brick_work":
        // Brick work calculation
        const wallArea = parseFloat(length) * parseFloat(wallHeight);
        brickQuantity = wallArea * 37.5; // Bricks per sq ft for 5" wall
        volume = wallArea * (parseFloat(thickness) / 12);
        cement = (volume * 1) / 7; // 1:6 mortar ratio
        sand = (volume * 6) / 7;
        stoneChips = 0; // No stone chips in brick work

        reinforcementDetails = {};
        reinforcement = 0; // No reinforcement in normal brick work
        break;

      case "plaster_work":
        // Plaster work calculation
        plasterArea = parseFloat(length) * parseFloat(wallHeight) * qty;
        volume = plasterArea * (parseFloat(plasterThickness) / 12);
        dryVolume = volume * 1.5;
        const plasterRatio = parseFloat(plasterThickness) === 0.75 ? 7 : 5; // 1:6 for 3/4", 1:4 for 1/4"
        cement = ((dryVolume * 1) / plasterRatio) * 1.25;
        sand = (dryVolume * (plasterRatio - 1)) / plasterRatio;
        stoneChips = 0;

        reinforcementDetails = {};
        reinforcement = 0;
        break;

      default:
        reinforcementDetails = {};
        break;
    }

    // Cost calculation with advanced features
    const cementCost = cement * materialRates.cement;
    const sandCost = sand * materialRates.sand;
    const stoneChipsCost = stoneChips * materialRates.stoneChips;
    const reinforcementCost = reinforcement * materialRates.reinforcement;
    const brickCost = brickQuantity * materialRates.brick;
    const laborCost = volume * materialRates.labor; // Labor cost per cft

    const totalCost =
      cementCost +
      sandCost +
      stoneChipsCost +
      reinforcementCost +
      brickCost +
      laborCost;

    return {
      cement: Math.round(cement * 100) / 100,
      sand: Math.round(sand * 100) / 100,
      stoneChips: Math.round(stoneChips * 100) / 100,
      reinforcement: Math.round(reinforcement * 100) / 100,
      reinforcementDetails,
      volume: Math.round(volume * 100) / 100,
      totalCost: Math.round(totalCost),
      brickQuantity: Math.round(brickQuantity),
      plasterArea: Math.round(plasterArea * 100) / 100,
    };
  };

  const handleAddItem = () => {
    const results = calculateEstimate(selectedType, formData);
    const itemId = editingItem
      ? editingItem.itemId
      : generateItemId(selectedType);

    const newItem: EstimateItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      itemId,
      type: selectedType,
      description:
        formData.description ||
        `${itemTypeConfig[selectedType].name} ${itemId}`,
      dimensions: { ...formData },
      results,
      unit:
        selectedType === "brick_work"
          ? "sft"
          : selectedType === "plaster_work"
            ? "sft"
            : "cft",
      quantity: parseFloat(formData.quantity),
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingItem) {
      setCurrentProject((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === editingItem.id ? newItem : item,
        ),
        updatedAt: new Date().toISOString(),
      }));
    } else {
      setCurrentProject((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
        updatedAt: new Date().toISOString(),
      }));
    }

    resetForm();
  };

  const handleSavePricingSettings = () => {
    setMaterialRates(tempRates);
    setCurrentProject((prev) => ({
      ...prev,
      customRates: tempRates,
      updatedAt: new Date().toISOString(),
    }));
    setIsPricingDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      description: "",
      length: "",
      width: "",
      height: "",
      diameter: "",
      quantity: "1",
      reinforcementCount: "6",
      thickness: "",
      spacing: "",
      brickSize: "",
      plasterThickness: "",
      wallHeight: "",
      doorWidth: "",
      doorHeight: "",
      windowWidth: "",
      windowHeight: "",
      footingType: "",
      stirrupSpacing: "4",
      barDiameter: "20",
      clearCover: "1.5",
      stirrupDiameter: "8",
      mixingRatio: "1:1.5:3",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEditItem = (item: EstimateItem) => {
    setEditingItem(item);
    setSelectedType(item.type);
    setFormData({
      description: item.description,
      length: item.dimensions.length || "",
      width: item.dimensions.width || "",
      height: item.dimensions.height || "",
      diameter: item.dimensions.diameter || "",
      quantity: item.dimensions.quantity || "1",
      reinforcementCount: item.dimensions.reinforcementCount || "6",
      thickness: item.dimensions.thickness || "",
      spacing: item.dimensions.spacing || "",
      brickSize: item.dimensions.brickSize || "",
      plasterThickness: item.dimensions.plasterThickness || "",
      wallHeight: item.dimensions.wallHeight || "",
      doorWidth: item.dimensions.doorWidth || "",
      doorHeight: item.dimensions.doorHeight || "",
      windowWidth: item.dimensions.windowWidth || "",
      windowHeight: item.dimensions.windowHeight || "",
      footingType: item.dimensions.footingType || "",
      stirrupSpacing: item.dimensions.stirrupSpacing || "4",
      barDiameter: item.dimensions.barDiameter || "20",
      clearCover: item.dimensions.clearCover || "1.5",
      stirrupDiameter: item.dimensions.stirrupDiameter || "8",
      mixingRatio: item.dimensions.mixingRatio || "1:1.5:3",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setCurrentProject((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleDuplicateItem = (item: EstimateItem) => {
    const newItemId = generateItemId(item.type);
    const duplicatedItem: EstimateItem = {
      ...item,
      id: Date.now().toString(),
      itemId: newItemId,
      description: `${item.description} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject((prev) => ({
      ...prev,
      items: [...prev.items, duplicatedItem],
      updatedAt: new Date().toISOString(),
    }));
  };

  const getTotalEstimate = () => {
    return currentProject.items.reduce(
      (totals, item) => ({
        cement: totals.cement + item.results.cement,
        sand: totals.sand + item.results.sand,
        stoneChips: totals.stoneChips + item.results.stoneChips,
        reinforcement: totals.reinforcement + item.results.reinforcement,
        totalCost: totals.totalCost + item.results.totalCost,
        volume: totals.volume + item.results.volume,
        brickQuantity: totals.brickQuantity + (item.results.brickQuantity || 0),
        plasterArea: totals.plasterArea + (item.results.plasterArea || 0),
      }),
      {
        cement: 0,
        sand: 0,
        stoneChips: 0,
        reinforcement: 0,
        totalCost: 0,
        volume: 0,
        brickQuantity: 0,
        plasterArea: 0,
      },
    );
  };

  const renderDimensionFields = () => {
    const config = itemTypeConfig[selectedType];
    const IconComponent = config.icon;

    const commonFields = (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="length">Length (feet)</Label>
          <Input
            id="length"
            placeholder="Length"
            value={formData.length}
            onChange={(e) =>
              setFormData({ ...formData, length: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="width">Width (feet)</Label>
          <Input
            id="width"
            placeholder="Width"
            value={formData.width}
            onChange={(e) =>
              setFormData({ ...formData, width: e.target.value })
            }
          />
        </div>
      </div>
    );

    const reinforcementFields = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="stirrupSpacing" className="text-sm font-medium">
              Stirrup Spacing (inches)
            </Label>
            <Select
              value={formData.stirrupSpacing}
              onValueChange={(value) =>
                setFormData({ ...formData, stirrupSpacing: value })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 inches</SelectItem>
                <SelectItem value="4">4 inches</SelectItem>
                <SelectItem value="6">6 inches</SelectItem>
                <SelectItem value="8">8 inches</SelectItem>
                <SelectItem value="10">10 inches</SelectItem>
                <SelectItem value="12">12 inches</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="barDiameter" className="text-sm font-medium">
              Main Bar Diameter (mm)
            </Label>
            <Select
              value={formData.barDiameter}
              onValueChange={(value) =>
                setFormData({ ...formData, barDiameter: value })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10mm</SelectItem>
                <SelectItem value="12">12mm</SelectItem>
                <SelectItem value="16">16mm</SelectItem>
                <SelectItem value="20">20mm</SelectItem>
                <SelectItem value="25">25mm</SelectItem>
                <SelectItem value="32">32mm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="stirrupDiameter" className="text-sm font-medium">
              Stirrup Diameter (mm)
            </Label>
            <Select
              value={formData.stirrupDiameter}
              onValueChange={(value) =>
                setFormData({ ...formData, stirrupDiameter: value })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8mm</SelectItem>
                <SelectItem value="10">10mm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="clearCover" className="text-sm font-medium">
              Clear Cover (inches)
            </Label>
            <Input
              id="clearCover"
              placeholder="1.5"
              value={formData.clearCover}
              onChange={(e) =>
                setFormData({ ...formData, clearCover: e.target.value })
              }
              className="h-10"
            />
          </div>
        </div>
        <div className="border-t pt-4">
          <Label htmlFor="mixingRatio" className="text-sm font-medium">
            Concrete Mixing Ratio
          </Label>
          <Select
            value={formData.mixingRatio}
            onValueChange={(value) =>
              setFormData({ ...formData, mixingRatio: value })
            }
          >
            <SelectTrigger className="h-10 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1:1.5:3">1:1.5:3 (High Strength)</SelectItem>
              <SelectItem value="1:2:4">1:2:4 (Medium Strength)</SelectItem>
              <SelectItem value="1:3:6">1:3:6 (Standard)</SelectItem>
              <SelectItem value="1:4:8">1:4:8 (Economy)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );

    return (
      <div className="space-y-4">
        {/* Category Header */}
        <div className={`p-3 rounded-lg ${config.bgColor} border`}>
          <div className="flex items-center space-x-2">
            <IconComponent className={`h-5 w-5 ${config.color}`} />
            <span className="font-medium text-gray-900">{config.name}</span>
            <Badge variant="secondary">{config.category}</Badge>
          </div>
        </div>

        {/* Dynamic Form Fields */}
        {selectedType === "pile" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diameter">Diameter (inches)</Label>
                <Input
                  id="diameter"
                  placeholder="e.g., 20"
                  value={formData.diameter}
                  onChange={(e) =>
                    setFormData({ ...formData, diameter: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="length">Length (feet)</Label>
                <Input
                  id="length"
                  placeholder="e.g., 60"
                  value={formData.length}
                  onChange={(e) =>
                    setFormData({ ...formData, length: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  placeholder="e.g., 7"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="reinforcement">Reinforcement Bars</Label>
                <Select
                  value={formData.reinforcementCount}
                  onValueChange={(value) =>
                    setFormData({ ...formData, reinforcementCount: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 bars</SelectItem>
                    <SelectItem value="7">7 bars</SelectItem>
                    <SelectItem value="8">8 bars</SelectItem>
                    <SelectItem value="10">10 bars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {reinforcementFields}
          </div>
        )}

        {selectedType === "column" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length">Length (inches)</Label>
                <Input
                  id="length"
                  placeholder="e.g., 12"
                  value={formData.length}
                  onChange={(e) =>
                    setFormData({ ...formData, length: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="width">Width (inches)</Label>
                <Input
                  id="width"
                  placeholder="e.g., 15"
                  value={formData.width}
                  onChange={(e) =>
                    setFormData({ ...formData, width: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="height">Height (feet)</Label>
                <Input
                  id="height"
                  placeholder="e.g., 10"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="reinforcement">Main Reinforcement</Label>
                <Select
                  value={formData.reinforcementCount}
                  onValueChange={(value) =>
                    setFormData({ ...formData, reinforcementCount: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 bars</SelectItem>
                    <SelectItem value="6">6 bars</SelectItem>
                    <SelectItem value="8">8 bars</SelectItem>
                    <SelectItem value="10">10 bars</SelectItem>
                    <SelectItem value="12">12 bars</SelectItem>
                    <SelectItem value="16">16 bars</SelectItem>
                    <SelectItem value="20">20 bars</SelectItem>
                    <SelectItem value="24">24 bars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {reinforcementFields}
          </div>
        )}

        {selectedType === "beam" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length">Length (feet)</Label>
                <Input
                  id="length"
                  placeholder="e.g., 28"
                  value={formData.length}
                  onChange={(e) =>
                    setFormData({ ...formData, length: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="width">Width (inches)</Label>
                <Input
                  id="width"
                  placeholder="e.g., 10"
                  value={formData.width}
                  onChange={(e) =>
                    setFormData({ ...formData, width: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="height">Height (inches)</Label>
                <Input
                  id="height"
                  placeholder="e.g., 18"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="reinforcement">Main Reinforcement</Label>
                <Select
                  value={formData.reinforcementCount}
                  onValueChange={(value) =>
                    setFormData({ ...formData, reinforcementCount: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 bars</SelectItem>
                    <SelectItem value="5">5 bars</SelectItem>
                    <SelectItem value="6">6 bars</SelectItem>
                    <SelectItem value="8">8 bars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {reinforcementFields}
          </div>
        )}

        {selectedType === "footing" && (
          <div className="space-y-4">
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (feet)</Label>
                <Input
                  id="height"
                  placeholder="e.g., 1.5"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="footingType">Footing Type</Label>
                <Select
                  value={formData.footingType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, footingType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="isolated">Isolated Footing</SelectItem>
                    <SelectItem value="combined">Combined Footing</SelectItem>
                    <SelectItem value="strip">Strip Footing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {reinforcementFields}
          </div>
        )}

        {selectedType === "brick_work" && (
          <div className="space-y-4">
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wallHeight">Wall Height (feet)</Label>
                <Input
                  id="wallHeight"
                  placeholder="e.g., 9.5"
                  value={formData.wallHeight}
                  onChange={(e) =>
                    setFormData({ ...formData, wallHeight: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="thickness">Wall Thickness (inches)</Label>
                <Select
                  value={formData.thickness}
                  onValueChange={(value) =>
                    setFormData({ ...formData, thickness: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select thickness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 inches</SelectItem>
                    <SelectItem value="10">10 inches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {selectedType === "plaster_work" && (
          <div className="space-y-4">
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wallHeight">Wall Height (feet)</Label>
                <Input
                  id="wallHeight"
                  placeholder="e.g., 9.5"
                  value={formData.wallHeight}
                  onChange={(e) =>
                    setFormData({ ...formData, wallHeight: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="plasterThickness">Plaster Thickness</Label>
                <Select
                  value={formData.plasterThickness}
                  onValueChange={(value) =>
                    setFormData({ ...formData, plasterThickness: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select thickness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.25">1/4 inch (6mm)</SelectItem>
                    <SelectItem value="0.5">1/2 inch (12mm)</SelectItem>
                    <SelectItem value="0.75">3/4 inch (18mm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {(selectedType === "water_reservoir" ||
          selectedType === "septic_tank" ||
          selectedType === "overhead_tank") && (
          <div className="space-y-4">
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (feet)</Label>
                <Input
                  id="height"
                  placeholder="e.g., 8"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="thickness">Wall Thickness (inches)</Label>
                <Input
                  id="thickness"
                  placeholder="e.g., 7"
                  value={formData.thickness}
                  onChange={(e) =>
                    setFormData({ ...formData, thickness: e.target.value })
                  }
                />
              </div>
            </div>
            {reinforcementFields}
          </div>
        )}

        {/* Default fields for other types */}
        {![
          "pile",
          "column",
          "beam",
          "footing",
          "brick_work",
          "plaster_work",
          "water_reservoir",
          "septic_tank",
          "overhead_tank",
        ].includes(selectedType) && (
          <div className="space-y-4">
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (feet)</Label>
                <Input
                  id="height"
                  placeholder="Height"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  placeholder="e.g., 1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>
            </div>
            {[
              "mat_foundation",
              "retaining_wall",
              "stair",
              "slab",
              "lift_core",
            ].includes(selectedType) && reinforcementFields}
          </div>
        )}
      </div>
    );
  };

  const filteredItems = currentProject.items.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || item.type === filterType;
    const matchesCategory =
      selectedCategory === "all" ||
      itemTypeConfig[item.type].category === selectedCategory;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const totals = getTotalEstimate();
  const categoryTotals = Object.entries(
    currentProject.items.reduce(
      (acc, item) => {
        const category = itemTypeConfig[item.type].category;
        acc[category] = (acc[category] || 0) + item.results.totalCost;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl shadow-lg">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Professional Construction Estimator
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{currentProject.name}</span>
                  <span>•</span>
                  <span>{currentProject.items.length} items</span>
                  <span>•</span>
                  <span>{formatBDT(totals.totalCost)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Dialog
                open={isPricingDialogOpen}
                onOpenChange={setIsPricingDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pricing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Cog className="h-5 w-5" />
                      <span>Custom Material Pricing</span>
                    </DialogTitle>
                    <DialogDescription>
                      Set custom material rates for this project. These rates
                      will be used for all cost calculations.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cement-rate">
                        Cement Rate (BDT per bag)
                      </Label>
                      <Input
                        id="cement-rate"
                        placeholder="450"
                        value={tempRates.cement}
                        onChange={(e) =>
                          setTempRates({
                            ...tempRates,
                            cement: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="sand-rate">Sand Rate (BDT per cft)</Label>
                      <Input
                        id="sand-rate"
                        placeholder="45"
                        value={tempRates.sand}
                        onChange={(e) =>
                          setTempRates({
                            ...tempRates,
                            sand: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="stone-rate">
                        Stone Chips Rate (BDT per cft)
                      </Label>
                      <Input
                        id="stone-rate"
                        placeholder="55"
                        value={tempRates.stoneChips}
                        onChange={(e) =>
                          setTempRates({
                            ...tempRates,
                            stoneChips: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="steel-rate">
                        Steel Rate (BDT per kg)
                      </Label>
                      <Input
                        id="steel-rate"
                        placeholder="75"
                        value={tempRates.reinforcement}
                        onChange={(e) =>
                          setTempRates({
                            ...tempRates,
                            reinforcement: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="brick-rate">
                        Brick Rate (BDT per piece)
                      </Label>
                      <Input
                        id="brick-rate"
                        placeholder="12"
                        value={tempRates.brick}
                        onChange={(e) =>
                          setTempRates({
                            ...tempRates,
                            brick: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="labor-rate">
                        Labor Rate (BDT per cft)
                      </Label>
                      <Input
                        id="labor-rate"
                        placeholder="300"
                        value={tempRates.labor}
                        onChange={(e) =>
                          setTempRates({
                            ...tempRates,
                            labor: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsPricingDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSavePricingSettings}
                      className="bg-brand-500 hover:bg-brand-600"
                    >
                      Save Pricing Settings
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="items" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Project Items</span>
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Cost Analysis</span>
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Detailed Report</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-2"
            >
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6 mt-6">
            {/* Category Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "ring-2 ring-brand-500 bg-brand-50 shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                <CardContent className="p-4 text-center">
                  <HardHat className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <h3 className="font-medium text-sm">All Categories</h3>
                  <p className="text-xs text-gray-500">
                    {currentProject.items.length} items
                  </p>
                </CardContent>
              </Card>
              {categories.map((category) => {
                const IconComponent = category.icon;
                const categoryItems = currentProject.items.filter((item) =>
                  category.items.includes(item.type),
                );
                return (
                  <Card
                    key={category.name}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedCategory === category.name
                        ? `ring-2 ring-brand-500 ${category.bgColor} shadow-lg`
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent
                        className={`h-8 w-8 mx-auto mb-2 ${category.color}`}
                      />
                      <h3 className="font-medium text-sm">{category.name}</h3>
                      <p className="text-xs text-gray-500">
                        {categoryItems.length} items
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Project Items
                </h2>
                <p className="text-gray-600">
                  Comprehensive construction estimation with detailed
                  reinforcement calculations
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select
                  value={filterType}
                  onValueChange={(value) =>
                    setFilterType(value as ItemType | "all")
                  }
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(itemTypeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-brand-500 hover:bg-brand-600 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-5xl max-h-[90vh] overflow-y-auto mx-4">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? "Edit Item" : "Add New Item"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingItem
                          ? "Update the item details and calculations"
                          : "Add a new construction element with detailed reinforcement calculations"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="item-type">Item Type</Label>
                          <Select
                            value={selectedType}
                            onValueChange={(value: ItemType) =>
                              setSelectedType(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <div key={category.name}>
                                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-100">
                                    {category.name} Works
                                  </div>
                                  {category.items.map((itemType) => {
                                    const config =
                                      itemTypeConfig[itemType as ItemType];
                                    const IconComponent = config.icon;
                                    return (
                                      <SelectItem
                                        key={itemType}
                                        value={itemType}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <IconComponent
                                            className={`h-4 w-4 ${config.color}`}
                                          />
                                          <span>{config.name}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">
                            Description (Optional)
                          </Label>
                          <Input
                            id="description"
                            placeholder="e.g., Main structural column"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      {renderDimensionFields()}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddItem}
                        className="bg-brand-500 hover:bg-brand-600"
                      >
                        {editingItem ? "Update Item" : "Add Item"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Item ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Reinforcement</TableHead>
                      <TableHead>Volume/Area</TableHead>
                      <TableHead className="text-right">Cost (BDT)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
                      const config = itemTypeConfig[item.type];
                      const IconComponent = config.icon;
                      return (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {item.itemId}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <IconComponent
                                className={`h-4 w-4 ${config.color}`}
                              />
                              <div>
                                <p className="font-medium">{config.name}</p>
                                <p className="text-xs text-gray-500">
                                  {item.type.replace("_", " ")}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${config.bgColor} ${config.color}`}
                            >
                              {config.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Activity className="h-3 w-3 text-green-600" />
                              <span className="text-sm font-medium">
                                {item.results.reinforcement} kg
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {item.type === "brick_work" ||
                              item.type === "plaster_work" ? (
                                <p>
                                  {item.results.plasterArea ||
                                    item.results.brickQuantity}{" "}
                                  {item.unit}
                                </p>
                              ) : (
                                <p>{item.results.volume} cft</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatBDT(item.results.totalCost)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDuplicateItem(item)}
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Building2 className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-gray-500">No items found</p>
                            <p className="text-sm text-gray-400">
                              {searchTerm || filterType !== "all"
                                ? "Try adjusting your search or filter"
                                : "Click 'Add Item' to start building your estimate"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Material Summary</span>
                  </CardTitle>
                  <CardDescription>
                    Comprehensive material requirements analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border">
                      <p className="text-sm text-blue-600">Cement</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {totals.cement.toFixed(2)}
                      </p>
                      <p className="text-sm text-blue-600">bags</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg border">
                      <p className="text-sm text-amber-600">Sand</p>
                      <p className="text-2xl font-bold text-amber-900">
                        {totals.sand.toFixed(2)}
                      </p>
                      <p className="text-sm text-amber-600">cft</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-600">Stone Chips</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totals.stoneChips.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">cft</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border">
                      <p className="text-sm text-green-600">
                        Steel Reinforcement
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {totals.reinforcement.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-600">kg</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border">
                      <p className="text-sm text-red-600">Bricks</p>
                      <p className="text-2xl font-bold text-red-900">
                        {totals.brickQuantity.toFixed(0)}
                      </p>
                      <p className="text-sm text-red-600">nos</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border">
                      <p className="text-sm text-purple-600">Plaster Area</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {totals.plasterArea.toFixed(2)}
                      </p>
                      <p className="text-sm text-purple-600">sft</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Cost by Category</span>
                  </CardTitle>
                  <CardDescription>Professional cost breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryTotals.map(([category, cost]) => {
                      const categoryConfig = categories.find(
                        (c) => c.name === category,
                      );
                      const IconComponent = categoryConfig?.icon || Building2;
                      return (
                        <div
                          key={category}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <IconComponent
                              className={`h-4 w-4 ${categoryConfig?.color || "text-gray-600"}`}
                            />
                            <span className="text-sm font-medium">
                              {category}
                            </span>
                          </div>
                          <span className="font-bold">{formatBDT(cost)}</span>
                        </div>
                      );
                    })}
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold bg-brand-50 p-3 rounded-lg border-2 border-brand-200">
                      <span>Total Project Cost</span>
                      <span className="text-brand-600">
                        {formatBDT(totals.totalCost)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Detailed Cost Breakdown</span>
                </CardTitle>
                <CardDescription>
                  Material costs at current rates (BDT)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>
                        Cement ({totals.cement.toFixed(1)} bags @ BDT{" "}
                        {materialRates.cement})
                      </span>
                      <span className="font-medium">
                        {formatBDT(totals.cement * materialRates.cement)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Sand ({totals.sand.toFixed(1)} cft @ BDT{" "}
                        {materialRates.sand})
                      </span>
                      <span className="font-medium">
                        {formatBDT(totals.sand * materialRates.sand)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Stone Chips ({totals.stoneChips.toFixed(1)} cft @ BDT{" "}
                        {materialRates.stoneChips})
                      </span>
                      <span className="font-medium">
                        {formatBDT(
                          totals.stoneChips * materialRates.stoneChips,
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>
                        Steel ({totals.reinforcement.toFixed(1)} kg @ BDT{" "}
                        {materialRates.reinforcement})
                      </span>
                      <span className="font-medium">
                        {formatBDT(
                          totals.reinforcement * materialRates.reinforcement,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Bricks ({totals.brickQuantity} nos @ BDT{" "}
                        {materialRates.brick})
                      </span>
                      <span className="font-medium">
                        {formatBDT(totals.brickQuantity * materialRates.brick)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Labor ({totals.volume.toFixed(1)} cft @ BDT{" "}
                        {materialRates.labor})
                      </span>
                      <span className="font-medium">
                        {formatBDT(totals.volume * materialRates.labor)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Comprehensive Project Report</span>
                </CardTitle>
                <CardDescription>
                  Detailed breakdown with reinforcement analysis for all items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(
                    currentProject.items.reduce(
                      (acc, item) => {
                        const category = itemTypeConfig[item.type].category;
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(item);
                        return acc;
                      },
                      {} as Record<string, EstimateItem[]>,
                    ),
                  ).map(([category, items]) => {
                    const categoryConfig = categories.find(
                      (c) => c.name === category,
                    );
                    const IconComponent = categoryConfig?.icon || Building2;
                    return (
                      <div
                        key={category}
                        className="border rounded-lg p-6 shadow-sm"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <IconComponent
                            className={`h-6 w-6 ${categoryConfig?.color || "text-gray-600"}`}
                          />
                          <h3 className="text-xl font-bold">
                            {category} Works
                          </h3>
                          <Badge variant="secondary">
                            {items.length} items
                          </Badge>
                        </div>
                        <div className="space-y-4">
                          {items.map((item) => {
                            const config = itemTypeConfig[item.type];
                            const ItemIcon = config.icon;
                            return (
                              <div
                                key={item.id}
                                className="border-l-4 border-l-brand-500 pl-4 bg-gray-50 p-4 rounded-r-lg"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center space-x-2">
                                    <ItemIcon
                                      className={`h-5 w-5 ${config.color}`}
                                    />
                                    <div>
                                      <h4 className="font-semibold">
                                        {item.itemId} - {item.description}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {config.name}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">{item.itemId}</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <h5 className="font-medium mb-1">
                                      Dimensions
                                    </h5>
                                    {Object.entries(item.dimensions)
                                      .filter(
                                        ([_, value]) => value && value !== "0",
                                      )
                                      .slice(0, 4)
                                      .map(([key, value]) => (
                                        <div
                                          key={key}
                                          className="flex justify-between"
                                        >
                                          <span className="text-gray-600">
                                            {key}:
                                          </span>
                                          <span>{value}</span>
                                        </div>
                                      ))}
                                  </div>
                                  <div>
                                    <h5 className="font-medium mb-1">
                                      Materials
                                    </h5>
                                    <div className="space-y-1">
                                      {item.results.cement > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Cement:
                                          </span>
                                          <span>
                                            {item.results.cement} bags
                                          </span>
                                        </div>
                                      )}
                                      {item.results.sand > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Sand:
                                          </span>
                                          <span>{item.results.sand} cft</span>
                                        </div>
                                      )}
                                      {item.results.stoneChips > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Stone:
                                          </span>
                                          <span>
                                            {item.results.stoneChips} cft
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h5 className="font-medium mb-1 flex items-center space-x-1">
                                      <Activity className="h-3 w-3 text-green-600" />
                                      <span>Reinforcement Details</span>
                                    </h5>
                                    <div className="space-y-1">
                                      {item.results.reinforcementDetails
                                        .mainReinforcement && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Main:
                                          </span>
                                          <span>
                                            {item.results.reinforcementDetails.mainReinforcement.toFixed(
                                              1,
                                            )}{" "}
                                            kg
                                          </span>
                                        </div>
                                      )}
                                      {item.results.reinforcementDetails
                                        .stirrups && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Stirrups:
                                          </span>
                                          <span>
                                            {item.results.reinforcementDetails.stirrups.toFixed(
                                              1,
                                            )}{" "}
                                            kg
                                          </span>
                                        </div>
                                      )}
                                      {item.results.reinforcementDetails
                                        .distributionReinforcement && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Distribution:
                                          </span>
                                          <span>
                                            {item.results.reinforcementDetails.distributionReinforcement.toFixed(
                                              1,
                                            )}{" "}
                                            kg
                                          </span>
                                        </div>
                                      )}
                                      {item.results.reinforcementDetails
                                        .spiralReinforcement && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Spiral:
                                          </span>
                                          <span>
                                            {item.results.reinforcementDetails.spiralReinforcement.toFixed(
                                              1,
                                            )}{" "}
                                            kg
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="border-t pt-1 mt-1">
                                      <div className="flex justify-between font-medium">
                                        <span>Total Steel:</span>
                                        <span>
                                          {item.results.reinforcement.toFixed(
                                            1,
                                          )}{" "}
                                          kg
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h5 className="font-medium mb-1">
                                      Cost Analysis
                                    </h5>
                                    <div className="text-right">
                                      <p className="text-lg font-bold text-brand-600">
                                        {formatBDT(item.results.totalCost)}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Volume: {item.results.volume} cft
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Items
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentProject.items.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Construction elements
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Reinforcement
                  </CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totals.reinforcement.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Kilograms steel
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Volume
                  </CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totals.volume.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">Cubic feet</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Project Value
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatBDT(totals.totalCost)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total estimate
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Project Progress by Category</span>
                </CardTitle>
                <CardDescription>
                  Cost distribution and completion status with reinforcement
                  analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryTotals.map(([category, cost]) => {
                    const percentage = (cost / totals.totalCost) * 100;
                    const categoryConfig = categories.find(
                      (c) => c.name === category,
                    );
                    const IconComponent = categoryConfig?.icon || Building2;
                    const categoryItems = currentProject.items.filter(
                      (item) => itemTypeConfig[item.type].category === category,
                    );
                    const categoryReinforcement = categoryItems.reduce(
                      (sum, item) => sum + item.results.reinforcement,
                      0,
                    );
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <IconComponent
                              className={`h-4 w-4 ${categoryConfig?.color || "text-gray-600"}`}
                            />
                            <span className="text-sm font-medium">
                              {category}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {categoryItems.length} items
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">
                              {formatBDT(cost)}
                            </span>
                            <span className="text-xs text-gray-600 ml-2">
                              {percentage.toFixed(1)}%
                            </span>
                            <div className="text-xs text-green-600">
                              {categoryReinforcement.toFixed(1)} kg steel
                            </div>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer with Developer Credit */}
      <footer className="bg-white border-t shadow-lg mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Professional Construction Estimator
                </h3>
                <p className="text-sm text-gray-600">
                  Advanced Construction Cost Calculation Software
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center space-x-2 text-brand-700 mb-2">
                <User className="h-5 w-5" />
                <span className="text-lg font-bold">
                  Developed by ROY SHAON
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-end space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  Professional Engineering Calculations
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Calculator className="h-3 w-3 mr-1" />
                  BDT Currency Support
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Settings className="h-3 w-3 mr-1" />
                  Custom Pricing Options
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
