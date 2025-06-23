"use client";

import type React from "react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Save,
  LogOut,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      reminders: boolean;
      weeklyReports: boolean;
    };
    privacy: {
      anonymousMode: boolean;
      shareDataForResearch: boolean;
      allowCounselorContact: boolean;
    };
    accessibility: {
      fontSize: string;
      highContrast: boolean;
      screenReader: boolean;
    };
  };
  medicalInfo: {
    currentMedications: string;
    allergies: string;
    previousTherapy: boolean;
    currentTherapist: string;
    insuranceProvider: string;
    emergencyConditions: string;
  };
}

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      email: user?.email || "",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1990-01-01",
      gender: "prefer-not-to-say",
      address: {
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        country: "United States",
      },
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Sister",
      phone: "+1 (555) 987-6543",
      email: "jane.doe@example.com",
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        reminders: true,
        weeklyReports: true,
      },
      privacy: {
        anonymousMode: false,
        shareDataForResearch: true,
        allowCounselorContact: true,
      },
      accessibility: {
        fontSize: "medium",
        highContrast: false,
        screenReader: false,
      },
    },
    medicalInfo: {
      currentMedications: "None",
      allergies: "None known",
      previousTherapy: true,
      currentTherapist: "Dr. Sarah Johnson",
      insuranceProvider: "Blue Cross Blue Shield",
      emergencyConditions: "None",
    },
  });

  const handleInputChange = (
    section: keyof ProfileData,
    field: string,
    value: any
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  type NestedKeys = {
    personalInfo: keyof ProfileData["personalInfo"];
    preferences: keyof ProfileData["preferences"];
  };

  const handleNestedInputChange = <
    T extends keyof ProfileData,
    S extends T extends "personalInfo"
      ? keyof ProfileData["personalInfo"]
      : T extends "preferences"
      ? keyof ProfileData["preferences"]
      : never,
    F extends S extends keyof ProfileData[T] ? keyof ProfileData[T][S] : never
  >(
    section: T,
    subsection: S,
    field: F,
    value: any
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      logout();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // In a real app, you would upload to a service like Cloudinary or AWS S3
      const reader = new FileReader();
      reader.onload = (e) => {
        // Update user avatar in context
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your account information and preferences
          </p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profileData.personalInfo.firstName}{" "}
                {profileData.personalInfo.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {profileData.personalInfo.email}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {user?.role}
                </Badge>
                {user?.verified ? (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.personalInfo.firstName}
                  onChange={(e) =>
                    handleInputChange(
                      "personalInfo",
                      "firstName",
                      e.target.value
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.personalInfo.lastName}
                  onChange={(e) =>
                    handleInputChange(
                      "personalInfo",
                      "lastName",
                      e.target.value
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.personalInfo.email}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "email", e.target.value)
                  }
                  className="pl-10"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.personalInfo.phone}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "phone", e.target.value)
                  }
                  className="pl-10"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.personalInfo.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "dateOfBirth",
                        e.target.value
                      )
                    }
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profileData.personalInfo.gender}
                  onValueChange={(value) =>
                    handleInputChange("personalInfo", "gender", value)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <div className="space-y-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Street Address"
                    value={profileData.personalInfo.address.street}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "address",
                        "street",
                        e.target.value
                      )
                    }
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="City"
                    value={profileData.personalInfo.address.city}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "address",
                        "city",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                  />
                  <Input
                    placeholder="State"
                    value={profileData.personalInfo.address.state}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "address",
                        "state",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="ZIP Code"
                    value={profileData.personalInfo.address.zipCode}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "address",
                        "zipCode",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                  />
                  <Input
                    placeholder="Country"
                    value={profileData.personalInfo.address.country}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "personalInfo",
                        "address",
                        "country",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Emergency Contact
            </CardTitle>
            <CardDescription>
              Person to contact in case of emergency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Full Name</Label>
              <Input
                id="emergencyName"
                value={profileData.emergencyContact.name}
                onChange={(e) =>
                  handleInputChange("emergencyContact", "name", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship">Relationship</Label>
              <Select
                value={profileData.emergencyContact.relationship}
                onValueChange={(value) =>
                  handleInputChange("emergencyContact", "relationship", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Phone Number</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={profileData.emergencyContact.phone}
                onChange={(e) =>
                  handleInputChange("emergencyContact", "phone", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyEmail">Email Address</Label>
              <Input
                id="emergencyEmail"
                type="email"
                value={profileData.emergencyContact.email}
                onChange={(e) =>
                  handleInputChange("emergencyContact", "email", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Medical Information
            </CardTitle>
            <CardDescription>
              Health-related information for better care
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                value={profileData.medicalInfo.currentMedications}
                onChange={(e) =>
                  handleInputChange(
                    "medicalInfo",
                    "currentMedications",
                    e.target.value
                  )
                }
                placeholder="List any medications you're currently taking..."
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={profileData.medicalInfo.allergies}
                onChange={(e) =>
                  handleInputChange("medicalInfo", "allergies", e.target.value)
                }
                placeholder="List any known allergies..."
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="therapist">Current Therapist</Label>
              <Input
                id="therapist"
                value={profileData.medicalInfo.currentTherapist}
                onChange={(e) =>
                  handleInputChange(
                    "medicalInfo",
                    "currentTherapist",
                    e.target.value
                  )
                }
                placeholder="Name of your current therapist (if any)"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance Provider</Label>
              <Input
                id="insurance"
                value={profileData.medicalInfo.insuranceProvider}
                onChange={(e) =>
                  handleInputChange(
                    "medicalInfo",
                    "insuranceProvider",
                    e.target.value
                  )
                }
                placeholder="Your insurance provider"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyConditions">
                Emergency Medical Conditions
              </Label>
              <Textarea
                id="emergencyConditions"
                value={profileData.medicalInfo.emergencyConditions}
                onChange={(e) =>
                  handleInputChange(
                    "medicalInfo",
                    "emergencyConditions",
                    e.target.value
                  )
                }
                placeholder="Any conditions emergency responders should know about..."
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={profileData.preferences.notifications.email}
                onCheckedChange={(checked) =>
                  handleNestedInputChange(
                    "preferences",
                    "notifications",
                    "email",
                    checked
                  )
                }
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via text message
                </p>
              </div>
              <Switch
                checked={profileData.preferences.notifications.sms}
                onCheckedChange={(checked) =>
                  handleNestedInputChange(
                    "preferences",
                    "notifications",
                    "sms",
                    checked
                  )
                }
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser push notifications
                </p>
              </div>
              <Switch
                checked={profileData.preferences.notifications.push}
                onCheckedChange={(checked) =>
                  handleNestedInputChange(
                    "preferences",
                    "notifications",
                    "push",
                    checked
                  )
                }
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Assessment Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Reminders for regular mental health check-ins
                </p>
              </div>
              <Switch
                checked={profileData.preferences.notifications.reminders}
                onCheckedChange={(checked) =>
                  handleNestedInputChange(
                    "preferences",
                    "notifications",
                    "reminders",
                    checked
                  )
                }
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Weekly summary of your mental health data
                </p>
              </div>
              <Switch
                checked={profileData.preferences.notifications.weeklyReports}
                onCheckedChange={(checked) =>
                  handleNestedInputChange(
                    "preferences",
                    "notifications",
                    "weeklyReports",
                    checked
                  )
                }
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy & Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Manage your privacy settings and account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Privacy Settings</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anonymous Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use anonymous IDs for assessments and chats
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences.privacy.anonymousMode}
                  onCheckedChange={(checked) =>
                    handleNestedInputChange(
                      "preferences",
                      "privacy",
                      "anonymousMode",
                      checked
                    )
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Data for Research</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve mental health research (anonymized)
                  </p>
                </div>
                <Switch
                  checked={profileData.preferences.privacy.shareDataForResearch}
                  onCheckedChange={(checked) =>
                    handleNestedInputChange(
                      "preferences",
                      "privacy",
                      "shareDataForResearch",
                      checked
                    )
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Counselor Contact</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow counselors to reach out if needed
                  </p>
                </div>
                <Switch
                  checked={
                    profileData.preferences.privacy.allowCounselorContact
                  }
                  onCheckedChange={(checked) =>
                    handleNestedInputChange(
                      "preferences",
                      "privacy",
                      "allowCounselorContact",
                      checked
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Change Password</h3>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={!newPassword || !confirmPassword}
              >
                Update Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Accessibility Settings
          </CardTitle>
          <CardDescription>
            Customize the interface for better accessibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <Select
                value={profileData.preferences.accessibility.fontSize}
                onValueChange={(value) =>
                  handleNestedInputChange(
                    "preferences",
                    "accessibility",
                    "fontSize",
                    value
                  )
                }
                disabled={!isEditing}
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

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                checked={profileData.preferences.accessibility.highContrast}
                onCheckedChange={(checked) =>
                  handleNestedInputChange(
                    "preferences",
                    "accessibility",
                    "highContrast",
                    checked
                  )
                }
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Screen Reader Support</Label>
                <p className="text-sm text-muted-foreground">
                  Enhanced screen reader compatibility
                </p>
              </div>
              <Switch
                checked={profileData.preferences.accessibility.screenReader}
                onCheckedChange={(checked) =>
                  handleNestedInputChange(
                    "preferences",
                    "accessibility",
                    "screenReader",
                    checked
                  )
                }
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              These actions are permanent and cannot be undone. Please proceed
              with caution.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign Out</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to sign out of your account?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowLogoutDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleLogout}>Sign Out</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
