import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConstructionItem, ConstructionType, MaterialRates } from "@/types/construction";
import { Calculator, X, Info, Hash, Ruler, Weight } from "lucide-react";

interface ConstructionCalculatorProps {
  type: ConstructionType;
  onSave: (item: Omit<ConstructionItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  materialRates: MaterialRates;
  editingItem?: ConstructionItem;
}

export function ConstructionCalculator({
  type,
  onSave,
  onCancel,
  materialRates,
  editingItem
}: ConstructionCalculatorProps) {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState(() => {
    if (editingItem) {
      return {
        ...editingItem,
        isMultiple: editingItem.isMultiple || false,
        quantity: editingItem.quantity || 1
      };
    }
    
    // Initialize with default values
    const initialData: any = {
      isMultiple: false,
      quantity: 1
    };
    
    type.fields.forEach(field => {
      if (field.type === 'select' && field.options) {
        initialData[field.name] = field.options[0].value;
      } else {
        initialData[field.name] = parseFloat(field.placeholder || "0");
      }
    });
    
    return initialData;
  });

  const [calculations, setCalculations] = useState({
    volume: 0,
    reinforcement: 0,
    cement: 0,
    sand: 0,
    stoneChips: 0,
    labor: 0,
    totalCost: 0
  });

  // Calculate values based on formulas
  const calculateValues = () => {
    try {
      const vars = { ...formData };
      
      // Helper function to evaluate formula
      const evaluate = (formula: string): number => {
        let expr = formula;
        
        // Replace variables with values
        Object.keys(vars).forEach(key => {
          const regex = new RegExp(`\\b${key}\\b`, 'g');
          expr = expr.replace(regex, vars[key].toString());
        });
        
        // Replace mathematical constants
        expr = expr.replace(/3\.14159/g, Math.PI.toString());
        
        // Evaluate the expression safely
        try {
          return Function(`"use strict"; return (${expr})`)();
        } catch {
          return 0;
        }
      };

      const volume = evaluate(type.calculations.volume);
      const reinforcement = evaluate(type.calculations.reinforcement);
      const cement = evaluate(type.calculations.cement);
      const sand = evaluate(type.calculations.sand);
      const stoneChips = evaluate(type.calculations.stoneChips);
      const labor = evaluate(type.calculations.labor);

      // Apply quantity multiplier
      const multiplier = formData.isMultiple ? formData.quantity : 1;
      
      const finalVolume = volume * multiplier;
      const finalReinforcement = reinforcement * multiplier;
      const finalCement = cement * multiplier;
      const finalSand = sand * multiplier;
      const finalStoneChips = stoneChips * multiplier;
      const finalLabor = labor * multiplier;

      // Calculate total cost
      const totalCost = 
        (finalCement * materialRates.cement) +
        (finalSand * materialRates.sand) +
        (finalStoneChips * materialRates.stoneChips) +
        (finalReinforcement * materialRates.reinforcement) +
        (finalLabor * materialRates.labor);

      const newCalculations = {
        volume: finalVolume,
        reinforcement: finalReinforcement,
        cement: finalCement,
        sand: finalSand,
        stoneChips: finalStoneChips,
        labor: finalLabor,
        totalCost
      };

      setCalculations(newCalculations);
      return newCalculations;
    } catch (error) {
      console.error('Calculation error:', error);
      return calculations;
    }
  };

  // Update calculations when form data changes
  useState(() => {
    calculateValues();
  });

  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Recalculate immediately
    setTimeout(() => {
      const vars = { ...newFormData };
      
      const evaluate = (formula: string): number => {
        let expr = formula;
        Object.keys(vars).forEach(key => {
          const regex = new RegExp(`\\b${key}\\b`, 'g');
          expr = expr.replace(regex, vars[key].toString());
        });
        expr = expr.replace(/3\.14159/g, Math.PI.toString());
        try {
          return Function(`"use strict"; return (${expr})`)();
        } catch {
          return 0;
        }
      };

      const volume = evaluate(type.calculations.volume);
      const reinforcement = evaluate(type.calculations.reinforcement);
      const cement = evaluate(type.calculations.cement);
      const sand = evaluate(type.calculations.sand);
      const stoneChips = evaluate(type.calculations.stoneChips);
      const labor = evaluate(type.calculations.labor);

      const multiplier = newFormData.isMultiple ? newFormData.quantity : 1;
      
      const finalVolume = volume * multiplier;
      const finalReinforcement = reinforcement * multiplier;
      const finalCement = cement * multiplier;
      const finalSand = sand * multiplier;
      const finalStoneChips = stoneChips * multiplier;
      const finalLabor = labor * multiplier;

      const totalCost = 
        (finalCement * materialRates.cement) +
        (finalSand * materialRates.sand) +
        (finalStoneChips * materialRates.stoneChips) +
        (finalReinforcement * materialRates.reinforcement) +
        (finalLabor * materialRates.labor);

      setCalculations({
        volume: finalVolume,
        reinforcement: finalReinforcement,
        cement: finalCement,
        sand: finalSand,
        stoneChips: finalStoneChips,
        labor: finalLabor,
        totalCost
      });
    }, 100);
  };

