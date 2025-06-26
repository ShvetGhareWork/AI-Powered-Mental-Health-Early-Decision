"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Shield,
  Bell,
  Accessibility,
  Download,
  Phone,
  Palette,
  Save,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Settings,
  Lock,
  Smartphone,
  Mail,
  MessageSquare,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

interface NotificationSettings {
  dailyReminders: boolean;
  weeklyReports: boolean;
  assessmentReminders: boolean;
  moodReminders: boolean;
  crisisAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  reminderTime: string;
  reminderFrequency: string;
}

interface PrivacySettings {
  dataSharing: boolean;
  anonymousData: boolean;
  researchParticipation: boolean;
  profileVisibility: string;
  shareProgress: boolean;
  allowCounselor: boolean;
}

interface AppSettings {
  theme: string;
  language: string;
  fontSize: string;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  autoSave: boolean;
  offlineMode: boolean;
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const [notifications, setNotifications] = useState<NotificationSettings>({
    dailyReminders: true,
    weeklyReports: true,
    assessmentReminders: true,
    moodReminders: true,
    crisisAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reminderTime: "09:00",
    reminderFrequency: "daily",
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    dataSharing: false,
    anonymousData: true,
    researchParticipation: false,
    profileVisibility: "private",
    shareProgress: false,
    allowCounselor: true,
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: "system",
    language: "en",
    fontSize: "medium",
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    autoSave: true,
    offlineMode: false,
  });

