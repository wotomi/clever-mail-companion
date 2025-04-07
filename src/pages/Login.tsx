
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const { currentUser, loginWithGoogle, loading } = useAuth();

  // Redirect if already logged in
  if (!loading && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="mx-auto bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-600">Gmail Assistant</CardTitle>
            <CardDescription className="text-gray-500">
              Your AI-powered email management solution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-center text-sm text-gray-500">
              Login with your Google account to get started with smart email management
            </p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={loginWithGoogle}
              disabled={loading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-center mt-8 text-gray-500">
          &copy; {new Date().getFullYear()} Gmail Assistant. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
