
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { 
  checkGmailStatus, 
  connectGmail, 
  revokeGmail, 
  checkSlackStatus, 
  connectSlack 
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface GmailStatus {
  authenticated: boolean;
  email?: string;
  expires_at?: string;
  reason?: string;
}

interface SlackStatus {
  connected: boolean;
  workspace?: string;
  reason?: string;
}

interface OAuthContextType {
  gmailStatus: GmailStatus | null;
  slackStatus: SlackStatus | null;
  gmailLoading: boolean;
  slackLoading: boolean;
  refreshGmailStatus: () => Promise<void>;
  refreshSlackStatus: () => Promise<void>;
  handleConnectGmail: () => Promise<void>;
  handleRevokeGmail: () => Promise<void>;
  handleConnectSlack: () => Promise<void>;
}

const OAuthContext = createContext<OAuthContextType | null>(null);

export const useOAuth = () => {
  const context = useContext(OAuthContext);
  if (!context) {
    throw new Error("useOAuth must be used within an OAuthProvider");
  }
  return context;
};

export const OAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [gmailStatus, setGmailStatus] = useState<GmailStatus | null>(null);
  const [slackStatus, setSlackStatus] = useState<SlackStatus | null>(null);
  const [gmailLoading, setGmailLoading] = useState<boolean>(true);
  const [slackLoading, setSlackLoading] = useState<boolean>(true);

  // Refresh Gmail connection status
  const refreshGmailStatus = async () => {
    if (!currentUser) {
      setGmailStatus(null);
      setGmailLoading(false);
      return;
    }
    
    try {
      setGmailLoading(true);
      const status = await checkGmailStatus();
      setGmailStatus(status);
    } catch (error) {
      console.error("Error checking Gmail status:", error);
      setGmailStatus({ authenticated: false, reason: "Error checking status" });
    } finally {
      setGmailLoading(false);
    }
  };

  // Refresh Slack connection status
  const refreshSlackStatus = async () => {
    if (!currentUser) {
      setSlackStatus(null);
      setSlackLoading(false);
      return;
    }
    
    try {
      setSlackLoading(true);
      const status = await checkSlackStatus();
      setSlackStatus(status);
    } catch (error) {
      console.error("Error checking Slack status:", error);
      setSlackStatus({ connected: false, reason: "Error checking status" });
    } finally {
      setSlackLoading(false);
    }
  };

  // Handle initiating Gmail OAuth flow
  const handleConnectGmail = async () => {
    try {
      const response = await connectGmail();
      if (response.auth_url) {
        // Redirect to Google's OAuth consent page
        window.location.href = response.auth_url;
      } else {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to get authorization URL",
        });
      }
    } catch (error: any) {
      console.error("Error connecting Gmail:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message || "Failed to connect Gmail",
      });
    }
  };

  // Handle revoking Gmail access
  const handleRevokeGmail = async () => {
    try {
      const response = await revokeGmail();
      if (response.revoked) {
        toast({
          title: "Gmail Disconnected",
          description: "Successfully revoked access to Gmail",
        });
        await refreshGmailStatus();
      } else {
        toast({
          variant: "destructive",
          title: "Revocation Error",
          description: response.message || "Failed to revoke Gmail access",
        });
      }
    } catch (error: any) {
      console.error("Error revoking Gmail:", error);
      toast({
        variant: "destructive",
        title: "Revocation Error",
        description: error.message || "Failed to revoke Gmail access",
      });
    }
  };

  // Handle initiating Slack OAuth flow
  const handleConnectSlack = async () => {
    try {
      const response = await connectSlack();
      if (response.auth_url) {
        // Redirect to Slack's OAuth consent page
        window.location.href = response.auth_url;
      } else {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to get Slack authorization URL",
        });
      }
    } catch (error: any) {
      console.error("Error connecting Slack:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message || "Failed to connect Slack",
      });
    }
  };

  // Check connection status on page load or after user logs in
  useEffect(() => {
    if (currentUser) {
      refreshGmailStatus();
      refreshSlackStatus();
    } else {
      setGmailStatus(null);
      setSlackStatus(null);
      setGmailLoading(false);
      setSlackLoading(false);
    }
  }, [currentUser]);

  const value = {
    gmailStatus,
    slackStatus,
    gmailLoading,
    slackLoading,
    refreshGmailStatus,
    refreshSlackStatus,
    handleConnectGmail,
    handleRevokeGmail,
    handleConnectSlack
  };

  return (
    <OAuthContext.Provider value={value}>
      {children}
    </OAuthContext.Provider>
  );
};
