
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getUserSettings, updateUserSettings } from "@/lib/api";
import { RefreshCw, Save } from "lucide-react";

interface UserSettings {
  autoReply: boolean;
  autoReplyPrefix: string;
  slackNotifications: boolean;
  slackChannel: string;
  useWebSearch: boolean;
  maxEmailsPerBatch: number;
}

const defaultSettings: UserSettings = {
  autoReply: false,
  autoReplyPrefix: "[AI Assistant]",
  slackNotifications: false,
  slackChannel: "#email-notifications",
  useWebSearch: true,
  maxEmailsPerBatch: 10
};

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getUserSettings();
      setSettings({
        ...defaultSettings,
        ...data
      });
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      toast({
        variant: "destructive",
        title: "Failed to load settings",
        description: error.message || "An error occurred loading your settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateUserSettings(settings);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "Failed to save your settings",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof UserSettings, value: any) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your Gmail Assistant preferences
        </p>
      </header>

      <div className="grid gap-6">
        {/* Email Reply Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Email Replies</CardTitle>
            <CardDescription>
              Configure how the assistant handles email replies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoReply">Auto Reply</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate and send email replies
                </p>
              </div>
              <Switch
                id="autoReply"
                checked={settings.autoReply}
                onCheckedChange={(checked) => handleChange("autoReply", checked)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="autoReplyPrefix">Reply Prefix</Label>
              <Input
                id="autoReplyPrefix"
                value={settings.autoReplyPrefix}
                onChange={(e) => handleChange("autoReplyPrefix", e.target.value)}
                disabled={loading || !settings.autoReply}
                placeholder="[AI Assistant]"
              />
              <p className="text-xs text-muted-foreground">
                This text will be added to the beginning of automated replies
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Slack Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Slack Notifications</CardTitle>
            <CardDescription>
              Manage how notifications are sent to Slack
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="slackNotifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications to Slack when emails are processed
                </p>
              </div>
              <Switch
                id="slackNotifications"
                checked={settings.slackNotifications}
                onCheckedChange={(checked) => handleChange("slackNotifications", checked)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slackChannel">Slack Channel</Label>
              <Input
                id="slackChannel"
                value={settings.slackChannel}
                onChange={(e) => handleChange("slackChannel", e.target.value)}
                disabled={loading || !settings.slackNotifications}
                placeholder="#email-notifications"
              />
              <p className="text-xs text-muted-foreground">
                Channel where notifications will be sent
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>
              Configure advanced processing options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="useWebSearch">Web Search</Label>
                <p className="text-sm text-muted-foreground">
                  Allow the assistant to search the web for context
                </p>
              </div>
              <Switch
                id="useWebSearch"
                checked={settings.useWebSearch}
                onCheckedChange={(checked) => handleChange("useWebSearch", checked)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxEmailsPerBatch">Max Emails Per Batch</Label>
              <Input
                id="maxEmailsPerBatch"
                type="number"
                min="1"
                max="50"
                value={settings.maxEmailsPerBatch}
                onChange={(e) => handleChange("maxEmailsPerBatch", parseInt(e.target.value) || 10)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of emails to process in a single batch
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={fetchSettings}
            disabled={loading || saving}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={loading || saving}
          >
            {saving ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
