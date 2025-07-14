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
import {
  Calculator,
  Building2,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Hammer,
  Ruler,
  PieChart,
} from "lucide-react";

export default function Index() {
  const [activeProject, setActiveProject] = useState("residential");

  const projects = [
    {
      id: "residential",
      name: "Residential Complex",
      status: "In Progress",
      progress: 65,
      budget: "$2.4M",
    },
    {
      id: "commercial",
      name: "Office Building",
      status: "Planning",
      progress: 25,
      budget: "$5.8M",
    },
    {
      id: "infrastructure",
      name: "Bridge Construction",
      status: "Review",
      progress: 85,
      budget: "$12.1M",
    },
  ];

  const recentEstimates = [
    {
      id: 1,
      project: "Foundation Work",
      type: "Mat Foundation",
      amount: "$145,230",
      date: "2024-01-15",
    },
    {
      id: 2,
      project: "Pile Work",
      type: '20" Diameter Pile',
      amount: "$89,450",
      date: "2024-01-14",
    },
    {
      id: 3,
      project: "Retaining Wall",
      type: "100' Length Wall",
      amount: "$67,890",
      date: "2024-01-13",
    },
    {
      id: 4,
      project: "Beam Work",
      type: '10"x18" Beam',
      amount: "$34,520",
      date: "2024-01-12",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Navigation Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ConstructPro
                </h1>
                <p className="text-sm text-gray-600">
                  Professional Estimation Platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Team
              </Button>
              <Button size="sm" className="bg-brand-500 hover:bg-brand-600">
                <FileText className="h-4 w-4 mr-2" />
                New Estimate
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Construction Estimation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Streamline your construction projects with accurate estimates,
            real-time calculations, and comprehensive project management tools
            designed for civil engineers and contractors.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" className="bg-brand-500 hover:bg-brand-600">
              <Calculator className="h-5 w-5 mr-2" />
              Start New Estimate
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              <FileText className="h-5 w-5 mr-2" />
              View Templates
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-brand-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Projects
                  </p>
                  <p className="text-3xl font-bold text-gray-900">24</p>
                </div>
                <Building2 className="h-8 w-8 text-brand-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Estimates
                  </p>
                  <p className="text-3xl font-bold text-gray-900">156</p>
                </div>
                <Calculator className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Value
                  </p>
                  <p className="text-3xl font-bold text-gray-900">$18.2M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Accuracy Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900">96.8%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="dashboard"
              className="flex items-center space-x-2"
            >
              <PieChart className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="calculator"
              className="flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>Quick Calculator</span>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="flex items-center space-x-2"
            >
              <Building2 className="h-4 w-4" />
              <span>Projects</span>
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Templates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Estimates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Recent Estimates</span>
                  </CardTitle>
                  <CardDescription>
                    Latest construction estimates and calculations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentEstimates.map((estimate) => (
                      <div
                        key={estimate.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {estimate.project}
                          </p>
                          <p className="text-sm text-gray-600">
                            {estimate.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {estimate.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-600">
                            {estimate.amount}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Project Overview</span>
                  </CardTitle>
                  <CardDescription>
                    Current project status and progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {project.name}
                          </h4>
                          <Badge
                            variant={
                              project.status === "In Progress"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Budget:{" "}
                          <span className="font-medium text-gray-900">
                            {project.budget}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Quick Estimation Calculator</span>
                </CardTitle>
                <CardDescription>
                  Calculate construction estimates for common structural
                  elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Pile Work Calculator */}
                  <Card className="border-2 border-dashed border-gray-200 hover:border-brand-300 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Hammer className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Pile Work
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Calculate concrete, reinforcement, and costs for pile
                        foundations
                      </p>
                      <Button variant="outline" className="w-full">
                        Calculate
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Foundation Calculator */}
                  <Card className="border-2 border-dashed border-gray-200 hover:border-brand-300 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Building2 className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Foundation
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Mat foundation, pile cap, and footing estimates
                      </p>
                      <Button variant="outline" className="w-full">
                        Calculate
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Structural Elements */}
                  <Card className="border-2 border-dashed border-gray-200 hover:border-brand-300 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Ruler className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Structural Elements
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Beams, columns, slabs, and stair calculations
                      </p>
                      <Button variant="outline" className="w-full">
                        Calculate
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Sample Calculator Form */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Sample: Pile Foundation Calculator
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="pile-diameter">
                        Pile Diameter (inches)
                      </Label>
                      <Input
                        id="pile-diameter"
                        placeholder="20"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pile-length">Pile Length (feet)</Label>
                      <Input
                        id="pile-length"
                        placeholder="60"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pile-count">Number of Piles</Label>
                      <Input id="pile-count" placeholder="7" className="mt-1" />
                    </div>
                  </div>
                  <Button className="mt-4 bg-brand-500 hover:bg-brand-600">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Estimate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>
                  Manage all your construction projects in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center py-8">
                  Project management features coming soon. This will include
                  detailed project tracking, team collaboration, document
                  management, and progress monitoring.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estimation Templates</CardTitle>
                <CardDescription>
                  Pre-built templates for common construction estimates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center py-8">
                  Template library coming soon. This will include standardized
                  templates for various construction elements like foundations,
                  structural work, and finishing.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
