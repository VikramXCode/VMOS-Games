import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/contexts/AdminContext";
import { ShieldCheck, Home } from "lucide-react";

export const AdminLoginPage = () => {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | undefined)?.from || "/admin/overview";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-surface px-4 py-10">
      <Card className="w-full max-w-md bg-surface-2/95 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
        <CardHeader className="text-center space-y-3 pt-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground mx-auto">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="font-heading text-2xl">Admin Dashboard</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Enter credentials to continue</p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="rounded-xl h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="rounded-xl h-11"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-5 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Home className="h-3.5 w-3.5" />
            VMOS Game Station
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
