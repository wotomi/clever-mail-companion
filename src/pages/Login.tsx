
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
    <div className="auth-layout">
      <div className="container max-w-md flex flex-col items-center justify-center min-h-screen py-12">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              <span className="gradient-text">Gmail Assistant</span>
            </CardTitle>
            <CardDescription className="mt-2">
              Your AI-powered email management solution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground pb-4">
              Login with your Google account to get started with smart email management
            </p>
            <Button
              className="w-full"
              onClick={loginWithGoogle}
              disabled={loading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          </CardContent>
        </Card>
        <p className="text-xs text-center mt-8 text-muted-foreground">
          &copy; {new Date().getFullYear()} Gmail Assistant. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
