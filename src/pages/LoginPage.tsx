
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">HYDRAA</h1>
          <p className="text-sm text-muted-foreground">
            Hyderabad Disaster Response and Asset Protection Agency
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
