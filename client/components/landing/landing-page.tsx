"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Shield,
  Users,
  Heart,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // router.push("/dashboard");
    }
  }, [user, router]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning algorithms analyze text, speech, and behavioral patterns to detect early signs of mental health concerns.",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description:
        "Your data is encrypted and protected with industry-leading security measures. Anonymous options available.",
    },
    {
      icon: Users,
      title: "Professional Support",
      description:
        "Connect with licensed counselors and mental health professionals when you need human support.",
    },
    {
      icon: Heart,
      title: "24/7 Availability",
      description:
        "Access mental health resources, assessments, and crisis support anytime, anywhere.",
    },
  ];

  const benefits = [
    "Early detection of mental health risks",
    "Personalized mental health insights",
    "Anonymous and confidential support",
    "Crisis intervention and emergency resources",
    "Professional counselor network",
    "Self-assessment tools and tracking",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              MindGuard
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            AI-Powered Mental Health
            <span className="text-purple-600"> Early Detection</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Detect mental health concerns early with advanced AI analysis. Get
            personalized insights, professional support, and resources to
            maintain your mental wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How MindGuard Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with human
            expertise to provide comprehensive mental health support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose MindGuard?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Our platform provides comprehensive mental health support with
                advanced AI technology and professional human care.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Get Started Today
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join thousands of users who trust MindGuard for their mental
                health journey.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="w-full">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6" />
                <span className="text-xl font-bold">MindGuard</span>
              </div>
              <p className="text-gray-400">
                AI-powered mental health early detection and support platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features">Features</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/security">Security</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/crisis">Crisis Support</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/compliance">Compliance</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MindGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
