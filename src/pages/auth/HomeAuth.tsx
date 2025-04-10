import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomeAuth = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account or create a new one</p>
        </div>

        <div className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeAuth;
