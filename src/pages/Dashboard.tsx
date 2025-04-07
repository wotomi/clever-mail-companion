
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOAuth } from "@/contexts/OAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processEmails } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  RefreshCw, 
  Archive, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  X,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StatCard = ({ 
  title, 
  value, 
  icon,
  description,
  change,
  iconColor
}: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  change: { value: number; positive: boolean };
  iconColor?: string;
}) => {
  const changeClass = change.positive ? "text-green-500" : "text-red-500";
  const bgColor = iconColor || "bg-blue-500";
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
            <div className={`flex items-center mt-2 ${changeClass}`}>
              {change.positive ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              <span className="text-sm">{change.value}% from last week</span>
            </div>
          </div>
          <div className={`${bgColor} p-3 rounded-lg text-white`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const sampleData = [
  { day: "Mon", processed: 4, archived: 2, deleted: 1 },
  { day: "Tue", processed: 7, archived: 3, deleted: 2 },
  { day: "Wed", processed: 5, archived: 2, deleted: 1 },
  { day: "Thu", processed: 10, archived: 4, deleted: 3 },
  { day: "Fri", processed: 12, archived: 5, deleted: 3 },
  { day: "Sat", processed: 4, archived: 1, deleted: 1 },
  { day: "Sun", processed: 3, archived: 1, deleted: 0 },
];

const ConnectionCard = ({ 
  title,
  connected,
  description,
  buttonText,
  onClick,
  icon
}: {
  title: string;
  connected: boolean;
  description: string;
  buttonText: string;
  onClick: () => Promise<void>;
  icon: React.ReactNode;
}) => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{title}</h3>
            {connected ? (
              <Badge className="bg-green-500">Connected</Badge>
            ) : (
              <div className="flex items-center text-red-500">
                <X className="h-4 w-4 mr-1" />
                <span>Not Connected</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="text-blue-500">
          {icon}
        </div>
      </div>
      
      <Button 
        className="w-full mt-4"
        onClick={onClick}
        disabled={connected}
      >
        {buttonText}
      </Button>
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
  } = useOAuth();
  const { toast } = useToast();
  const [processingEmails, setProcessingEmails] = useState(false);
  const [activeTab, setActiveTab] = useState("weekly");

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
      const result = await processEmails(10);
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
    <div>
      {/* Header with action button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          className="flex gap-2"
          onClick={handleProcessEmails}
          disabled={!gmailStatus?.authenticated || processingEmails}
        >
          {processingEmails ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Process New Emails
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Processed Emails" 
          value="152" 
          icon={<Mail className="h-6 w-6" />}
          description="Total emails processed this month"
          change={{ value: 12, positive: true }}
        />
        
        <StatCard 
          title="Archived" 
          value="64" 
          icon={<Archive className="h-6 w-6" />}
          iconColor="bg-indigo-500"
          description="Emails automatically archived"
          change={{ value: 8, positive: true }}
        />
        
        <StatCard 
          title="Deleted" 
          value="27" 
          icon={<Trash2 className="h-6 w-6" />}
          iconColor="bg-red-500"
          description="Emails automatically deleted"
          change={{ value: 3, positive: false }}
        />
        
        <StatCard 
          title="Response Rate" 
          value="92%" 
          icon={<CheckCircle className="h-6 w-6" />}
          iconColor="bg-green-500"
          description="Average response completion"
          change={{ value: 5, positive: true }}
        />
      </div>
      
      {/* Chart Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Email Activity</h3>
            <Tabs 
              defaultValue="weekly" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-[300px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="processed" 
                  stackId="1" 
                  stroke="#2563eb" 
                  fill="#3b82f6" 
                />
                <Area 
                  type="monotone" 
                  dataKey="archived" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#c7d2fe" 
                />
                <Area 
                  type="monotone" 
                  dataKey="deleted" 
                  stackId="1" 
                  stroke="#ffc658" 
                  fill="#fecaca" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Connection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConnectionCard
          title="Gmail Connection"
          connected={gmailStatus?.authenticated || false}
          description={gmailStatus?.authenticated 
            ? `Connected as ${gmailStatus?.email}` 
            : "Connect your Gmail account to start processing emails"}
          buttonText="Connect Gmail"
          onClick={handleConnectGmail}
          icon={<Mail className="h-8 w-8" />}
        />
        
        <ConnectionCard
          title="Slack Integration"
          connected={slackStatus?.connected || false}
          description={slackStatus?.connected
            ? `Connected to workspace: ${slackStatus?.workspace}`
            : "Set up Slack integration for notifications"}
          buttonText="Connect Slack"
          onClick={handleConnectSlack}
          icon={<AlertCircle className="h-8 w-8" />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
