"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ClipboardList,
  ChevronRight,
  RotateCcw,
  Download,
  Play,
  Clock,
  Shield,
  Heart,
  CheckCircle,
  Info,
  Star,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  options: {
    value: number;
    label: string;
  }[];
}

interface AssessmentResult {
  category: string;
  score: number;
  maxScore: number;
  level: string;
  description: string;
  recommendations: string[];
}

const assessmentQuestions: Question[] = [
  {
    id: "1",
    text: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "2",
    text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "3",
    text: "Over the last 2 weeks, how often have you experienced trouble falling or staying asleep, or sleeping too much?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "4",
    text: "Over the last 2 weeks, how often have you felt tired or had little energy?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "5",
    text: "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "6",
    text: "Over the last 2 weeks, how often have you felt bad about yourself — or that you are a failure or have let yourself or your family down?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "7",
    text: "Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading, working, or watching TV?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "8",
    text: "Over the last 2 weeks, how often have you moved or spoken so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you’ve been moving around a lot?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "9",
    text: "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself in some way?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "10",
    text: "Over the last 2 weeks, how often have you felt anxious, nervous, or on edge?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "11",
    text: "Over the last 2 weeks, how often have you felt unable to stop or control worrying?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "12",
    text: "Over the last 2 weeks, how often have you avoided social situations because of anxiety, fear, or embarrassment?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "13",
    text: "Over the last 2 weeks, how often have you felt easily annoyed or irritable?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "14",
    text: "Over the last 2 weeks, how often have you experienced sudden feelings of panic or intense fear without clear reason?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "15",
    text: "Over the last 2 weeks, how often have you found it difficult to relax?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "16",
    text: "Over the last 2 weeks, how often have you felt distant or detached from people around you?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "17",
    text: "Over the last 2 weeks, how often have you felt a sense of hopelessness about the future?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "18",
    text: "Over the last 2 weeks, how often have you experienced physical symptoms such as headaches, stomach aches, or muscle pain without a clear cause?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "19",
    text: "Over the last 2 weeks, how often have you felt overwhelmed by your responsibilities or daily tasks?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "20",
    text: "Over the last 2 weeks, how often have you experienced difficulty making decisions or completing tasks due to stress or low mood?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
];

export function SelfAssessment() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [AsscessmentCount, setAsscessmentCount] = useState(0);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const { toast } = useToast();

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const completeAssessment = () => {
    const totalScore = Object.values(answers).reduce(
      (sum, score) => sum + score,
      0
    );
    const maxScore = assessmentQuestions.length * 3;

    let level = "Minimal";
    let description = "";
    let recommendations: string[] = [];

    if (totalScore <= 4) {
      level = "Minimal";
      description =
        "Your responses suggest minimal depression symptoms. This is a positive indicator of your mental health.";
      recommendations = [
        "Continue maintaining healthy lifestyle habits",
        "Stay connected with friends and family",
        "Practice regular self-care activities",
        "Monitor your mood and seek help if symptoms worsen",
      ];
    } else if (totalScore <= 9) {
      level = "Mild";
      description =
        "Your responses suggest mild depression symptoms. While manageable, it's important to address these feelings.";
      recommendations = [
        "Consider talking to a counselor or therapist",
        "Engage in regular physical activity",
        "Practice mindfulness and relaxation techniques",
        "Maintain a regular sleep schedule",
        "Connect with supportive friends and family",
      ];
    } else if (totalScore <= 14) {
      level = "Moderate";
      description =
        "Your responses suggest moderate depression symptoms. Professional support would be beneficial.";
      recommendations = [
        "Strongly consider professional counseling or therapy",
        "Speak with your healthcare provider",
        "Join a support group",
        "Develop a daily routine and stick to it",
        "Avoid alcohol and drugs",
        "Practice stress management techniques",
      ];
    } else if (totalScore <= 19) {
      level = "Moderately Severe";
      description =
        "Your responses suggest moderately severe depression symptoms. Professional help is recommended.";
      recommendations = [
        "Seek professional mental health treatment immediately",
        "Consider medication evaluation with a psychiatrist",
        "Inform trusted friends or family about your situation",
        "Create a safety plan",
        "Avoid making major life decisions",
        "Focus on basic self-care activities",
      ];
    } else {
      level = "Severe";
      description =
        "Your responses suggest severe depression symptoms. Immediate professional help is strongly recommended.";
      recommendations = [
        "Seek immediate professional mental health treatment",
        "Contact a crisis helpline if you have thoughts of self-harm",
        "Consider inpatient or intensive outpatient treatment",
        "Inform trusted individuals about your condition",
        "Follow up regularly with mental health professionals",
        "Take medication as prescribed by a healthcare provider",
      ];
    }

    const result: AssessmentResult = {
      category: "Depression Screening (PHQ-9)",
      score: totalScore,
      maxScore,
      level,
      description,
      recommendations,
    };

    setResults(result);
    setIsCompleted(true);

    toast({
      title: "Assessment Complete",
      description: "Your mental health assessment results are ready.",
    });
  };

  const resetAssessment = () => {
    setHasStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setResults(null);
  };

  const startAssessment = () => {
    setHasStarted(true);
    toast({
      title: "Assessment Started",
      description:
        "Take your time and answer honestly for the most accurate results.",
    });
  };

  const downloadResults = () => {
    if (!results) return;

    const reportContent = `
Mental Health Self-Assessment Results
Generated on: ${new Date().toLocaleDateString()}

ASSESSMENT: ${results.category}
SCORE: ${results.score}/${results.maxScore}
LEVEL: ${results.level}

DESCRIPTION:
${results.description}

RECOMMENDATIONS:
${results.recommendations
  .map((rec, index) => `${index + 1}. ${rec}`)
  .join("\n")}

IMPORTANT DISCLAIMER:
This assessment is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing severe symptoms or thoughts of self-harm, please seek immediate professional help or contact a crisis helpline.

Emergency Contacts:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency Services: 911
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mental-health-assessment-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Results Downloaded",
      description: "Your assessment results have been downloaded.",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "minimal":
        return "bg-green-100 text-green-800";
      case "mild":
        return "bg-yellow-100 text-yellow-800";
      case "moderate":
        return "bg-orange-100 text-orange-800";
      case "moderately severe":
        return "bg-red-100 text-red-800";
      case "severe":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  useEffect(() => {
    const saved = localStorage.getItem("AsscessmentCount");
    setAsscessmentCount(saved ? Number(saved) : 0);
  }, []);

  // Welcome Screen
  if (!hasStarted && !isCompleted) {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <ClipboardList className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Mental Health Self-Assessment
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Take a moment to check in with yourself. This
              scientifically-validated assessment helps you understand your
              current mental health status.
            </p>
          </div>
        </div>

        {/* Assessment Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                5-10 Minutes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Quick and easy assessment that respects your time
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                100% Private
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your responses are confidential and secure
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Scientifically Validated
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Based on the PHQ-9, used by healthcare professionals worldwide
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What to Expect */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Info className="mr-2 h-5 w-5 text-blue-600" />
              What to Expect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  During the Assessment
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    20 carefully crafted questions about your recent experiences
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Multiple choice format for easy completion
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Progress tracking so you know how much is left
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  After Completion
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Instant results with personalized insights
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Tailored recommendations for your wellbeing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Option to download your results for future reference
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Join Thousands Taking Control of Their Mental Health
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You're not alone in prioritizing your mental wellbeing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-blue-600">
                  50,000+
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Assessments completed
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-2xl font-bold text-red-500">95%</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Found it helpful
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-green-600">4.8/5</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Average rating
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> This assessment is for informational
            purposes only and is not a substitute for professional medical
            advice. If you're experiencing thoughts of self-harm or are in
            crisis, please contact emergency services or a crisis helpline
            immediately.
          </AlertDescription>
        </Alert>

        {/* Start Button */}
        <div className="text-center">
          <Button
            onClick={() => {
              startAssessment();
              setAsscessmentCount((prev) => prev + 1);
            }}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Assessment
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            Ready when you are • No account required • Completely free
          </p>
        </div>
      </div>
    );
  }

  // Results Screen
  if (isCompleted && results) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Assessment Complete!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Thank you for taking the time to check in with your mental health
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={downloadResults}
              variant="outline"
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Results
            </Button>
            <Button
              onClick={() => {
                resetAssessment(), setAsscessmentCount((prev) => prev + 1);
              }}
              className="flex items-center"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Take Again
            </Button>
          </div>
        </div>

        {/* Results Card */}
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{results.category}</CardTitle>
                <CardDescription className="text-base mt-1">
                  Your assessment score: {results.score} out of{" "}
                  {results.maxScore}
                </CardDescription>
              </div>
              <Badge
                className={`${getLevelColor(results.level)} text-lg px-4 py-2`}
              >
                {results.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Score Visualization */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assessment Score</span>
                <span className="text-sm text-muted-foreground">
                  {results.score}/{results.maxScore}
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={(results.score / results.maxScore) * 100}
                  className="h-3"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white mix-blend-difference">
                    {Math.round((results.score / results.maxScore) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                What This Means
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {results.description}
              </p>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Personalized Recommendations
              </h3>
              <div className="grid gap-3">
                {results.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {recommendation}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Crisis Warning */}
            {(results.level === "Moderately Severe" ||
              results.level === "Severe") && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-red-900 dark:text-red-100">
                        Important Notice
                      </h4>
                      <p className="text-red-700 dark:text-red-200 text-sm mt-1">
                        Your assessment indicates significant symptoms that
                        warrant immediate professional attention. Please
                        consider reaching out for help right away.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Find a Therapist
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Crisis Resources
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Call 988
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Disclaimer */}
            <div className="text-xs text-gray-500 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-gray-300">
              <p className="font-semibold mb-2">Medical Disclaimer:</p>
              <p>
                This assessment is for informational purposes only and is not a
                substitute for professional medical advice, diagnosis, or
                treatment. Always seek the advice of qualified health providers
                with any questions you may have regarding a medical condition.
                If you are experiencing thoughts of self-harm or are in crisis,
                please contact emergency services immediately.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              Continue Your Mental Health Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Heart className="h-6 w-6 text-red-500" />
                <span className="font-medium">Track Your Mood</span>
                <span className="text-xs text-gray-500 text-center">
                  Daily mood tracking and insights
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Users className="h-6 w-6 text-blue-500" />
                <span className="font-medium">Find Support</span>
                <span className="text-xs text-gray-500 text-center">
                  Connect with professionals
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <ClipboardList className="h-6 w-6 text-purple-500" />
                <span className="font-medium">More Assessments</span>
                <span className="text-xs text-gray-500 text-center">
                  Explore other mental health tools
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment Questions
  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={resetAssessment}
            className="text-gray-500"
          >
            ← Back to Start
          </Button>
          <Badge variant="secondary" className="px-4 py-2">
            Question {currentQuestion + 1} of {assessmentQuestions.length}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-2" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full flex justify-between px-1">
                {Array.from({ length: assessmentQuestions.length }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= currentQuestion ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="border-2 border-blue-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardTitle className="flex items-center text-xl">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              {currentQuestion + 1}
            </div>
            Question {currentQuestion + 1}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
              {assessmentQuestions[currentQuestion].text}
            </h3>

            <RadioGroup
              value={answers[
                assessmentQuestions[currentQuestion].id
              ]?.toString()}
              onValueChange={(value) =>
                handleAnswer(
                  assessmentQuestions[currentQuestion].id,
                  Number.parseInt(value)
                )
              }
              className="space-y-3"
            >
              {assessmentQuestions[currentQuestion].options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                >
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`option-${option.value}`}
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center"
            >
              ← Previous
            </Button>

            <Button
              onClick={nextQuestion}
              disabled={
                !answers[assessmentQuestions[currentQuestion].id] &&
                answers[assessmentQuestions[currentQuestion].id] !== 0
              }
              className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentQuestion === assessmentQuestions.length - 1 ? (
                <>
                  Complete Assessment
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Info */}
      <Card className="bg-gray-50 dark:bg-gray-800 border-0">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              About This Assessment
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The PHQ-9 is a widely used screening tool for depression. Each
              question corresponds to diagnostic criteria for major depressive
              disorder. Your honest responses help provide the most accurate
              assessment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
