"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Image,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { ConsentModal } from "./consent-modal";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    avatar: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
    },
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    emergencyContactEmail: "",
    currentMedication: "",
    allergies: "",
    therapistName: "",
    insuranceProvider: "",
    emergencyMedicalConditions: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const { register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (field: string, value: string, nested?: string) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and privacy policy.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            avatar: formData.avatar,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            address: {
              line1: formData.line1,
              line2: formData.line2,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
            },
            emergencyContact: {
              name: formData.emergencyContactName,
              relationship: formData.emergencyContactRelationship,
              phoneNumber: formData.emergencyContactPhone,
              email: formData.emergencyContactEmail,
            },
            currentMedication: formData.currentMedication,
            allergies: formData.allergies,
            therapistName: formData.therapistName,
            insuranceProvider: formData.insuranceProvider,
            emergencyMedicalConditions: formData.emergencyMedicalConditions,
          }),
        }
      );
      console.log(response);

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Account created!",
          description: "Welcome to MindGuard. Please log in.",
        });

        // Optional: redirect user to login page
        router.push("/auth/login");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentStep === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    Individual seeking support
                  </SelectItem>
                  <SelectItem value="counselor">Licensed Counselor</SelectItem>
                  <SelectItem value="ngo">NGO/Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Create a password"
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant={"ghost"}
                  size={"sm"}
                  className="absolute right-0 top-0 h-full px-3"
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
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="button" className="w-full" onClick={nextStep}>
              Next
            </Button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Your phone number"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="Prefer not to say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL (optional)</Label>
              <div className="relative">
                <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="avatar"
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => handleInputChange("avatar", e.target.value)}
                  placeholder="https://your-avatar-url"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Address Fields */}
            <div className="space-y-2">
              <Label htmlFor="line1">Address Line 1</Label>
              <Input
                id="line1"
                value={formData.line1}
                onChange={(e) =>
                  handleInputChange("line1", e.target.value, "address")
                }
                placeholder="Street / Building"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="line2">Address Line 2</Label>
              <Input
                id="line2"
                value={formData.line2}
                onChange={(e) =>
                  handleInputChange("line2", e.target.value, "address")
                }
                placeholder="Apartment, Suite, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  handleInputChange("city", e.target.value, "address")
                }
                placeholder="City"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) =>
                  handleInputChange("state", e.target.value, "address")
                }
                placeholder="State"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value, "address")
                }
                placeholder="Postal code"
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            {/* Emergency Contact */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">
                Emergency Contact Name
              </Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  handleInputChange("emergencyContactName", e.target.value)
                }
                placeholder="Contact's name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship">Relationship</Label>
              <Select
                value={formData.emergencyContactRelationship}
                onValueChange={(value) =>
                  handleInputChange("emergencyContactRelationship", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">
                Emergency Contact Phone
              </Label>
              <Input
                id="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  handleInputChange("emergencyContactPhone", e.target.value)
                }
                placeholder="Contact's phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactEmail">
                Emergency Contact Email
              </Label>
              <Input
                id="emergencyContactEmail"
                type="email"
                value={formData.emergencyContactEmail}
                onChange={(e) =>
                  handleInputChange("emergencyContactEmail", e.target.value)
                }
                placeholder="Contact's email"
              />
            </div>

            {/* Medical Info */}
            <div className="space-y-2">
              <Label htmlFor="currentMedication">Current Medication</Label>
              <Textarea
                id="currentMedication"
                value={formData.currentMedication}
                onChange={(e) =>
                  handleInputChange("currentMedication", e.target.value)
                }
                placeholder="List any current medications"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                placeholder="List any allergies"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="therapistName">Therapist's Name</Label>
              <Input
                id="therapistName"
                value={formData.therapistName}
                onChange={(e) =>
                  handleInputChange("therapistName", e.target.value)
                }
                placeholder="Your therapist's name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Input
                id="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={(e) =>
                  handleInputChange("insuranceProvider", e.target.value)
                }
                placeholder="Insurance company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyMedicalConditions">
                Emergency Medical Conditions
              </Label>
              <Textarea
                id="emergencyMedicalConditions"
                value={formData.emergencyMedicalConditions}
                onChange={(e) =>
                  handleInputChange(
                    "emergencyMedicalConditions",
                    e.target.value
                  )
                }
                placeholder="Any known conditions to declare"
              />
            </div>

            {/* Consent & Actions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked as boolean)
                }
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowConsentModal(true)}
                  className="text-blue-600 hover:underline"
                >
                  Terms of Service and Privacy Policy
                </button>
              </Label>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </>
        )}
      </form>

      <ConsentModal
        open={showConsentModal}
        onOpenChange={setShowConsentModal}
        onAccept={() => {
          setAgreedToTerms(true);
          setShowConsentModal(false);
        }}
      />
    </div>
  );
}
