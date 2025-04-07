
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    const code = params.get('code');
    const state = params.get('state');
    
    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error,
      });
      
      // Redirect back to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return;
    }
    
    if (code) {
      // The backend handles the actual token exchange via the /oauth/oauth-callback endpoint
      // This page is just a visual indicator for the user during the process
      setStatus('success');
      setMessage('Authentication successful! Redirecting...');
      toast({
        title: "Connection Successful",
        description: "Your account has been connected successfully",
      });
      
      // Redirect back to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setStatus('error');
      setMessage('Missing authentication code');
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Missing authentication code",
      });
      
      // Redirect back to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  }, [location.search, navigate, toast]);

  return (
    <div className="auth-layout">
      <div className="container max-w-md flex flex-col items-center justify-center min-h-screen py-12">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              <span className="gradient-text">Connection Status</span>
            </CardTitle>
            <CardDescription className="mt-2">
              {status === 'loading' ? 'Processing your authentication' : 
               status === 'success' ? 'Authentication successful' : 
               'Authentication failed'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            {status === 'loading' && (
              <RefreshCw className="h-16 w-16 text-primary animate-spin mb-4" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-destructive mb-4" />
            )}
            <p className="text-center mt-2">{message}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OAuthCallback;
