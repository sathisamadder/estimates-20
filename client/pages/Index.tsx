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
} from "lucide-react";

interface EstimateItem {
  id: string;
  itemId: string; // C1, C2, P1, B1, etc.
  type: "pile" | "foundation" | "beam" | "column" | "slab" | "wall";
  description: string;
  dimensions: Record<string, string>;
  results: {
    cement: number;
    sand: number;
    stoneChips: number;
    reinforcement: number;
    totalCost: number;
    volume: number;
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
  items: EstimateItem[];
  createdAt: string;
  updatedAt: string;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("items");
  const [currentProject, setCurrentProject] = useState<Project>({
    id: "1",
    name: "Untitled Project",
    description: "",
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [editingItem, setEditingItem] = useState<EstimateItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] =
    useState<EstimateItem["type"]>("column");

  // Form states
  const [formData, setFormData] = useState({
    description: "",
    length: "",
    width: "",
    height: "",
    diameter: "",
    quantity: "1",
    reinforcementCount: "6",
  });

  // Generate next item ID based on type
  const generateItemId = (type: EstimateItem["type"]): string => {
    const typePrefix = {
      pile: "P",
      foundation: "F",
      beam: "B",
      column: "C",
      slab: "S",
      wall: "W",
    };

    const existingItems = currentProject.items.filter(
      (item) => item.type === type,
    );
    const nextNumber = existingItems.length + 1;
    return `${typePrefix[type]}${nextNumber}`;
  };

  // Calculation functions based on type
  const calculateEstimate = (
    type: EstimateItem["type"],
    dimensions: Record<string, string>,
  ) => {
    const {
      length = "0",
      width = "0",
      height = "0",
      diameter = "0",
      quantity = "1",
      reinforcementCount = "6",
    } = dimensions;

    const qty = parseFloat(quantity);
    let volume = 0;
    let reinforcement = 0;

    switch (type) {
      case "pile":
        const pileLength = parseFloat(length);
        const pileDiameter = parseFloat(diameter) / 12; // inches to feet
        volume = ((Math.PI * Math.pow(pileDiameter, 2) * pileLength) / 4) * qty;
        reinforcement =
          parseFloat(reinforcementCount) * (pileLength + 2.5) * 0.75 * qty;
        break;

      case "column":
        const colLength = parseFloat(length) / 12; // inches to feet
        const colWidth = parseFloat(width) / 12; // inches to feet
        const colHeight = parseFloat(height);
        volume = colLength * colWidth * colHeight * qty;
        reinforcement =
          parseFloat(reinforcementCount) * (colHeight + 2.5) * 0.75 * qty;
        break;

      case "beam":
        const beamLength = parseFloat(length);
        const beamWidth = parseFloat(width) / 12; // inches to feet
        const beamHeight = parseFloat(height) / 12; // inches to feet
        volume = beamLength * beamWidth * beamHeight * qty;
        reinforcement =
          parseFloat(reinforcementCount) * beamLength * 0.48 * qty;
        break;

      case "foundation":
        volume =
          parseFloat(length) * parseFloat(width) * parseFloat(height) * qty;
        reinforcement = volume * 80; // kg per cubic foot
        break;

      case "slab":
        volume =
          parseFloat(length) *
          parseFloat(width) *
          (parseFloat(height) / 12) *
          qty;
        reinforcement = volume * 60; // kg per cubic foot
        break;

      case "wall":
        volume =
          parseFloat(length) *
          (parseFloat(width) / 12) *
          parseFloat(height) *
          qty;
        reinforcement = volume * 50; // kg per cubic foot
        break;

      default:
        volume = 0;
        reinforcement = 0;
    }

    const dryVolume = volume * 1.5;
    const totalRatio = type === "beam" ? 7 : 5.5; // Different ratios for different elements

    const cement = ((dryVolume * 1) / totalRatio) * 1.25;
    const sand = (dryVolume * (type === "beam" ? 2 : 1.5)) / totalRatio;
    const stoneChips = (dryVolume * (type === "beam" ? 4 : 3)) / totalRatio;

    // Cost calculation
    const cementRate = 450;
    const sandRate = 45;
    const stoneRate = 55;
    const reinforcementRate = 75;

    const totalCost =
      cement * cementRate +
      sand * sandRate +
      stoneChips * stoneRate +
      reinforcement * reinforcementRate;

    return {
      cement: Math.round(cement * 100) / 100,
      sand: Math.round(sand * 100) / 100,
      stoneChips: Math.round(stoneChips * 100) / 100,
      reinforcement: Math.round(reinforcement * 100) / 100,
      volume: Math.round(volume * 100) / 100,
      totalCost: Math.round(totalCost),
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
        `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} ${itemId}`,
      dimensions: { ...formData },
      results,
      unit: selectedType === "pile" ? "each" : "cft",
      quantity: parseFloat(formData.quantity),
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingItem) {
      // Update existing item
      setCurrentProject((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === editingItem.id ? newItem : item,
        ),
        updatedAt: new Date().toISOString(),
      }));
    } else {
      // Add new item
      setCurrentProject((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
        updatedAt: new Date().toISOString(),
      }));
    }

