"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Upload,
  FileText,
  Download,
  Brain,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useRouter } from "next/navigation";
import { title } from "process";
import axios from "axios";

interface AnalysisResult {
  sentiment: {
    score: number;
    label: string;
  };
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  riskAssessment: {
    suicideRisk: number;
    depressionRisk: number;
    anxietyRisk: number;
  };
  mentalHealthIndicators: {
    stressLevel: number;
    moodStability: number;
    cognitiveClarity: number;
  };
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function MentalHealthCheck({ userId }: { userId: string }) {
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  // const [Count, SetCount] = useState(0);
  const [Count, setCount] = useState("");
  const router = useRouter();
  const [UserDetails, setUserDetails] = useState({
    _id: "",
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [healthChecksToday, setHealthChecksToday] = useState(0);
  const [result, setResult] = useState<
    { emotion: string; confidence: number }[] | null
  >(null);

  const [mentalHealthResult, setMentalHealthResult] = useState<null | {
    emotions: { emotion: string; confidence: number }[];
    mental_health: {
      suicide_risk: { level: string; percentage: number };
      anxiety: { level: string; percentage: number };
      depression: { level: string; percentage: number };
      stress: { level: string; percentage: number };
      mood_stability: string;
      cognitive_clarity: string;
    };
    sentiment: { label: string; confidence: number };
  }>(null);

  const handleHealthCheck = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/health/health-check/${UserDetails._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setHealthChecksToday(data.healthChecksToday);
        toast({ title: "✅ Health check recorded!", variant: "default" });
      } else {
        toast({
          title: "❌ Error recording health check",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "❌ Something went wrong.", variant: "destructive" });
    }
  };
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognitionRef.current = recognition;

      interface SpeechRecognitionResult {
        [index: number]: {
          transcript: string;
        };
      }

      interface SpeechRecognitionEvent extends Event {
        resultIndex: number;
        results: SpeechRecognitionResult[];
      }

      (recognition as any).onresult = (event: SpeechRecognitionEvent) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setTextInput((prev: string) => prev + " " + transcript);
      };

      interface SpeechRecognitionErrorEvent extends Event {
        error: string;
      }

      (recognition as any).onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        toast({
          title: "Speech Recognition Error",
          description:
            "There was an error with speech recognition. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const handleSpeechToText = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type.startsWith("text/") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".mp3") ||
        file.name.endsWith(".mp4")
      ) {
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setTextInput(content);
        };
        reader.readAsText(file);
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a text file (.txt).",
          variant: "destructive",
        });
      }
    }
  };
  const handleAnalyze = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textInput }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setResult(data.emotions);
      console.log("Analysis Result:", data);
      setMentalHealthResult(data);
    } catch (error) {
      console.error("Fetch error:", error);
      console.log("Something went wrong during analysis.");
    }
  };

  const analyzeText = async () => {
    if (!textInput.trim()) {
      toast({
        title: "No Input",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate API call to AI service
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock analysis result
      const sentimentScoreRaw = mentalHealthResult?.sentiment?.confidence ?? 0;

      let sentimentLabel = mentalHealthResult?.sentiment?.label ?? "Neutral";
      const sentimentScore =
        sentimentLabel === "Negative" ? -sentimentScoreRaw : sentimentScoreRaw;

      const mockResult: AnalysisResult = {
        sentiment: {
          score: sentimentScore,
          label: sentimentLabel,
        },

        emotions: {
          joy: Math.random() * 100,
          sadness: Math.random() * 100,
          anger: Math.random() * 100,
          fear: Math.random() * 100,
          surprise: Math.random() * 100,
        },
        riskAssessment: {
          suicideRisk: mentalHealthResult.mental_health.suicide_risk.percentage,
          depressionRisk:
            mentalHealthResult.mental_health.depression.percentage,
          anxietyRisk: mentalHealthResult.mental_health.anxiety.percentage,
        },
        mentalHealthIndicators: {
          stressLevel: mentalHealthResult.mental_health.stress.percentage,
          moodStability: mentalHealthResult.mental_health.mood_stability,
          cognitiveClarity: mentalHealthResult.mental_health.cognitive_clarity,
        },
      };

      setAnalysisResult(mockResult);
      toast({
        title: "Analysis Complete",
        description: "Your mental health analysis is ready.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description:
          "There was an error analyzing your text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!analysisResult) return;

    const reportContent = `
Mental Health Analysis Report
Generated on: ${new Date().toLocaleDateString()}

SENTIMENT ANALYSIS
Score: ${analysisResult.sentiment.score.toFixed(2)}
Label: ${analysisResult.sentiment.label}

EMOTIONAL ANALYSIS
Joy: ${analysisResult.emotions.joy.toFixed(1)}%
Sadness: ${analysisResult.emotions.sadness.toFixed(1)}%
Anger: ${analysisResult.emotions.anger.toFixed(1)}%
Fear: ${analysisResult.emotions.fear.toFixed(1)}%
Surprise: ${analysisResult.emotions.surprise.toFixed(1)}%

RISK ASSESSMENT
Suicide Risk: ${analysisResult.riskAssessment.suicideRisk.toFixed(1)}%
Depression Risk: ${analysisResult.riskAssessment.depressionRisk.toFixed(1)}%
Anxiety Risk: ${analysisResult.riskAssessment.anxietyRisk.toFixed(1)}%

MENTAL HEALTH INDICATORS
Stress Level: ${analysisResult.mentalHealthIndicators.stressLevel.toFixed(1)}%
Mood Stability: ${analysisResult.mentalHealthIndicators.moodStability.toFixed(
      1
    )}%
Cognitive Clarity: ${analysisResult.mentalHealthIndicators.cognitiveClarity.toFixed(
      1
    )}%

RECOMMENDATIONS
- Consider speaking with a mental health professional
- Practice mindfulness and stress reduction techniques
- Maintain regular sleep and exercise routines
- Stay connected with supportive friends and family
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mental-health-report-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Your mental health report has been downloaded.",
    });
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return "text-green-600";
    if (risk < 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskBadgeColor = (risk: number) => {
    if (risk < 30) return "bg-green-100 text-green-800";
    if (risk < 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#627231"];

  const emotionData = result
    ? result.slice(0, 5).map((item, index) => ({
        name: item.emotion,
        value: item.confidence,
        fill: pieColors[index % pieColors.length],
      }))
    : [];

  const riskData = analysisResult
    ? [
        {
          name: "Suicide Risk",
          value: mentalHealthResult?.mental_health.suicide_risk.percentage,
        },
        {
          name: "Depression Risk",
          value: mentalHealthResult?.mental_health.depression.percentage,
        },
        {
          name: "Anxiety Risk",
          value: mentalHealthResult?.mental_health.anxiety.percentage,
        },
      ]
    : [];

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Unauthorized",
          description: "Please log in to access your profile.",
          variant: "destructive",
        });
        router.push("/auth/login");
        return;
      }

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

        if (!response.ok) {
          console.error("Failed to fetch user details");
          router.push("/auth/login");
          return;
        }

        const data = await response.json();
        console.log("Fetched User Details:", data);
        setUserDetails(data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        router.push("/auth/login");
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI-Powered Mental Health Check
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Analyze your text, speech, or social media posts for mental health
            insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Input Your Content
            </CardTitle>
            <CardDescription>
              Enter text, use speech-to-text, or upload a file for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">Text Input</TabsTrigger>
                <TabsTrigger value="speech">Speech</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-input">Enter your text</Label>
                  <Textarea
                    id="text-input"
                    placeholder="Share your thoughts, feelings, or paste social media posts here..."
                    value={textInput}
                    onChange={(e) => {
                      setTextInput(e.target.value);
                    }}
                    className="min-h-[200px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="speech" className="space-y-4">
                <div className="text-center space-y-4">
                  <Button
                    onClick={handleSpeechToText}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    className="w-full"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="mr-2 h-4 w-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  {isRecording && (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-red-500">Recording...</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to start recording your voice. Your speech will be
                    converted to text automatically.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div className="space-y-4">
                  <Label htmlFor="file-upload">Upload a text file</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Drop files here or click to upload
                        </span>
                        <input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          accept="video/*,application/pdf,text/plain"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        Supports .txt, .pdf, video files up to 10MB
                      </p>
                    </div>
                  </div>
                  {uploadedFile && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <FileText className="h-4 w-4" />
                      <span>{uploadedFile.name}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={() => {
                analyzeText();
                handleAnalyze();
                // setCount((prev) => prev + 1);
                handleHealthCheck();
              }}
              className="w-full"
              disabled={isAnalyzing || !textInput.trim()}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Analyze Mental Health
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-powered insights into your mental health indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!analysisResult ? (
              <div className="text-center py-12">
                <Brain className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-500">
                  Enter some text and click "Analyze Mental Health" to see your
                  results
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Sentiment Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Sentimental Analysis</h3>

                    <Badge
                      variant={
                        analysisResult.sentiment.score > 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {mentalHealthResult?.sentiment.label}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={((analysisResult.sentiment.score + 1) / 2) * 100}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium">
                      {analysisResult.sentiment.score.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div>
                  <h3 className="font-semibold mb-3">Risk Assessment</h3>
                  <div className="space-y-3">
                    {riskData.map((risk, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{risk.name}</span>
                          <Badge className={getRiskBadgeColor(risk.value)}>
                            {risk.value < 30
                              ? "Low"
                              : risk.value < 70
                              ? "Moderate"
                              : "High"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={risk.value} className="flex-1" />
                          <span
                            className={`text-sm font-medium ${getRiskColor(
                              risk.value
                            )}`}
                          >
                            {risk.value.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* High Risk Warning */}
                {analysisResult.riskAssessment.suicideRisk > 70 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-900 dark:text-red-100">
                          High Risk Detected
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                          Our AI has detected concerning patterns. Please
                          consider reaching out for immediate support.
                        </p>
                        <Button
                          size="sm"
                          className="mt-2"
                          variant="destructive"
                        >
                          Get Crisis Support
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={downloadReport}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Charts */}
      {analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotional Analysis</CardTitle>
              <CardDescription>
                Distribution of detected emotions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={emotionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mental Health Indicators</CardTitle>
              <CardDescription>
                Key psychological wellness metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Stress Level</span>
                    <span className="text-sm text-muted-foreground">
                      {analysisResult.mentalHealthIndicators.stressLevel.toFixed(
                        1
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      mentalHealthResult?.mental_health.stress.percentage || 0
                    }
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Mood Stability</span>
                    <span className="text-sm text-muted-foreground"></span>
                  </div>
                  <Label>
                    {analysisResult.mentalHealthIndicators.moodStability}
                  </Label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Cognitive Clarity
                    </span>
                    <span className="text-sm text-muted-foreground"></span>
                  </div>
                  <Label>
                    {analysisResult.mentalHealthIndicators.cognitiveClarity}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
// Remove this: it's not needed. The real useEffect is already imported from React at the top.
// If you want to define a custom hook, use a different name.
// If this was accidentally added by an IDE, just delete it.
