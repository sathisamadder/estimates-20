import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface MobileEstimateItem {
  id: string;
  itemId: string;
  type: string;
  description: string;
  category: string;
  reinforcement: number;
  volume: number;
  totalCost: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  brickQuantity?: number;
  plasterArea?: number;
  unit: string;
}

interface MobileTableProps {
  items: EstimateItem[];
  onEdit: (item: EstimateItem) => void;
  onDuplicate: (item: EstimateItem) => void;
  onDelete: (itemId: string) => void;
  formatBDT: (amount: number) => string;
}

export function MobileTable({
  items,
  onEdit,
  onDuplicate,
  onDelete,
  formatBDT,
}: MobileTableProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  if (!isMobile) {
    // Return desktop table for non-mobile devices
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4">Item ID</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Description</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Reinforcement</th>
              <th className="text-left p-4">Volume/Area</th>
              <th className="text-right p-4">Cost (BDT)</th>
              <th className="w-12 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const IconComponent = item.icon;
              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Badge variant="outline" className="font-mono">
                      {item.itemId}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`h-4 w-4 ${item.color}`} />
                      <div>
                        <p className="font-medium">{item.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{item.description}</td>
                  <td className="p-4">
                    <Badge variant="secondary" className={`${item.bgColor} ${item.color}`}>
                      {item.category}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3 text-green-600" />
                      <span className="text-sm font-medium">
                        {item.reinforcement} kg
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {item.brickQuantity || item.plasterArea ? (
                        <p>
                          {item.plasterArea || item.brickQuantity} {item.unit}
                        </p>
                      ) : (
                        <p>{item.volume} cft</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium">
                    {formatBDT(item.totalCost)}
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate(item)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(item.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Mobile card layout
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const IconComponent = item.icon;
        const isExpanded = expandedItems.has(item.id);
        
        return (
          <Card key={item.id} className="shadow-sm">
            <CardContent className="p-4">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.itemId}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm mt-1 line-clamp-1">
                      {item.description}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(item.id)}
                    className="p-1"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(item)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Summary Row */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Reinforcement</p>
                  <div className="flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-green-600" />
                    <span className="font-medium">{item.reinforcement} kg</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-500 text-xs">Volume/Area</p>
                  <p className="font-medium">
                    {item.brickQuantity || item.plasterArea ? (
                      <>{item.plasterArea || item.brickQuantity} {item.unit}</>
                    ) : (
                      <>{item.volume} cft</>
                    )}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Total Cost</p>
                  <p className="font-bold text-brand-600">
                    {formatBDT(item.totalCost)}
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <>
                  <Separator className="my-3" />
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Item Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-2 font-medium">{item.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <span className="ml-2 font-medium">{item.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Measurements</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Volume:</span>
                          <span className="ml-2 font-medium">{item.volume} cft</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Steel:</span>
                          <span className="ml-2 font-medium">{item.reinforcement} kg</span>
                        </div>
                        {item.brickQuantity && (
                          <div>
                            <span className="text-gray-500">Bricks:</span>
                            <span className="ml-2 font-medium">{item.brickQuantity} nos</span>
                          </div>
                        )}
                        {item.plasterArea && (
                          <div>
                            <span className="text-gray-500">Area:</span>
                            <span className="ml-2 font-medium">{item.plasterArea} sft</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {items.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Start by adding construction items to your project
              </p>
              <Button size="sm" className="bg-brand-500 hover:bg-brand-600">
                Add First Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
