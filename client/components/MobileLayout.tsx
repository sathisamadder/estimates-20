import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  Calculator,
  Building2,
  BarChart3,
  FileText,
  PieChart,
  Settings,
  User,
  Home,
  Plus,
  Search,
  Save,
  Download,
  Printer,
} from "lucide-react";

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddItem: () => void;
  onOpenPricing: () => void;
  onSave: () => void;
  onExport: () => void;
  onPrint: () => void;
  projectName: string;
  totalCost: string;
  itemCount: number;
}

const navigationItems = [
  { id: "items", label: "Project Items", icon: Building2 },
  { id: "summary", label: "Cost Analysis", icon: BarChart3 },
  { id: "details", label: "Detailed Report", icon: FileText },
  { id: "analytics", label: "Analytics", icon: PieChart },
];

export function MobileLayout({
  children,
  activeTab,
  onTabChange,
  onAddItem,
  onOpenPricing,
  onSave,
  onExport,
  onPrint,
  projectName,
  totalCost,
  itemCount,
}: MobileLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { currentUser, logout } = useAuth();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="p-6 border-b bg-gradient-to-r from-brand-500 to-brand-600">
                    <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2F60f84872b4b14093aa9e83d9ad74d969%2F46361fbad51e408b89450daa00371588"
                          alt="Construction Estimator Logo"
                          className="w-7 h-7 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <Calculator className="h-6 w-6 text-white hidden" />
                      </div>
                      <div>
                        <h2 className="font-bold text-white">Construction</h2>
                        <p className="text-sm text-white/80">Estimator Pro</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {projectName}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{itemCount} items</span>
                        <span className="font-medium text-brand-600">
                          {totalCost}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <ScrollArea className="flex-1 p-2">
                    <div className="space-y-1">
                      {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={
                              activeTab === item.id ? "secondary" : "ghost"
                            }
                            className={`w-full justify-start h-12 ${
                              activeTab === item.id
                                ? "bg-brand-50 text-brand-700 border-r-2 border-brand-500"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              onTabChange(item.id);
                              setIsMenuOpen(false);
                            }}
                          >
                            <IconComponent className="h-5 w-5 mr-3" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12 text-gray-700"
                          onClick={onOpenPricing}
                        >
                          <Settings className="h-5 w-5 mr-3" />
                          Pricing Settings
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12 text-gray-700"
                          onClick={onSave}
                        >
                          <Save className="h-5 w-5 mr-3" />
                          Save Project
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12 text-gray-700"
                          onClick={onExport}
                        >
                          <Download className="h-5 w-5 mr-3" />
                          Export Data
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12 text-gray-700"
                          onClick={onPrint}
                        >
                          <Printer className="h-5 w-5 mr-3" />
                          Print Report
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>

                  {/* Footer */}
                  <div className="p-4 border-t bg-gray-50">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Developed by ROY SHAON
                      </p>
                      <p className="text-xs text-gray-400">
                        Professional Engineering
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 truncate max-w-32">
                  {projectName}
                </h1>
                <p className="text-xs text-gray-600">{itemCount} items</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              className="bg-brand-500 hover:bg-brand-600 px-3"
              onClick={onAddItem}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="border-t bg-white">
          <div className="overflow-x-auto">
            <div className="flex space-x-1 p-2 min-w-max">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    size="sm"
                    className={`flex-shrink-0 ${
                      activeTab === item.id
                        ? "bg-brand-100 text-brand-700"
                        : "text-gray-600"
                    }`}
                    onClick={() => onTabChange(item.id)}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pb-20">{children}</main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur-sm">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col h-14 space-y-1 ${
                  activeTab === item.id
                    ? "text-brand-600 bg-brand-50"
                    : "text-gray-600"
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-xs font-medium leading-none">
                  {item.label.split(" ")[0]}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className="fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-600 shadow-lg"
        onClick={onAddItem}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