    // Reset form
    setFormData({
      description: "",
      length: "",
      width: "",
      height: "",
      diameter: "",
      quantity: "1",
      reinforcementCount: "6",
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
      }),
      {
        cement: 0,
        sand: 0,
        stoneChips: 0,
        reinforcement: 0,
        totalCost: 0,
        volume: 0,
      },
    );
  };

  const renderDimensionFields = () => {
    switch (selectedType) {
      case "pile":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
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
          </>
        );

      case "column":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      case "beam":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
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
          </>
        );

      case "foundation":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length">Length (feet)</Label>
                <Input
                  id="length"
                  placeholder="e.g., 100"
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
                  placeholder="e.g., 46.5"
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
                  placeholder="e.g., 1.5"
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
          </>
        );

      default:
        return (
          <div className="grid grid-cols-2 gap-4">
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
        );
    }
  };

  const totals = getTotalEstimate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Professional Estimator
                </h1>
                <p className="text-sm text-gray-600">
                  {currentProject.name} • {currentProject.items.length} items
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Project
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">Project Items</TabsTrigger>
            <TabsTrigger value="summary">Cost Summary</TabsTrigger>
            <TabsTrigger value="details">Detailed Report</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Project Items
                </h2>
                <p className="text-gray-600">
                  Manage construction elements and their estimates
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-500 hover:bg-brand-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? "Edit Item" : "Add New Item"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingItem
                        ? "Update the item details and calculations"
                        : "Add a new construction element to your estimate"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="item-type">Item Type</Label>
                        <Select
                          value={selectedType}
                          onValueChange={(value: EstimateItem["type"]) =>
                            setSelectedType(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="column">Column</SelectItem>
                            <SelectItem value="beam">Beam</SelectItem>
                            <SelectItem value="pile">Pile</SelectItem>
                            <SelectItem value="foundation">
                              Foundation
                            </SelectItem>
                            <SelectItem value="slab">Slab</SelectItem>
                            <SelectItem value="wall">Wall</SelectItem>
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

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProject.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {item.itemId}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {item.type}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {item.type === "pile"
                            ? `∅${item.dimensions.diameter}" × ${item.dimensions.length}' × ${item.dimensions.quantity}`
                            : item.type === "column"
                              ? `${item.dimensions.length}" × ${item.dimensions.width}" × ${item.dimensions.height}'`
                              : `${item.dimensions.length}' × ${item.dimensions.width}' × ${item.dimensions.height}'`}
                        </TableCell>
                        <TableCell>{item.results.volume} cft</TableCell>
                        <TableCell className="text-right font-medium">
                          ৳{item.results.totalCost.toLocaleString()}
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
                    ))}
                    {currentProject.items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Building2 className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-gray-500">No items added yet</p>
                            <p className="text-sm text-gray-400">
                              Click "Add Item" to start building your estimate
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Material Summary</CardTitle>
                  <CardDescription>
                    Total material requirements for the project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Cement</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {totals.cement.toFixed(2)}
                      </p>
                      <p className="text-sm text-blue-600">bags</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <p className="text-sm text-amber-600">Sand</p>
                      <p className="text-2xl font-bold text-amber-900">
                        {totals.sand.toFixed(2)}
                      </p>
                      <p className="text-sm text-amber-600">cft</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Stone Chips</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totals.stoneChips.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">cft</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Steel</p>
                      <p className="text-2xl font-bold text-green-900">
                        {totals.reinforcement.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-600">kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>
                    Estimated costs by material type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>
                        Cement ({totals.cement.toFixed(1)} bags @ ৳450)
                      </span>
                      <span className="font-medium">
                        ৳{(totals.cement * 450).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sand ({totals.sand.toFixed(1)} cft @ ৳45)</span>
                      <span className="font-medium">
                        ৳{(totals.sand * 45).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Stone Chips ({totals.stoneChips.toFixed(1)} cft @ ৳55)
                      </span>
                      <span className="font-medium">
                        ৳{(totals.stoneChips * 55).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Steel ({totals.reinforcement.toFixed(1)} kg @ ৳75)
                      </span>
                      <span className="font-medium">
                        ৳{(totals.reinforcement * 75).toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Project Cost</span>
                      <span className="text-brand-600">
                        ���{totals.totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Estimate Report</CardTitle>
                <CardDescription>
                  Comprehensive breakdown of all project items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentProject.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {item.itemId} - {item.description}
                          </h4>
                          <p className="text-gray-600 capitalize">
                            {item.type} Work
                          </p>
                        </div>
                        <Badge variant="outline">{item.itemId}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-2">
                            Dimensions & Specifications
                          </h5>
                          <div className="text-sm space-y-1">
                            {Object.entries(item.dimensions).map(
                              ([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="capitalize text-gray-600">
                                    {key.replace(/([A-Z])/g, " $1")}:
                                  </span>
                                  <span>
                                    {value}{" "}
                                    {key.includes("diameter") ||
                                    key.includes("width") ||
                                    key.includes("length")
                                      ? key.includes("diameter") ||
                                        (key.includes("width") &&
                                          item.type !== "foundation")
                                        ? '"'
                                        : "'"
                                      : key === "quantity" ||
                                          key === "reinforcementCount"
                                        ? "nos"
                                        : ""}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">
                            Material Requirements
                          </h5>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Concrete Volume:
                              </span>
                              <span>{item.results.volume} cft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cement:</span>
                              <span>{item.results.cement} bags</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Sand:</span>
                              <span>{item.results.sand} cft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Stone Chips:
                              </span>
                              <span>{item.results.stoneChips} cft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Steel:</span>
                              <span>{item.results.reinforcement} kg</span>
                            </div>
                            <div className="flex justify-between font-medium pt-2 border-t">
                              <span>Item Cost:</span>
                              <span className="text-brand-600">
                                ৳{item.results.totalCost.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