  // Add a default profile object for export and crisis tab
  const profile = {
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 555-123-4567",
    // Add other profile fields as needed
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleExportData = () => {
    // Simulate data export
    const data = {
      profile,
      settings: { notifications, privacy, appSettings },
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mental-health-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-600">
          Manage your account, privacy, and app preferences
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="accessibility"
            className="flex items-center gap-2"
          >
            <Accessibility className="h-4 w-4" />
            <span className="hidden sm:inline">Accessibility</span>
          </TabsTrigger>
          <TabsTrigger value="crisis" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Crisis</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control how your data is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Sharing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Sharing</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Share data with healthcare providers</Label>
                      <p className="text-sm text-gray-600">
                        Allow your data to be shared with your healthcare team
                      </p>
                    </div>
                    <Switch
                      checked={privacy.dataSharing}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, dataSharing: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Anonymous data for research</Label>
                      <p className="text-sm text-gray-600">
                        Help improve mental health research with anonymized data
                      </p>
                    </div>
                    <Switch
                      checked={privacy.anonymousData}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, anonymousData: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Participate in research studies</Label>
                      <p className="text-sm text-gray-600">
                        Receive invitations to participate in mental health
                        research
                      </p>
                    </div>
                    <Switch
                      checked={privacy.researchParticipation}
                      onCheckedChange={(checked) =>
                        setPrivacy({
                          ...privacy,
                          researchParticipation: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Profile Visibility */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Visibility</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Who can see your profile</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) =>
                        setPrivacy({ ...privacy, profileVisibility: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">
                          Private (Only you)
                        </SelectItem>
                        <SelectItem value="counselors">
                          Counselors only
                        </SelectItem>
                        <SelectItem value="support-group">
                          Support group members
                        </SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Share progress with support network</Label>
                      <p className="text-sm text-gray-600">
                        Allow trusted contacts to see your progress
                      </p>
                    </div>
                    <Switch
                      checked={privacy.shareProgress}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, shareProgress: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Allow counselor access</Label>
                      <p className="text-sm text-gray-600">
                        Give your assigned counselor access to your data
                      </p>
                    </div>
                    <Switch
                      checked={privacy.allowCounselor}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, allowCounselor: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Password Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Password & Security
                </h3>
                <div className="space-y-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reminder Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Reminders</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Daily check-in reminders</Label>
                      <p className="text-sm text-gray-600">
                        Get reminded to complete your daily mental health
                        check-in
                      </p>
                    </div>
                    <Switch
                      checked={notifications.dailyReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          dailyReminders: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Mood tracking reminders</Label>
                      <p className="text-sm text-gray-600">
                        Get reminded to log your mood
                      </p>
                    </div>
                    <Switch
                      checked={notifications.moodReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          moodReminders: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Assessment reminders</Label>
                      <p className="text-sm text-gray-600">
                        Get reminded to complete periodic assessments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.assessmentReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          assessmentReminders: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reminder time</Label>
                    <Input
                      type="time"
                      value={notifications.reminderTime}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          reminderTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reminder frequency</Label>
                    <Select
                      value={notifications.reminderFrequency}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          reminderFrequency: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="every-other-day">
                          Every other day
                        </SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notification Channels */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <div>
                        <Label>Email notifications</Label>
                        <p className="text-sm text-gray-600">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <div>
                        <Label>SMS notifications</Label>
                        <p className="text-sm text-gray-600">
                          Receive notifications via text message
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          smsNotifications: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <div>
                        <Label>Push notifications</Label>
                        <p className="text-sm text-gray-600">
                          Receive notifications on your device
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          pushNotifications: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Critical Alerts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Alerts
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-red-800">
                        Crisis detection alerts
                      </Label>
                      <p className="text-sm text-red-600">
                        Receive immediate alerts when crisis indicators are
                        detected
                      </p>
                      <Badge variant="destructive" className="text-xs">
                        Cannot be disabled
                      </Badge>
                    </div>
                    <Switch
                      checked={notifications.crisisAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          crisisAlerts: checked,
                        })
                      }
                      disabled
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Settings */}
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility & Display
              </CardTitle>
              <CardDescription>
                Customize the app to meet your accessibility needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme & Display
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme preference</Label>
                    <Select
                      value={appSettings.theme}
                      onValueChange={(value) =>
                        setAppSettings({ ...appSettings, theme: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Font size</Label>
                    <Select
                      value={appSettings.fontSize}
                      onValueChange={(value) =>
                        setAppSettings({ ...appSettings, fontSize: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={appSettings.language}
                      onValueChange={(value) =>
                        setAppSettings({ ...appSettings, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Accessibility Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Accessibility Features
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>High contrast mode</Label>
                      <p className="text-sm text-gray-600">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Switch
                      checked={appSettings.highContrast}
                      onCheckedChange={(checked) =>
                        setAppSettings({
                          ...appSettings,
                          highContrast: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Reduced motion</Label>
                      <p className="text-sm text-gray-600">
                        Minimize animations and transitions
                      </p>
                    </div>
                    <Switch
                      checked={appSettings.reducedMotion}
                      onCheckedChange={(checked) =>
                        setAppSettings({
                          ...appSettings,
                          reducedMotion: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Screen reader optimization</Label>
                      <p className="text-sm text-gray-600">
                        Optimize interface for screen readers
                      </p>
                    </div>
                    <Switch
                      checked={appSettings.screenReader}
                      onCheckedChange={(checked) =>
                        setAppSettings({
                          ...appSettings,
                          screenReader: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* App Behavior */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">App Behavior</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-save responses</Label>
                      <p className="text-sm text-gray-600">
                        Automatically save your progress
                      </p>
                    </div>
                    <Switch
                      checked={appSettings.autoSave}
                      onCheckedChange={(checked) =>
                        setAppSettings({ ...appSettings, autoSave: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Offline mode</Label>
                      <p className="text-sm text-gray-600">
                        Allow app to work without internet connection
                      </p>
                    </div>
                    <Switch
                      checked={appSettings.offlineMode}
                      onCheckedChange={(checked) =>
                        setAppSettings({ ...appSettings, offlineMode: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crisis Settings */}
        <TabsContent value="crisis" className="space-y-6">
          <Card className="border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Phone className="h-5 w-5" />
                Crisis Support Settings
              </CardTitle>
              <CardDescription className="text-red-600">
                Configure emergency contacts and crisis intervention preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Emergency Contacts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contacts</h3>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-red-800">
                        Crisis Hotlines
                      </h4>
                      <Badge variant="destructive">Always Available</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>National Suicide Prevention Lifeline:</span>
                        <span className="font-mono">988</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crisis Text Line:</span>
                        <span className="font-mono">Text HOME to 741741</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emergency Services:</span>
                        <span className="font-mono">911</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">
                      Personal Emergency Contacts
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Contact</Label>
                        <Input value={profile.emergencyContact} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Phone</Label>
                        <Input value={profile.emergencyPhone} readOnly />
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Emergency Contacts
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Crisis Detection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Crisis Detection</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-800">
                        Automatic Crisis Detection
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Our system monitors your responses and mood patterns to
                        detect potential crisis situations. When detected, we
                        may automatically reach out or provide immediate
                        resources.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Switch checked disabled />
                        <span className="text-sm text-yellow-700">
                          This feature cannot be disabled for your safety
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Crisis Plan */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Crisis Plan</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Warning signs I should watch for</Label>
                    <Textarea
                      placeholder="List personal warning signs that indicate you might be in crisis..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coping strategies that help me</Label>
                    <Textarea
                      placeholder="List coping strategies that have helped you in the past..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>People I can reach out to</Label>
                    <Textarea
                      placeholder="List friends, family, or professionals you can contact..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Professional support contacts</Label>
                    <Textarea
                      placeholder="List your therapist, psychiatrist, or other mental health professionals..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export, backup, or delete your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Export */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Export Your Data</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Download a copy of all your data including assessments, mood
                    entries, and settings.
                  </p>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleExportData}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export All Data
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export Mood Data Only
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Data Backup */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Backup Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Automatic cloud backup</Label>
                      <p className="text-sm text-gray-600">
                        Automatically backup your data to secure cloud storage
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Local device backup</Label>
                      <p className="text-sm text-gray-600">
                        Keep a local backup on your device
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Backup frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Deletion */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-600">
                  Danger Zone
                </h3>
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-red-800">
                        Delete Account
                      </h4>
                      <p className="text-sm text-red-600 mt-1">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline">Cancel</Button>
        <Button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="flex items-center gap-2"
        >
          {saveStatus === "saving" && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          )}
          {saveStatus === "saved" && <CheckCircle className="h-4 w-4" />}
          <Save className="h-4 w-4" />
          {saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "saved"
            ? "Saved!"
            : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
