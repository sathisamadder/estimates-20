import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Navigation Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ConstructPro</h1>
              <p className="text-sm text-gray-600">
                Professional Estimation Platform
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full mx-auto mb-4">
                  <Building2 className="h-10 w-10 text-brand-600" />
                </div>
                <h1 className="text-6xl font-bold text-brand-600 mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Page Not Found
                </h2>
                <p className="text-gray-600">
                  The construction blueprint you're looking for doesn't exist.
                  Let's get you back to building something great.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-brand-500 hover:bg-brand-600"
                >
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
