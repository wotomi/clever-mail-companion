
import React, { useState } from "react";
import { useOAuth } from "@/contexts/OAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const StepItem = ({ 
  number, 
  title, 
  description, 
  status = "pending" 
}: { 
  number: number; 
  title: string; 
  description: string;
  status?: "pending" | "active" | "complete" | "error" 
}) => {
  const getBgColor = () => {
    switch (status) {
      case "active":
        return "bg-blue-600 text-white";
      case "complete":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };
  
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className={`${getBgColor()} rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0`}>
        {status === "complete" ? <CheckCircle className="h-4 w-4" /> : number}
      </div>
      <div>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
};

const GmailConnection = () => {
  const { gmailStatus, handleConnectGmail, gmailLoading } = useOAuth();
  const [connectionStep, setConnectionStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const startConnection = async () => {
    try {
      setError(null);
      await handleConnectGmail();
      // The actual redirect happens in the OAuth context
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to initiate Gmail connection');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gmail Connection</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Mail className="h-6 w-6 text-blue-600" />
            Connect to Gmail
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            Connect your Gmail account to start processing emails automatically
          </p>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <StepItem 
              number={1} 
              title="Grant Access" 
              description="Allow the app to access your Gmail account"
              status={connectionStep >= 1 ? "active" : "pending"}
            />
            
            <StepItem 
              number={2} 
              title="Choose Settings" 
              description="Configure how emails should be processed"
              status={connectionStep >= 2 ? "active" : "pending"}
            />
            
            <StepItem 
              number={3} 
              title="Verify Connection" 
              description="Testing the connection to your Gmail account"
              status={connectionStep >= 3 ? "active" : "pending"}
            />
            
            <StepItem 
              number={4} 
              title="Complete" 
              description="Connection successfully established"
              status={gmailStatus?.authenticated ? "complete" : "pending"}
            />
          </div>
          
          {error && (
            <Alert variant="destructive" className="my-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>Failed to initiate Gmail connection</AlertDescription>
            </Alert>
          )}
          
          {gmailStatus?.authenticated ? (
            <Alert className="bg-green-50 text-green-800 border-green-200 my-6">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 font-medium">Connection Successful</AlertTitle>
              <AlertDescription className="text-green-700">
                Your Gmail account has been connected successfully
              </AlertDescription>
            </Alert>
          ) : (
            <div className="mt-6">
              <Alert className="bg-blue-50 border-blue-100 text-blue-800 mb-6">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 font-medium">Authorization Required</AlertTitle>
                <AlertDescription className="text-blue-700">
                  You'll be redirected to Google's authorization page to grant access to your Gmail account.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={startConnection} 
                disabled={gmailLoading} 
                className="w-full md:w-auto"
              >
                {gmailLoading ? "Connecting..." : "Connect Gmail"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GmailConnection;
