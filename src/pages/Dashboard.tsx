
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOAuth } from "@/contexts/OAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { processEmails } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Mail, Calendar, Slack, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";

const ConnectionStatus = ({ 
  title,
  connected,
  loading,
  identifier,
  expiresAt,
  onConnect,
  onDisconnect,
  icon
}: {
  title: string;
  connected: boolean;
  loading: boolean;
  identifier?: string;
  expiresAt?: string;
  onConnect: () => Promise<void>;
  onDisconnect?: () => Promise<void>;
  icon: React.ReactNode;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {connected ? (
          <Badge className="bg-green-500">Connected</Badge>
        ) : (
          <Badge variant="outline">Not Connected</Badge>
        )}
      </div>
      <CardDescription>{connected ? identifier : "Not connected"}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {connected && expiresAt && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              Expires: {format(new Date(expiresAt), "PP")}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          {connected ? (
            <>
              {onDisconnect && (
                <Button 
                  variant="outline" 
                  onClick={onDisconnect}
                  disabled={loading}
                >
                  Disconnect
                </Button>
              )}
            </>
          ) : (
            <Button 
              onClick={onConnect}
              disabled={loading}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { 
    gmailStatus, 
    slackStatus, 
    gmailLoading, 
    slackLoading,
    handleConnectGmail,
    handleConnectSlack,
    handleRevokeGmail
  } = useOAuth();
  const { toast } = useToast();
  const [processingEmails, setProcessingEmails] = useState(false);

  const handleProcessEmails = async () => {
    if (!gmailStatus?.authenticated) {
      toast({
        variant: "destructive",
        title: "Gmail not connected",
        description: "Please connect your Gmail account first",
      });
      return;
    }

    try {
      setProcessingEmails(true);
      const result = await processEmails(10); // Process up to 10 emails
      toast({
        title: "Emails Processed",
        description: `Successfully processed ${result.processed} email(s)`,
      });
    } catch (error: any) {
      console.error("Error processing emails:", error);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: error.message || "Failed to process emails",
      });
    } finally {
      setProcessingEmails(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your email connections and settings
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ConnectionStatus
          title="Gmail"
          connected={gmailStatus?.authenticated || false}
          loading={gmailLoading}
          identifier={gmailStatus?.email}
          expiresAt={gmailStatus?.expires_at}
          onConnect={handleConnectGmail}
          onDisconnect={handleRevokeGmail}
          icon={<Mail className="w-5 h-5" />}
        />
        
        <ConnectionStatus
          title="Slack"
          connected={slackStatus?.connected || false}
          loading={slackLoading}
          identifier={slackStatus?.workspace}
          onConnect={handleConnectSlack}
          icon={<Slack className="w-5 h-5" />}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="default"
            className="flex gap-2"
            disabled={!gmailStatus?.authenticated || processingEmails}
            onClick={handleProcessEmails}
          >
            {processingEmails ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            Process Unread Emails
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Status</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {gmailStatus?.authenticated ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Gmail account connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <span>Gmail account not connected</span>
                  </>
                )}
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                {slackStatus?.connected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Slack workspace connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <span>Slack not connected</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
