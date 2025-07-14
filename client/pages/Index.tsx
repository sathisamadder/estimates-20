import { useState } from "react";
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
  Calculator,
  Building2,
  FileText,
  History,
  Settings,
  Hammer,
  Ruler,
  DollarSign,
} from "lucide-react";

interface CalculationResult {
  cement: number;
  sand: number;
  stoneChips: number;
  reinforcement: number;
  totalCost: number;
  volume: number;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("pile");
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);

  // Pile Work Calculation
  const [pileData, setPileData] = useState({
    diameter: "",
    length: "",
    quantity: "",
    reinforcementCount: "7",
  });

  // Foundation Calculation
  const [foundationData, setFoundationData] = useState({
    length: "",
    width: "",
    height: "",
    type: "mat",
  });

  // Beam Calculation
  const [beamData, setBeamData] = useState({
    length: "",
    width: "",
    height: "",
    reinforcementCount: "5",
  });

  // Column Calculation
  const [columnData, setColumnData] = useState({
    length: "",
    width: "",
    height: "",
    reinforcementCount: "6",
  });

  const calculatePile = () => {
    const diameter = parseFloat(pileData.diameter);
    const length = parseFloat(pileData.length);
    const quantity = parseFloat(pileData.quantity);
    const reinforcementCount = parseFloat(pileData.reinforcementCount);

    if (!diameter || !length || !quantity) return;

    // Convert diameter from inches to feet
    const diameterFt = diameter / 12;

    // Calculate volume (πD²h/4)
    const volume =
      ((Math.PI * Math.pow(diameterFt, 2) * length) / 4) * quantity;
    const dryVolume = volume * 1.5;

    // Concrete ratio 1:1.5:3 (Cement:Sand:Stone)
    const totalRatio = 1 + 1.5 + 3;
    const cement = ((dryVolume * 1) / totalRatio) * 1.25; // bags
    const sand = (dryVolume * 1.5) / totalRatio; // cft
    const stoneChips = (dryVolume * 3) / totalRatio; // cft

    // Reinforcement calculation
    const reinforcementLength = length + 2.5; // with lap length
    const reinforcement =
      reinforcementCount * reinforcementLength * 0.75 * quantity; // kg

    // Cost estimation (sample rates)
    const cementRate = 450; // per bag
    const sandRate = 45; // per cft
    const stoneRate = 55; // per cft
    const reinforcementRate = 75; // per kg

    const totalCost =
      cement * cementRate +
      sand * sandRate +
      stoneChips * stoneRate +
      reinforcement * reinforcementRate;

    const result: CalculationResult = {
      cement: Math.round(cement * 100) / 100,
      sand: Math.round(sand * 100) / 100,
      stoneChips: Math.round(stoneChips * 100) / 100,
      reinforcement: Math.round(reinforcement * 100) / 100,
      volume: Math.round(volume * 100) / 100,
      totalCost: Math.round(totalCost),
    };

    setResults(result);
  };

  const calculateFoundation = () => {
    const length = parseFloat(foundationData.length);
    const width = parseFloat(foundationData.width);
    const height = parseFloat(foundationData.height);

    if (!length || !width || !height) return;

    const volume = length * width * height;
    const dryVolume = volume * 1.5;

    // Concrete ratio 1:1.5:3
    const totalRatio = 5.5;
    const cement = ((dryVolume * 1) / totalRatio) * 1.25;
    const sand = (dryVolume * 1.5) / totalRatio;
    const stoneChips = (dryVolume * 3) / totalRatio;

    // Reinforcement estimation
    const reinforcement = volume * 80; // kg per cubic foot

    const cementRate = 450;
    const sandRate = 45;
    const stoneRate = 55;
    const reinforcementRate = 75;

    const totalCost =
      cement * cementRate +
      sand * sandRate +
      stoneChips * stoneRate +
      reinforcement * reinforcementRate;

    const result: CalculationResult = {
      cement: Math.round(cement * 100) / 100,
      sand: Math.round(sand * 100) / 100,
      stoneChips: Math.round(stoneChips * 100) / 100,
      reinforcement: Math.round(reinforcement * 100) / 100,
      volume: Math.round(volume * 100) / 100,
      totalCost: Math.round(totalCost),
    };

    setResults(result);
  };

  const calculateBeam = () => {
    const length = parseFloat(beamData.length);
    const width = parseFloat(beamData.width) / 12; // convert inches to feet
    const height = parseFloat(beamData.height) / 12; // convert inches to feet
    const reinforcementCount = parseFloat(beamData.reinforcementCount);

    if (!length || !width || !height) return;

    const volume = length * width * height;
    const dryVolume = volume * 1.5;

    // Concrete ratio 1:2:4 for beams
    const totalRatio = 7;
    const cement = ((dryVolume * 1) / totalRatio) * 1.25;
    const sand = (dryVolume * 2) / totalRatio;
    const stoneChips = (dryVolume * 4) / totalRatio;

    // Reinforcement calculation
    const reinforcement = reinforcementCount * length * 0.48; // kg

    const cementRate = 450;
    const sandRate = 45;
    const stoneRate = 55;
    const reinforcementRate = 75;

    const totalCost =
      cement * cementRate +
      sand * sandRate +
      stoneChips * stoneRate +
      reinforcement * reinforcementRate;

    const result: CalculationResult = {
      cement: Math.round(cement * 100) / 100,
      sand: Math.round(sand * 100) / 100,
      stoneChips: Math.round(stoneChips * 100) / 100,
      reinforcement: Math.round(reinforcement * 100) / 100,
      volume: Math.round(volume * 100) / 100,
      totalCost: Math.round(totalCost),
    };

    setResults(result);
  };

  const calculateColumn = () => {
    const length = parseFloat(columnData.length) / 12; // convert inches to feet
    const width = parseFloat(columnData.width) / 12; // convert inches to feet
    const height = parseFloat(columnData.height);
    const reinforcementCount = parseFloat(columnData.reinforcementCount);

    if (!length || !width || !height) return;

    const volume = length * width * height;
    const dryVolume = volume * 1.5;

    // Concrete ratio 1:1.5:3
    const totalRatio = 5.5;
    const cement = ((dryVolume * 1) / totalRatio) * 1.25;
    const sand = (dryVolume * 1.5) / totalRatio;
    const stoneChips = (dryVolume * 3) / totalRatio;

    // Reinforcement calculation
    const reinforcement = reinforcementCount * (height + 2.5) * 0.75; // kg

    const cementRate = 450;
    const sandRate = 45;
    const stoneRate = 55;
    const reinforcementRate = 75;

    const totalCost =
      cement * cementRate +
      sand * sandRate +
      stoneChips * stoneRate +
      reinforcement * reinforcementRate;

    const result: CalculationResult = {
      cement: Math.round(cement * 100) / 100,
      sand: Math.round(sand * 100) / 100,
      stoneChips: Math.round(stoneChips * 100) / 100,
      reinforcement: Math.round(reinforcement * 100) / 100,
      volume: Math.round(volume * 100) / 100,
      totalCost: Math.round(totalCost),
    };

    setResults(result);
  };

  const saveCalculation = () => {
    if (!results) return;

    const calculation = {
      id: Date.now(),
      type: activeTab,
      data:
        activeTab === "pile"
          ? pileData
          : activeTab === "foundation"
            ? foundationData
            : activeTab === "beam"
              ? beamData
              : columnData,
      results,
      date: new Date().toLocaleDateString(),
    };

    setSavedCalculations([calculation, ...savedCalculations]);
  };

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
                  Construction Cost Calculator
                </h1>
                <p className="text-sm text-gray-600">
                  Personal Estimation Tool
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {savedCalculations.length} Saved
              </Badge>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Ruler className="h-5 w-5" />
                  <span>Project Calculator</span>
                </CardTitle>
                <CardDescription>
                  Enter dimensions and specifications for your construction
                  project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="pile">Pile Work</TabsTrigger>
                    <TabsTrigger value="foundation">Foundation</TabsTrigger>
                    <TabsTrigger value="beam">Beam Work</TabsTrigger>
                    <TabsTrigger value="column">Column</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pile" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pile-diameter">
                          Pile Diameter (inches)
                        </Label>
                        <Input
                          id="pile-diameter"
                          placeholder="e.g., 20"
                          value={pileData.diameter}
                          onChange={(e) =>
                            setPileData({
                              ...pileData,
                              diameter: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="pile-length">Pile Length (feet)</Label>
                        <Input
                          id="pile-length"
                          placeholder="e.g., 60"
                          value={pileData.length}
                          onChange={(e) =>
                            setPileData({ ...pileData, length: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="pile-quantity">Number of Piles</Label>
                        <Input
                          id="pile-quantity"
                          placeholder="e.g., 7"
                          value={pileData.quantity}
                          onChange={(e) =>
                            setPileData({
                              ...pileData,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="pile-rein">Reinforcement Bars</Label>
                        <Select
                          value={pileData.reinforcementCount}
                          onValueChange={(value) =>
                            setPileData({
                              ...pileData,
                              reinforcementCount: value,
                            })
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
                    <Button
                      onClick={calculatePile}
                      className="w-full bg-brand-500 hover:bg-brand-600"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Pile Work
                    </Button>
                  </TabsContent>

                  <TabsContent value="foundation" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="foundation-length">Length (feet)</Label>
                        <Input
                          id="foundation-length"
                          placeholder="e.g., 100"
                          value={foundationData.length}
                          onChange={(e) =>
                            setFoundationData({
                              ...foundationData,
                              length: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="foundation-width">Width (feet)</Label>
                        <Input
                          id="foundation-width"
                          placeholder="e.g., 46.5"
                          value={foundationData.width}
                          onChange={(e) =>
                            setFoundationData({
                              ...foundationData,
                              width: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="foundation-height">Height (feet)</Label>
                        <Input
                          id="foundation-height"
                          placeholder="e.g., 1.5"
                          value={foundationData.height}
                          onChange={(e) =>
                            setFoundationData({
                              ...foundationData,
                              height: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="foundation-type">Foundation Type</Label>
                        <Select
                          value={foundationData.type}
                          onValueChange={(value) =>
                            setFoundationData({
                              ...foundationData,
                              type: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mat">Mat Foundation</SelectItem>
                            <SelectItem value="pile-cap">Pile Cap</SelectItem>
                            <SelectItem value="footing">
                              Isolated Footing
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      onClick={calculateFoundation}
                      className="w-full bg-brand-500 hover:bg-brand-600"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Foundation
                    </Button>
                  </TabsContent>

                  <TabsContent value="beam" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="beam-length">Length (feet)</Label>
                        <Input
                          id="beam-length"
                          placeholder="e.g., 28"
                          value={beamData.length}
                          onChange={(e) =>
                            setBeamData({ ...beamData, length: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="beam-width">Width (inches)</Label>
                        <Input
                          id="beam-width"
                          placeholder="e.g., 10"
                          value={beamData.width}
                          onChange={(e) =>
                            setBeamData({ ...beamData, width: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="beam-height">Height (inches)</Label>
                        <Input
                          id="beam-height"
                          placeholder="e.g., 18"
                          value={beamData.height}
                          onChange={(e) =>
                            setBeamData({ ...beamData, height: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="beam-rein">Main Reinforcement</Label>
                        <Select
                          value={beamData.reinforcementCount}
                          onValueChange={(value) =>
                            setBeamData({
                              ...beamData,
                              reinforcementCount: value,
                            })
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
                    <Button
                      onClick={calculateBeam}
                      className="w-full bg-brand-500 hover:bg-brand-600"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Beam Work
                    </Button>
                  </TabsContent>

                  <TabsContent value="column" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="column-length">Length (inches)</Label>
                        <Input
                          id="column-length"
                          placeholder="e.g., 12"
                          value={columnData.length}
                          onChange={(e) =>
                            setColumnData({
                              ...columnData,
                              length: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="column-width">Width (inches)</Label>
                        <Input
                          id="column-width"
                          placeholder="e.g., 15"
                          value={columnData.width}
                          onChange={(e) =>
                            setColumnData({
                              ...columnData,
                              width: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="column-height">Height (feet)</Label>
                        <Input
                          id="column-height"
                          placeholder="e.g., 10"
                          value={columnData.height}
                          onChange={(e) =>
                            setColumnData({
                              ...columnData,
                              height: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="column-rein">Main Reinforcement</Label>
                        <Select
                          value={columnData.reinforcementCount}
                          onValueChange={(value) =>
                            setColumnData({
                              ...columnData,
                              reinforcementCount: value,
                            })
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
                    <Button
                      onClick={calculateColumn}
                      className="w-full bg-brand-500 hover:bg-brand-600"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Column Work
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Calculation Results</span>
                </CardTitle>
                <CardDescription>
                  Material quantities and cost estimation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Volume:</span>
                          <span className="font-medium">
                            {results.volume} cft
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cement:</span>
                          <span className="font-medium">
                            {results.cement} bags
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sand:</span>
                          <span className="font-medium">
                            {results.sand} cft
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stone Chips:</span>
                          <span className="font-medium">
                            {results.stoneChips} cft
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Steel:</span>
                          <span className="font-medium">
                            {results.reinforcement} kg
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-brand-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          Total Cost:
                        </span>
                        <span className="text-2xl font-bold text-brand-600">
                          ৳{results.totalCost.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={saveCalculation}
                      variant="outline"
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Save Calculation
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Enter dimensions and click calculate to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Calculations */}
            {savedCalculations.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="h-5 w-5" />
                    <span>Recent Calculations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {savedCalculations.slice(0, 3).map((calc) => (
                      <div key={calc.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="outline" className="text-xs mb-1">
                              {calc.type}
                            </Badge>
                            <p className="text-sm font-medium">
                              ৳{calc.results.totalCost.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">{calc.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
