
import React from "react";
import { useOAuth } from "@/contexts/OAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Slack, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SlackIntegration = () => {
  const { slackStatus, handleConnectSlack, slackLoading } = useOAuth();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Slack Integration</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Slack className="h-6 w-6 text-blue-600" />
            Connect to Slack
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            Connect your Slack workspace to receive notifications about processed emails
          </p>
        </CardHeader>
        <CardContent>
          {slackStatus?.connected ? (
            <>
              <Alert className="bg-green-50 text-green-800 border-green-200 my-6">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800 font-medium">Slack Connected</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your Slack workspace <strong>{slackStatus.workspace}</strong> is connected successfully
                </AlertDescription>
              </Alert>

              <div className="border rounded-lg p-4 mt-6">
                <h3 className="font-medium mb-2">Integration Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Receive notifications when emails are processed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Get daily and weekly email summaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Directly respond to important emails from Slack</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Alert variant="default" className="my-6 bg-blue-50 border-blue-100">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="font-medium text-blue-800">Not Connected</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Connect your Slack workspace to receive notifications
                </AlertDescription>
              </Alert>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Why connect to Slack?</h3>
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded text-blue-600">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <span>Get notified when important emails arrive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded text-blue-600">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <span>Receive daily summaries of processed emails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded text-blue-600">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <span>Interact with emails directly from Slack</span>
                  </li>
                </ul>

                <Button 
                  onClick={handleConnectSlack}
                  disabled={slackLoading}
                  className="w-full md:w-auto"
                >
                  {slackLoading ? "Connecting..." : "Connect Slack"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SlackIntegration;
