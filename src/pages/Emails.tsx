
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getEmailHistory, processSpecificEmail } from "@/lib/api";
import { Mail, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface EmailHistoryItem {
  id: string;
  subject: string;
  sender: string;
  processed_at: string;
  status: string;
  summary?: string;
}

const Emails = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([]);
  const [processingEmailId, setProcessingEmailId] = useState<string | null>(null);

  const fetchEmailHistory = async () => {
    try {
      setLoading(true);
      const response = await getEmailHistory(20); // Get last 20 emails
      setEmailHistory(response.emails || []);
    } catch (error: any) {
      console.error("Error fetching email history:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch email history",
        description: error.message || "An error occurred loading email history",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEmail = async (emailId: string) => {
    try {
      setProcessingEmailId(emailId);
      await processSpecificEmail(emailId);
      toast({
        title: "Email Processed",
        description: "Email was successfully processed",
      });
      // Refresh email history to get the updated information
      fetchEmailHistory();
    } catch (error: any) {
      console.error("Error processing email:", error);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: error.message || "Failed to process email",
      });
    } finally {
      setProcessingEmailId(null);
    }
  };

  useEffect(() => {
    fetchEmailHistory();
  }, []);

  const renderStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
        return <Badge className="bg-green-500">Processed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Emails</h1>
          <p className="text-muted-foreground">View and manage processed emails</p>
        </div>
        <Button onClick={fetchEmailHistory} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Email History</CardTitle>
          <CardDescription>
            Recent emails processed by Gmail Assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            // Loading state with skeletons
            <div className="space-y-4">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          ) : emailHistory.length === 0 ? (
            // No emails processed yet
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <p className="mt-2 text-muted-foreground">No processed emails found</p>
            </div>
          ) : (
            // Email history list
            <div className="space-y-4">
              {emailHistory.map((email) => (
                <div key={email.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium line-clamp-1">{email.subject}</h3>
                    {renderStatus(email.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From: {email.sender}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Processed: {format(new Date(email.processed_at), "PPp")}
                  </p>
                  {email.summary && (
                    <div className="mt-2 text-sm bg-muted p-2 rounded">
                      <p>{email.summary}</p>
                    </div>
                  )}
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProcessEmail(email.id)}
                      disabled={processingEmailId === email.id}
                    >
                      {processingEmailId === email.id ? (
                        <>
                          <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Reprocess"
                      )}
                    </Button>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Emails;
