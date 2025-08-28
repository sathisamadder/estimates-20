import { useEffect, useState } from "react";
import { useDataManager } from "@/hooks/use-data-manager";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cog, Save } from "lucide-react";

export default function Settings() {
  const { projects, currentProjectId, updateProject } = useDataManager();
  const currentProject = currentProjectId
    ? projects.find((p) => p.id === currentProjectId)
    : null;
  const [rates, setRates] = useState(
    currentProject?.customRates || {
      cement: 450,
      sand: 45,
      stoneChips: 55,
      reinforcement: 75,
      brick: 12,
      labor: 300,
    },
  );

  useEffect(() => {
    if (currentProject?.customRates) setRates(currentProject.customRates);
  }, [currentProject?.customRates]);

  const save = () => {
    if (!currentProjectId) return;
    updateProject(currentProjectId, { customRates: rates });
  };

  return (
    <div className="min-h-screen gpt-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="glass border-white/20 bg-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cog className="h-5 w-5" /> Material Pricing
            </CardTitle>
            <CardDescription className="text-white/80">
              Update market rates used for cost calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/90">Cement (BDT/bag)</Label>
                <Input
                  className="bg-white/80"
                  value={rates.cement}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      cement: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-white/90">Sand (BDT/cft)</Label>
                <Input
                  className="bg-white/80"
                  value={rates.sand}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      sand: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-white/90">Stone (BDT/cft)</Label>
                <Input
                  className="bg-white/80"
                  value={rates.stoneChips}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      stoneChips: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-white/90">Steel (BDT/kg)</Label>
                <Input
                  className="bg-white/80"
                  value={rates.reinforcement}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      reinforcement: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-white/90">Brick (BDT/pc)</Label>
                <Input
                  className="bg-white/80"
                  value={rates.brick}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      brick: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-white/90">Labor (BDT/cft)</Label>
                <Input
                  className="bg-white/80"
                  value={rates.labor}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      labor: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={save}
                className="bg-brand-500 hover:bg-brand-600"
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
