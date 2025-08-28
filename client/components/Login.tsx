import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculator, Eye, EyeOff } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);

      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gpt-background relative flex items-center justify-center p-4">
      <div className="liquid-layer">
        <div className="liquid-blob blob1"></div>
        <div className="liquid-blob blob2"></div>
        <div className="liquid-blob blob3"></div>
      </div>
      <Card className="w-full max-w-md shadow-xl glass border-white/20 bg-white/10 text-white">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F60f84872b4b14093aa9e83d9ad74d969%2F46361fbad51e408b89450daa00371588"
                alt="ROY Logo"
                className="w-10 h-10 object-contain bg-transparent"
                style={{ background: "transparent", backdropFilter: "none" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              <Calculator className="h-8 w-8 text-brand-200 hidden" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">ROY</CardTitle>
          <CardDescription className="text-white/80">
            {isRegistering ? "Create your account" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 bg-white/80"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-500 hover:bg-brand-600"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              ) : null}
              {isRegistering ? "Create Account" : "Sign In"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-white/90 hover:text-white"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError("");
                }}
              >
                {isRegistering
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
