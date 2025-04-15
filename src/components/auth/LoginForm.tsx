
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MailIcon, LockIcon, LoaderIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await login(email, password);
      
      toast({
        title: "Login successful",
        description: `Welcome, ${user.name}`,
      });
      
      // Redirect based on user role
      switch (user.role) {
        case "Reception":
          navigate("/reception");
          break;
        case "EnquiryOfficer":
          navigate("/officer");
          break;
        case "HOD":
          navigate("/commissioner");
          break;
        case "Admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign in to HYDRAA</CardTitle>
        <CardDescription className="text-center">
          Hyderabad Disaster Response and Asset Protection Agency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <MailIcon size={16} />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="name@hydraa.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <LockIcon size={16} />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-sm text-muted-foreground text-center mt-2">
          For testing, use these accounts:<br />
          Reception: reception@hydraa.gov.in<br />
          EO: officer@hydraa.gov.in<br />
          Commissioner: commissioner@hydraa.gov.in<br />
          Admin: admin@hydraa.gov.in<br />
          (any password will work)
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
