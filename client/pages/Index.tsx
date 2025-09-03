import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDataManager } from "@/hooks/use-data-manager";
import { useAuth } from "@/contexts/AuthContext";
import { MobileLayout } from "@/components/MobileLayout";
import { MobileTable } from "@/components/MobileTable";
import { ConstructionCalculator } from "@/components/ConstructionCalculator";
import { constructionTypes, categories } from "@/data/construction-types";
import { ConstructionItem, MaterialRates } from "@/types/construction";
import {
  Plus,
  Calculator,
  Building2,
  BarChart3,
  FileText,
  PieChart,
  Settings,
  Download,
  Printer,
  Save,
  User,
  LogOut,
  Search,
  Filter,
  TrendingUp,
  Activity,
  DollarSign,
  Package,
} from "lucide-react";

export default function Index() {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const {
    projects,
    currentProjectId,
    createProject,
    updateProject,
    setCurrentProjectId,
  } = useDataManager();

  // State management
  const [activeTab, setActiveTab] = useState("items");
  const [items, setItems] = useState<ConstructionItem[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [editingItem, setEditingItem] = useState<ConstructionItem | undefined>();
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
  // Material rates
  const [materialRates, setMaterialRates] = useState<MaterialRates>({
    cement: 450,
    sand: 45,
    stoneChips: 55,
    reinforcement: 75,
    brick: 12,
    labor: 300,
  });

  // Project management
  const currentProject = currentProjectId ? projects.find(p => p.id === currentProjectId) : null;
  const projectName = currentProject?.name || "New Construction Project";

  // Load project data
  useEffect(() => {
    if (currentProject) {
      setItems(currentProject.items || []);
      if (currentProject.customRates) {
        setMaterialRates(currentProject.customRates);
      }
    } else {
      // Create default project if none exists
      createProject({
        name: "Construction Project",
        description: "Professional construction estimation",
        client: "Default Client",
        location: "Dhaka, Bangladesh",
        items: [],
        totalBudget: 0,
      }).then((project) => {
        setCurrentProjectId(project.id);
      });
    }
  }, [currentProject, createProject, setCurrentProjectId]);

  // Save project data
  const saveProject = () => {
    if (currentProjectId) {
      const totalBudget = items.reduce((sum, item) => sum + item.totalCost, 0);
      updateProject(currentProjectId, {
        items,
        totalBudget,
        customRates: materialRates,
        updatedAt: new Date().toISOString(),
      });
      
      toast({
        title: "Project Saved",
        description: "Your construction project has been saved successfully.",
      });
    }
  };

  // Add new item
  const handleAddItem = (itemData: Omit<ConstructionItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: ConstructionItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems(prev => [...prev, newItem]);
    setShowCalculator(false);
    setEditingItem(undefined);
    
    toast({
      title: "Item Added",
      description: `${newItem.type} has been added to your project.`,
    });
  };

  // Edit item
  const handleEditItem = (item: ConstructionItem) => {
    setEditingItem(item);
    setSelectedType(constructionTypes.find(t => t.name === item.type)?.id || "");
    setShowCalculator(true);
  };

  // Update item
  const handleUpdateItem = (itemData: Omit<ConstructionItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingItem) return;

    const updatedItem: ConstructionItem = {
      ...itemData,
      id: editingItem.id,
      createdAt: editingItem.createdAt,
      updatedAt: new Date().toISOString(),
    };

    setItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
    setShowCalculator(false);
    setEditingItem(undefined);
    
    toast({
      title: "Item Updated",
      description: `${updatedItem.type} has been updated successfully.`,
    });
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Deleted",
      description: "Construction item has been removed from your project.",
    });
  };

  // Duplicate item
  const handleDuplicateItem = (item: ConstructionItem) => {
    const duplicatedItem: ConstructionItem = {
      ...item,
      id: Date.now().toString(),
      itemId: `${item.itemId}-COPY`,
      description: `${item.description} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems(prev => [...prev, duplicatedItem]);
    toast({
      title: "Item Duplicated",
      description: `${item.type} has been duplicated successfully.`,
    });
  };

  // Format currency
  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals
  const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);
  const totalVolume = items.reduce((sum, item) => sum + item.volume, 0);
  const totalReinforcement = items.reduce((sum, item) => sum + item.reinforcement, 0);

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Export functions
  const handleExport = () => {
    const data = {
      project: currentProject,
      items,
      totals: { totalCost, totalVolume, totalReinforcement },
      materialRates,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_estimate.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Project data has been exported successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Ready",
      description: "Print dialog has been opened.",
    });
  };

  // Mobile layout wrapper
  if (isMobile) {
    return (
      <MobileLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddItem={() => setShowCalculator(true)}
        onOpenPricing={() => setShowPricingDialog(true)}
        onSave={saveProject}
        onExport={handleExport}
        onPrint={handlePrint}
        projectName={projectName}
        totalCost={formatBDT(totalCost)}
        itemCount={items.length}
      >
        <div className="p-4 space-y-4">
          {activeTab === "items" && (
            <>
              {/* Search and Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 text-gray-900"
                  />
                </div>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="bg-white/80 text-gray-900">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Items Table */}
              <MobileTable
                items={filteredItems.map(item => ({
                  ...item,
                  icon: constructionTypes.find(t => t.name === item.type)?.icon || Building2,
                  color: constructionTypes.find(t => t.name === item.type)?.color || "text-gray-600",
                  bgColor: constructionTypes.find(t => t.name === item.type)?.bgColor || "bg-gray-100",
                  unit: item.brickQuantity ? "nos" : item.plasterArea ? "sft" : "cft"
                }))}
                onEdit={handleEditItem}
                onDuplicate={handleDuplicateItem}
                onDelete={handleDeleteItem}
                formatBDT={formatBDT}
              />
            </>
          )}

          {activeTab === "summary" && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass border-white/20 bg-white/10 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-5 w-5 text-brand-300" />
                      <span className="text-sm text-white/80">Total Cost</span>
                    </div>
                    <p className="text-xl font-bold text-brand-200">
                      {formatBDT(totalCost)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20 bg-white/10 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="h-5 w-5 text-blue-300" />
                      <span className="text-sm text-white/80">Items</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {items.length}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20 bg-white/10 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-5 w-5 text-green-300" />
                      <span className="text-sm text-white/80">Steel</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {totalReinforcement.toFixed(1)} kg
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20 bg-white/10 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-300" />
                      <span className="text-sm text-white/80">Volume</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {totalVolume.toFixed(1)} cft
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Category Breakdown */}
              <Card className="glass border-white/20 bg-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-white">Cost by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map(category => {
                      const categoryItems = items.filter(item => item.category === category);
                      const categoryTotal = categoryItems.reduce((sum, item) => sum + item.totalCost, 0);
                      const percentage = totalCost > 0 ? (categoryTotal / totalCost) * 100 : 0;
                      
                      if (categoryItems.length === 0) return null;
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white/90">{category}</span>
                            <span className="font-medium text-white">{formatBDT(categoryTotal)}</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                              className="bg-brand-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-white/70">
                            <span>{categoryItems.length} items</span>
                            <span>{percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "details" && (
            <Card className="glass border-white/20 bg-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-white">Detailed Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Project Information */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Project Information</h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Project Name:</span>
                        <span className="text-white">{projectName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Client:</span>
                        <span className="text-white">{currentProject?.client || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Location:</span>
                        <span className="text-white">{currentProject?.location || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Total Items:</span>
                        <span className="text-white">{items.length}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/20" />

                  {/* Material Summary */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Material Summary</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Cement", value: items.reduce((sum, item) => sum + (item.cement || 0), 0), unit: "bags", rate: materialRates.cement },
                        { name: "Sand", value: items.reduce((sum, item) => sum + (item.sand || 0), 0), unit: "cft", rate: materialRates.sand },
                        { name: "Stone Chips", value: items.reduce((sum, item) => sum + (item.stoneChips || 0), 0), unit: "cft", rate: materialRates.stoneChips },
                        { name: "Steel", value: totalReinforcement, unit: "kg", rate: materialRates.reinforcement },
                        { name: "Bricks", value: items.reduce((sum, item) => sum + (item.brickQuantity || 0), 0), unit: "nos", rate: materialRates.brick },
                      ].map(material => (
                        material.value > 0 && (
                          <div key={material.name} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{material.name}</p>
                              <p className="text-xs text-white/70">{material.value.toFixed(1)} {material.unit}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">{formatBDT(material.value * material.rate)}</p>
                              <p className="text-xs text-white/70">@ {formatBDT(material.rate)}/{material.unit}</p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-4">
              <Card className="glass border-white/20 bg-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-white">Project Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Cost Distribution */}
                    <div>
                      <h4 className="font-medium text-white mb-3">Cost Distribution</h4>
                      <div className="space-y-2">
                        {[
                          { name: "Materials", value: items.reduce((sum, item) => sum + (item.cement || 0) * materialRates.cement + (item.sand || 0) * materialRates.sand + (item.stoneChips || 0) * materialRates.stoneChips + item.reinforcement * materialRates.reinforcement, 0) },
                          { name: "Labor", value: items.reduce((sum, item) => sum + (item.volume * materialRates.labor), 0) },
                        ].map(cost => {
                          const percentage = totalCost > 0 ? (cost.value / totalCost) * 100 : 0;
                          return (
                            <div key={cost.name} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/80">{cost.name}</span>
                                <span className="text-white">{formatBDT(cost.value)} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                  className="bg-brand-400 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Item Statistics */}
                    <div>
                      <h4 className="font-medium text-white mb-3">Item Statistics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-white/70">Most Expensive</p>
                          <p className="font-medium text-white">
                            {items.length > 0 ? items.reduce((max, item) => item.totalCost > max.totalCost ? item : max).type : "N/A"}
                          </p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-white/70">Avg. Cost/Item</p>
                          <p className="font-medium text-white">
                            {items.length > 0 ? formatBDT(totalCost / items.length) : formatBDT(0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Calculator Dialog */}
        {showCalculator && (
          <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
            <DialogContent className="max-w-full h-full m-0 p-0 bg-transparent border-0">
              <div className="h-full overflow-y-auto">
                {selectedType ? (
                  <ConstructionCalculator
                    type={constructionTypes.find(t => t.id === selectedType)!}
                    onSave={editingItem ? handleUpdateItem : handleAddItem}
                    onCancel={() => {
                      setShowCalculator(false);
                      setEditingItem(undefined);
                    }}
                    materialRates={materialRates}
                    editingItem={editingItem}
                  />
                ) : (
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-white mb-4">Select Construction Type</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {constructionTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <Button
                            key={type.id}
                            variant="outline"
                            className="h-auto p-4 justify-start glass border-white/20 text-white hover:bg-white/10"
                            onClick={() => setSelectedType(type.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${type.bgColor}`}>
                                <IconComponent className={`h-5 w-5 ${type.color}`} />
                              </div>
                              <div className="text-left">
                                <p className="font-medium">{type.name}</p>
                                <p className="text-sm text-white/70">{type.category}</p>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Pricing Dialog */}
        <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
          <DialogContent className="max-w-md glass border-white/20 bg-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Material Pricing</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {Object.entries(materialRates).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-white/90 capitalize">
                    {key} ({key === 'cement' ? 'BDT/bag' : key === 'brick' ? 'BDT/pc' : 'BDT/kg'})
                  </Label>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => setMaterialRates(prev => ({
                      ...prev,
                      [key]: parseFloat(e.target.value) || 0
                    }))}
                    className="bg-white/80 text-gray-900"
                  />
                </div>
              ))}
              <Button
                onClick={() => {
                  setShowPricingDialog(false);
                  toast({
                    title: "Pricing Updated",
                    description: "Material rates have been updated successfully.",
                  });
                }}
                className="w-full bg-brand-500 hover:bg-brand-600"
              >
                Save Pricing
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </MobileLayout>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen gpt-background relative">
      <div className="liquid-layer">
        <div className="liquid-blob blob1"></div>
        <div className="liquid-blob blob2"></div>
        <div className="liquid-blob blob3"></div>
      </div>

      {/* Desktop Header */}
      <header className="sticky top-0 z-50 border-b glass-light shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F60f84872b4b14093aa9e83d9ad74d969%2F46361fbad51e408b89450daa00371588"
                  alt="ROY Logo"
                  className="w-8 h-8 object-contain bg-transparent"
                  style={{ background: "transparent", backdropFilter: "none" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <Calculator className="h-7 w-7 text-white hidden" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
                <p className="text-sm text-gray-600">
                  {items.length} items • {formatBDT(totalCost)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPricingDialog(true)}
                className="border-gray-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Pricing
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={saveProject}
                className="border-gray-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>

              <Button
                size="sm"
                onClick={() => setShowCalculator(true)}
                className="bg-brand-500 hover:bg-brand-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>

              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-4 w-4" />
                <span className="text-sm">{currentUser?.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Content */}
      <main className="container mx-auto px-6 py-6 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass-light">
            <TabsTrigger value="items" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Project Items</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Cost Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Detailed Report</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search construction items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Items Table */}
            <Card className="glass-light">
              <CardContent className="p-0">
                <MobileTable
                  items={filteredItems.map(item => ({
                    ...item,
                    icon: constructionTypes.find(t => t.name === item.type)?.icon || Building2,
                    color: constructionTypes.find(t => t.name === item.type)?.color || "text-gray-600",
                    bgColor: constructionTypes.find(t => t.name === item.type)?.bgColor || "bg-gray-100",
                    unit: item.brickQuantity ? "nos" : item.plasterArea ? "sft" : "cft"
                  }))}
                  onEdit={handleEditItem}
                  onDuplicate={handleDuplicateItem}
                  onDelete={handleDeleteItem}
                  formatBDT={formatBDT}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            {/* Summary content - same as mobile but with desktop styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-light">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-brand-500" />
                    <span className="text-sm text-gray-600">Total Cost</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatBDT(totalCost)}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-light">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Total Items</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {items.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-light">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Total Steel</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalReinforcement.toFixed(1)} kg
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-light">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <span className="text-sm text-gray-600">Total Volume</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalVolume.toFixed(1)} cft
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Category breakdown and other summary content */}
            <Card className="glass-light">
              <CardHeader>
                <CardTitle>Cost Breakdown by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map(category => {
                    const categoryItems = items.filter(item => item.category === category);
                    const categoryTotal = categoryItems.reduce((sum, item) => sum + item.totalCost, 0);
                    const percentage = totalCost > 0 ? (categoryTotal / totalCost) * 100 : 0;
                    
                    if (categoryItems.length === 0) return null;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{category}</span>
                          <span className="font-bold text-gray-900">{formatBDT(categoryTotal)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-brand-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{categoryItems.length} items</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            {/* Detailed report content */}
            <Card className="glass-light">
              <CardHeader>
                <CardTitle>Detailed Project Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Project info, material summary, etc. - same structure as mobile */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Project Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Project Name:</span>
                        <span className="text-gray-900 font-medium">{projectName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client:</span>
                        <span className="text-gray-900 font-medium">{currentProject?.client || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-900 font-medium">{currentProject?.location || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="text-gray-900 font-medium">{items.length}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Material Summary */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Material Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "Cement", value: items.reduce((sum, item) => sum + (item.cement || 0), 0), unit: "bags", rate: materialRates.cement },
                        { name: "Sand", value: items.reduce((sum, item) => sum + (item.sand || 0), 0), unit: "cft", rate: materialRates.sand },
                        { name: "Stone Chips", value: items.reduce((sum, item) => sum + (item.stoneChips || 0), 0), unit: "cft", rate: materialRates.stoneChips },
                        { name: "Steel", value: totalReinforcement, unit: "kg", rate: materialRates.reinforcement },
                        { name: "Bricks", value: items.reduce((sum, item) => sum + (item.brickQuantity || 0), 0), unit: "nos", rate: materialRates.brick },
                      ].map(material => (
                        material.value > 0 && (
                          <div key={material.name} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{material.name}</p>
                              <p className="text-sm text-gray-600">{material.value.toFixed(1)} {material.unit}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{formatBDT(material.value * material.rate)}</p>
                              <p className="text-xs text-gray-600">@ {formatBDT(material.rate)}/{material.unit}</p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            {/* Analytics content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-light">
                <CardHeader>
                  <CardTitle>Cost Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Materials", value: items.reduce((sum, item) => sum + (item.cement || 0) * materialRates.cement + (item.sand || 0) * materialRates.sand + (item.stoneChips || 0) * materialRates.stoneChips + item.reinforcement * materialRates.reinforcement, 0) },
                      { name: "Labor", value: items.reduce((sum, item) => sum + (item.volume * materialRates.labor), 0) },
                    ].map(cost => {
                      const percentage = totalCost > 0 ? (cost.value / totalCost) * 100 : 0;
                      return (
                        <div key={cost.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{cost.name}</span>
                            <span className="font-medium text-gray-900">{formatBDT(cost.value)} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-brand-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-light">
                <CardHeader>
                  <CardTitle>Project Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Most Expensive Item</p>
                        <p className="font-medium text-gray-900">
                          {items.length > 0 ? items.reduce((max, item) => item.totalCost > max.totalCost ? item : max).type : "N/A"}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Average Cost per Item</p>
                        <p className="font-medium text-gray-900">
                          {items.length > 0 ? formatBDT(totalCost / items.length) : formatBDT(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-transparent border-0 p-0">
          {selectedType ? (
            <ConstructionCalculator
              type={constructionTypes.find(t => t.id === selectedType)!}
              onSave={editingItem ? handleUpdateItem : handleAddItem}
              onCancel={() => {
                setShowCalculator(false);
                setEditingItem(undefined);
                setSelectedType("");
              }}
              materialRates={materialRates}
              editingItem={editingItem}
            />
          ) : (
            <Card className="glass border-white/20 bg-white/10 text-white m-6">
              <CardHeader>
                <CardTitle className="text-white">Select Construction Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {constructionTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <Button
                        key={type.id}
                        variant="outline"
                        className="h-auto p-6 justify-start glass border-white/20 text-white hover:bg-white/10"
                        onClick={() => setSelectedType(type.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${type.bgColor}`}>
                            <IconComponent className={`h-6 w-6 ${type.color}`} />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-lg">{type.name}</p>
                            <p className="text-sm text-white/70">{type.category}</p>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* Pricing Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="max-w-md glass-light">
          <DialogHeader>
            <DialogTitle>Material Pricing Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(materialRates).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">
                  {key} ({key === 'cement' ? 'BDT/bag' : key === 'brick' ? 'BDT/pc' : key === 'reinforcement' ? 'BDT/kg' : 'BDT/cft'})
                </Label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setMaterialRates(prev => ({
                    ...prev,
                    [key]: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
            ))}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={() => {
                  setShowPricingDialog(false);
                  toast({
                    title: "Pricing Updated",
                    description: "Material rates have been updated successfully.",
                  });
                }}
                className="flex-1 bg-brand-500 hover:bg-brand-600"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPricingDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}