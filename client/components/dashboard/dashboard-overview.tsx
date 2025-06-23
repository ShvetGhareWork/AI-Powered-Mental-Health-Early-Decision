"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  MessageSquare,
  ClipboardList,
  AlertTriangle,
  Heart,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

const mockMoodData = [
  { date: "2024-01-01", mood: 7, anxiety: 3, stress: 4 },
  { date: "2024-01-02", mood: 6, anxiety: 4, stress: 5 },
  { date: "2024-01-03", mood: 8, anxiety: 2, stress: 3 },
  { date: "2024-01-04", mood: 5, anxiety: 6, stress: 7 },
  { date: "2024-01-05", mood: 7, anxiety: 3, stress: 4 },
  { date: "2024-01-06", mood: 8, anxiety: 2, stress: 2 },
  { date: "2024-01-07", mood: 6, anxiety: 4, stress: 5 },
];

const mockAssessmentData = [
  { category: "Depression", score: 12, maxScore: 27, risk: "Low" },
  { category: "Anxiety", score: 8, maxScore: 21, risk: "Low" },
  { category: "Stress", score: 15, maxScore: 21, risk: "Moderate" },
  { category: "Sleep Quality", score: 6, maxScore: 12, risk: "High" },
];

export function DashboardOverview() {
  const { user } = useAuth();
  const [Name, SetName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user-details`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          SetName(data.name);
          localStorage.setItem("name", data.name);
          console.log(data);
        } else {
          console.error("Failed to fetch user details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {Name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Here's your mental health overview for today
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/mental-health-check">
            <Button>
              <Brain className="mr-2 h-4 w-4" />
              Quick Check
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mental Health Checks
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Completed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Mood</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2/10</div>
            <p className="text-xs text-muted-foreground">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Trends</CardTitle>
            <CardDescription>
              Your mood, anxiety, and stress levels over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockMoodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                  formatter={(value, name) => [
                    value,
                    String(name).charAt(0).toUpperCase() +
                      String(name).slice(1),
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="anxiety"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Results</CardTitle>
            <CardDescription>
              Latest scores from your mental health assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAssessmentData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <Badge className={getRiskColor(item.risk)}>
                      {item.risk} Risk
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={(item.score / item.maxScore) * 100}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest mental health activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Completed daily mood check
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Had a chat session with AI
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Completed anxiety assessment
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>
              Personalized suggestions based on your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Schedule a check-in
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-200">
                      It's been 3 days since your last assessment
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Heart className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Practice mindfulness
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-200">
                      Try a 5-minute breathing exercise
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      Sleep improvement
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-200">
                      Your sleep quality scores suggest room for improvement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to support your mental health journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/mental-health-check">
              <Button variant="outline" className="w-full justify-start">
                <Brain className="mr-2 h-4 w-4" />
                Mental Health Check
              </Button>
            </Link>
            <Link href="/chatbot">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat with AI
              </Button>
            </Link>
            <Link href="/assessment">
              <Button variant="outline" className="w-full justify-start">
                <ClipboardList className="mr-2 h-4 w-4" />
                Take Assessment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