  const handleSave = () => {
    const IconComponent = type.icon;
    
    const item: Omit<ConstructionItem, 'id' | 'createdAt' | 'updatedAt'> = {
      itemId: `${type.id.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      type: type.name,
      category: type.category,
      description: `${type.name} - ${formData.length || formData.diameter}${type.fields.find(f => f.name === 'length' || f.name === 'diameter')?.unit} × ${formData.width || formData.height}${type.fields.find(f => f.name === 'width' || f.name === 'height')?.unit}`,
      
      // Copy all form data
      ...formData,
      
      // Set units based on field configuration
      lengthUnit: type.fields.find(f => f.name === 'length')?.unit || 'ft',
      widthUnit: type.fields.find(f => f.name === 'width')?.unit || 'ft',
      heightUnit: type.fields.find(f => f.name === 'height')?.unit || 'ft',
      depthUnit: type.fields.find(f => f.name === 'depth')?.unit || 'inch',
      
      // Calculated values
      volume: calculations.volume,
      reinforcement: calculations.reinforcement,
      totalCost: calculations.totalCost,
      
      // Material quantities
      cement: calculations.cement,
      sand: calculations.sand,
      stoneChips: calculations.stoneChips,
      
      // For brick walls, calculate brick quantity
      brickQuantity: type.id === 'brickwall' ? Math.ceil(formData.length * formData.height * (formData.thickness === 4.5 ? 55 : formData.thickness === 9 ? 110 : 165)) : undefined,
      
      // For plaster, calculate area
      plasterArea: type.id === 'plaster' ? formData.length * formData.height : undefined,
    };

    onSave(item);
  };

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const IconComponent = type.icon;

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} max-w-4xl mx-auto`}>
      <Card className="glass border-white/20 bg-white/10 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${type.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${type.color}`} />
              </div>
              <div>
                <CardTitle className="text-xl text-white">{type.name} Calculator</CardTitle>
                <Badge variant="secondary" className={`${type.bgColor} ${type.color} mt-1`}>
                  {type.category}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {type.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label className="text-white/90 flex items-center space-x-2">
                  <span>{field.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {field.unit}
                  </Badge>
                  {field.required && <span className="text-red-300">*</span>}
                </Label>
                
                {field.type === 'select' ? (
                  <Select
                    value={formData[field.name]?.toString()}
                    onValueChange={(value) => handleInputChange(field.name, parseFloat(value))}
                  >
                    <SelectTrigger className="bg-white/80 text-gray-900">
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="number"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || 0)}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="bg-white/80 text-gray-900"
                  />
                )}
                
                {field.description && (
                  <p className="text-xs text-white/70 flex items-center space-x-1">
                    <Info className="h-3 w-3" />
                    <span>{field.description}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Quantity Multiplication */}
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-white/90 flex items-center space-x-2">
                  <Hash className="h-4 w-4" />
                  <span>Multiple Units</span>
                </Label>
                <Switch
                  checked={formData.isMultiple}
                  onCheckedChange={(checked) => handleInputChange('isMultiple', checked)}
                />
              </div>
              
              {formData.isMultiple && (
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm">Quantity</Label>
                  <Input
                    type="number"
                    value={formData.quantity || 1}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                    min={1}
                    max={100}
                    className="bg-white/80 text-gray-900"
                    placeholder="Enter quantity"
                  />
                  <p className="text-xs text-white/70">
                    Calculate materials for {formData.quantity} identical {type.name.toLowerCase()}s
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator className="bg-white/20" />

          {/* Calculations Display */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Calculated Results</span>
              {formData.isMultiple && (
                <Badge variant="secondary" className="ml-2">
                  × {formData.quantity}
                </Badge>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Volume */}
              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Ruler className="h-4 w-4 text-blue-300" />
                    <span className="text-sm text-white/80">Volume</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {calculations.volume.toFixed(2)} cft
                  </p>
                </CardContent>
              </Card>

              {/* Reinforcement */}
              {calculations.reinforcement > 0 && (
                <Card className="bg-white/5 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Weight className="h-4 w-4 text-green-300" />
                      <span className="text-sm text-white/80">Steel</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {calculations.reinforcement.toFixed(2)} kg
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Total Cost */}
              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calculator className="h-4 w-4 text-brand-300" />
                    <span className="text-sm text-white/80">Total Cost</span>
                  </div>
                  <p className="text-lg font-bold text-brand-200">
                    {formatBDT(calculations.totalCost)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Material Breakdown */}
            <Card className="bg-white/5 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white/90">Material Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-white/70">Cement</p>
                    <p className="font-medium text-white">{calculations.cement.toFixed(1)} bags</p>
                    <p className="text-xs text-white/60">{formatBDT(calculations.cement * materialRates.cement)}</p>
                  </div>
                  
                  <div>
                    <p className="text-white/70">Sand</p>
                    <p className="font-medium text-white">{calculations.sand.toFixed(1)} cft</p>
                    <p className="text-xs text-white/60">{formatBDT(calculations.sand * materialRates.sand)}</p>
                  </div>
                  
                  {calculations.stoneChips > 0 && (
                    <div>
                      <p className="text-white/70">Stone Chips</p>
                      <p className="font-medium text-white">{calculations.stoneChips.toFixed(1)} cft</p>
                      <p className="text-xs text-white/60">{formatBDT(calculations.stoneChips * materialRates.stoneChips)}</p>
                    </div>
                  )}
                  
                  {calculations.reinforcement > 0 && (
                    <div>
                      <p className="text-white/70">Steel</p>
                      <p className="font-medium text-white">{calculations.reinforcement.toFixed(1)} kg</p>
                      <p className="text-xs text-white/60">{formatBDT(calculations.reinforcement * materialRates.reinforcement)}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-white/70">Labor</p>
                    <p className="font-medium text-white">{calculations.labor.toFixed(1)} cft</p>
                    <p className="text-xs text-white/60">{formatBDT(calculations.labor * materialRates.labor)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reinforcement Details */}
            {(formData.mainBarDia || formData.stirrupDia) && (
              <Card className="bg-white/5 border-white/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white/90">Reinforcement Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {formData.mainBarDia && (
                      <div>
                        <p className="text-white/70">Main Bars</p>
                        <p className="font-medium text-white">
                          {formData.numberOfBars || 'N/A'} nos × {formData.mainBarDia}mm
                        </p>
                        {formData.mainBarSpacing && (
                          <p className="text-xs text-white/60">
                            Spacing: {formData.mainBarSpacing}"
                          </p>
                        )}
                      </div>
                    )}
                    
                    {formData.stirrupDia && (
                      <div>
                        <p className="text-white/70">Stirrups</p>
                        <p className="font-medium text-white">
                          {formData.stirrupDia}mm @ {formData.stirrupSpacing}"
                        </p>
                        <p className="text-xs text-white/60">
                          Spacing: {formData.stirrupSpacing}" c/c
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
              disabled={!formData || calculations.totalCost === 0}
            >
              <Calculator className="h-4 w-4 mr-2" />
              {editingItem ? 'Update Item' : 'Add to Project'}
            </Button>
            
            <Button
              variant="outline"
              onClick={onCancel}
              className="md:w-auto border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}