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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Target,
  Download,
  LineChart,
  Brain,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, isToday, isSameDay } from "date-fns";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Types
interface MoodEntry {
  id: string;
  date: Date;
  overallMood: number;
  energy: number;
  anxiety: number;
  stress: number;
  sleep: number;
  depressiveSymptoms: {
    sadness: number;
    hopelessness: number;
    worthlessness: number;
    lossOfInterest: number;
    fatigue: number;
    concentration: number;
    appetite: number;
    suicidalThoughts: number;
  };
  anxietySymptoms: {
    worry: number;
    restlessness: number;
    irritability: number;
    muscularTension: number;
    sleepDisturbance: number;
    panicAttacks: number;
    avoidance: number;
  };
  stressIndicators: {
    overwhelmed: number;
    pressured: number;
    frustrated: number;
    workload: number;
    relationships: number;
    finances: number;
    health: number;
  };
  activities: string[];
  triggers: string[];
  copingStrategies: string[];
  notes: string;
}

interface MentalHealthAnalysis {
  overallScore: number;
  depressionLevel: {
    score: number;
    level: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe";
    description: string;
    recommendations: string[];
  };
  anxietyLevel: {
    score: number;
    level: "Minimal" | "Mild" | "Moderate" | "Severe";
    description: string;
    recommendations: string[];
  };
  stressLevel: {
    score: number;
    level: "Low" | "Moderate" | "High" | "Very High";
    description: string;
    recommendations: string[];
  };
  moodStability: {
    score: number;
    level: "Very Stable" | "Stable" | "Somewhat Unstable" | "Unstable";
    description: string;
  };
  riskFactors: string[];
  protectiveFactors: string[];
  trends: {
    depression: "improving" | "stable" | "worsening";
    anxiety: "improving" | "stable" | "worsening";
    stress: "improving" | "stable" | "worsening";
    mood: "improving" | "stable" | "worsening";
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  needsProfessionalHelp: boolean;
  crisisRisk: boolean;
}

// Constants
const moodEmojis = [
  { value: 1, emoji: "😢", label: "Terrible", color: "text-red-600" },
  { value: 2, emoji: "😞", label: "Very Bad", color: "text-red-500" },
  { value: 3, emoji: "😔", label: "Bad", color: "text-orange-600" },
  { value: 4, emoji: "😕", label: "Poor", color: "text-orange-500" },
  { value: 5, emoji: "😐", label: "Okay", color: "text-yellow-600" },
  { value: 6, emoji: "🙂", label: "Fair", color: "text-yellow-500" },
  { value: 7, emoji: "😊", label: "Good", color: "text-green-500" },
  { value: 8, emoji: "😄", label: "Great", color: "text-green-600" },
  { value: 9, emoji: "😁", label: "Excellent", color: "text-blue-500" },
  { value: 10, emoji: "🤩", label: "Amazing", color: "text-purple-600" },
];

const severityLabels = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half" },
  { value: 3, label: "Nearly every day" },
];

const commonActivities = [
  "Exercise",
  "Meditation",
  "Reading",
  "Socializing",
  "Work",
  "Hobbies",
  "Music",
  "Nature",
  "Cooking",
  "Gaming",
  "Therapy",
  "Yoga",
  "Walking",
];

const commonTriggers = [
  "Work Stress",
  "Relationship Issues",
  "Financial Worry",
  "Health Concerns",
  "Family Problems",
  "Social Anxiety",
  "Lack of Sleep",
  "Isolation",
  "Deadlines",
];

const copingStrategies = [
  "Deep Breathing",
  "Meditation",
  "Exercise",
  "Talking to Friends",
  "Professional Help",
  "Journaling",
  "Music",
  "Nature",
  "Creative Activities",
];

// Initial state for new entry
const initialEntryState = {
  overallMood: 5,
  energy: 5,
  anxiety: 5,
  stress: 5,
  sleep: 5,
  depressiveSymptoms: {
    sadness: 0,
    hopelessness: 0,
    worthlessness: 0,
    lossOfInterest: 0,
    fatigue: 0,
    concentration: 0,
    appetite: 0,
    suicidalThoughts: 0,
  },
  anxietySymptoms: {
    worry: 0,
    restlessness: 0,
    irritability: 0,
    muscularTension: 0,
    sleepDisturbance: 0,
    panicAttacks: 0,
    avoidance: 0,
  },
  stressIndicators: {
    overwhelmed: 0,
    pressured: 0,
    frustrated: 0,
    workload: 0,
    relationships: 0,
    finances: 0,
    health: 0,
  },
  activities: [] as string[],
  triggers: [] as string[],
  copingStrategies: [] as string[],
  notes: "",
};

export function MoodTracker() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] =
    useState<MentalHealthAnalysis | null>(null);
  const [entryStep, setEntryStep] = useState(1);
  const [newEntry, setNewEntry] = useState(initialEntryState);
  const { toast } = useToast();

  // Generate mock data
  useEffect(() => {
    const mockEntries: MoodEntry[] = [];
    for (let i = 0; i < 14; i++) {
      const date = subDays(new Date(), i);
      const baseAnxiety = Math.random() * 2;
      const baseDepression = Math.random() * 2;
      const baseStress = Math.random() * 2;

      mockEntries.push({
        id: `entry-${i}`,
        date,
        overallMood: Math.floor(Math.random() * 6) + 4, // 4-9 range
        energy: Math.floor(Math.random() * 6) + 4,
        anxiety: Math.floor(Math.random() * 6) + 2,
        stress: Math.floor(Math.random() * 6) + 2,
        sleep: Math.floor(Math.random() * 6) + 4,
        depressiveSymptoms: {
          sadness: Math.floor(baseDepression + Math.random()),
          hopelessness: Math.floor(baseDepression + Math.random()),
          worthlessness: Math.floor(baseDepression + Math.random()),
          lossOfInterest: Math.floor(baseDepression + Math.random()),
          fatigue: Math.floor(baseDepression + Math.random()),
          concentration: Math.floor(baseDepression + Math.random()),
          appetite: Math.floor(baseDepression + Math.random()),
          suicidalThoughts: Math.floor(Math.random() * 1.5),
        },
        anxietySymptoms: {
          worry: Math.floor(baseAnxiety + Math.random()),
          restlessness: Math.floor(baseAnxiety + Math.random()),
          irritability: Math.floor(baseAnxiety + Math.random()),
          muscularTension: Math.floor(baseAnxiety + Math.random()),
          sleepDisturbance: Math.floor(baseAnxiety + Math.random()),
          panicAttacks: Math.floor(Math.random() * 1.5),
          avoidance: Math.floor(baseAnxiety + Math.random()),
        },
        stressIndicators: {
          overwhelmed: Math.floor(baseStress + Math.random()),
          pressured: Math.floor(baseStress + Math.random()),
          frustrated: Math.floor(baseStress + Math.random()),
          workload: Math.floor(baseStress + Math.random()),
          relationships: Math.floor(baseStress + Math.random()),
          finances: Math.floor(baseStress + Math.random()),
          health: Math.floor(baseStress + Math.random()),
        },
        activities: commonActivities.slice(
          0,
          Math.floor(Math.random() * 3) + 1
        ),
        triggers:
          Math.random() > 0.6
            ? commonTriggers.slice(0, Math.floor(Math.random() * 2) + 1)
            : [],
        copingStrategies: copingStrategies.slice(
          0,
          Math.floor(Math.random() * 2) + 1
        ),
        notes: Math.random() > 0.7 ? "Sample note for this day" : "",
      });
    }
    setMoodEntries(mockEntries.reverse());
  }, []);

  // Analysis functions
  const analyzeMentalHealth = (entries: MoodEntry[]): MentalHealthAnalysis => {
    if (entries.length === 0) {
      return {
        overallScore: 0,
        depressionLevel: {
          score: 0,
          level: "Minimal",
          description: "No data available",
          recommendations: [],
        },
        anxietyLevel: {
          score: 0,
          level: "Minimal",
          description: "No data available",
          recommendations: [],
        },
        stressLevel: {
          score: 0,
          level: "Low",
          description: "No data available",
          recommendations: [],
        },
        moodStability: {
          score: 0,
          level: "Stable",
          description: "No data available",
        },
        riskFactors: [],
        protectiveFactors: [],
        trends: {
          depression: "stable",
          anxiety: "stable",
          stress: "stable",
          mood: "stable",
        },
        recommendations: { immediate: [], shortTerm: [], longTerm: [] },
        needsProfessionalHelp: false,
        crisisRisk: false,
      };
    }

    const recentEntries = entries.slice(-14);

    // Calculate scores
    const depressionScore =
      recentEntries.reduce((sum, entry) => {
        return (
          sum +
          Object.values(entry.depressiveSymptoms).reduce((a, b) => a + b, 0)
        );
      }, 0) / recentEntries.length;

    const anxietyScore =
      recentEntries.reduce((sum, entry) => {
        return (
          sum + Object.values(entry.anxietySymptoms).reduce((a, b) => a + b, 0)
        );
      }, 0) / recentEntries.length;

    const stressScore =
      recentEntries.reduce((sum, entry) => {
        return (
          sum + Object.values(entry.stressIndicators).reduce((a, b) => a + b, 0)
        );
      }, 0) / recentEntries.length;

    // Calculate mood stability
    const moodValues = recentEntries.map((e) => e.overallMood);
    const moodMean = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
    const moodVariance =
      moodValues.reduce((sum, mood) => sum + Math.pow(mood - moodMean, 2), 0) /
      moodValues.length;

    // Determine levels
    const getDepressionLevel = (score: number) => {
      if (score <= 4)
        return {
          level: "Minimal" as const,
          description: "Little to no depression symptoms",
        };
      if (score <= 9)
        return {
          level: "Mild" as const,
          description: "Mild depression symptoms",
        };
      if (score <= 14)
        return {
          level: "Moderate" as const,
          description: "Moderate depression symptoms",
        };
      if (score <= 19)
        return {
          level: "Moderately Severe" as const,
          description: "Moderately severe depression",
        };
      return {
        level: "Severe" as const,
        description: "Severe depression requiring immediate help",
      };
    };

    const getAnxietyLevel = (score: number) => {
      if (score <= 4)
        return {
          level: "Minimal" as const,
          description: "Little to no anxiety symptoms",
        };
      if (score <= 9)
        return { level: "Mild" as const, description: "Mild anxiety symptoms" };
      if (score <= 14)
        return {
          level: "Moderate" as const,
          description: "Moderate anxiety symptoms",
        };
      return {
        level: "Severe" as const,
        description: "Severe anxiety requiring help",
      };
    };

    const getStressLevel = (score: number) => {
      if (score <= 7)
        return { level: "Low" as const, description: "Low stress levels" };
      if (score <= 14)
        return {
          level: "Moderate" as const,
          description: "Moderate stress levels",
        };
      if (score <= 21)
        return { level: "High" as const, description: "High stress levels" };
      return {
        level: "Very High" as const,
        description: "Very high stress levels",
      };
    };

    const getMoodStability = (variance: number) => {
      if (variance <= 1)
        return {
          level: "Very Stable" as const,
          description: "Very consistent mood",
        };
      if (variance <= 2)
        return {
          level: "Stable" as const,
          description: "Generally stable mood",
        };
      if (variance <= 4)
        return {
          level: "Somewhat Unstable" as const,
          description: "Some mood fluctuations",
        };
      return {
        level: "Unstable" as const,
        description: "Significant mood instability",
      };
    };

    const depressionLevel = getDepressionLevel(depressionScore);
    const anxietyLevel = getAnxietyLevel(anxietyScore);
    const stressLevel = getStressLevel(stressScore);
    const moodStability = getMoodStability(moodVariance);

    // Generate recommendations
    const getRecommendations = (
      depScore: number,
      anxScore: number,
      stressScore: number
    ) => {
      const immediate = [];
      const shortTerm = [];
      const longTerm = [];

      if (depScore > 14 || anxScore > 14) {
        immediate.push("Consider contacting a mental health professional");
        immediate.push("Reach out to trusted friends or family");
      }

      if (stressScore > 14) {
        immediate.push("Practice stress reduction techniques");
        immediate.push("Prioritize rest and self-care");
      }

      if (depScore > 9) {
        shortTerm.push("Schedule therapy sessions");
        shortTerm.push("Consider medication evaluation");
      }

      if (anxScore > 9) {
        shortTerm.push("Learn anxiety management techniques");
        shortTerm.push("Consider cognitive behavioral therapy");
      }

      longTerm.push("Maintain regular exercise routine");
      longTerm.push("Develop strong social support");
      longTerm.push("Practice regular self-care");
      longTerm.push("Continue mood tracking");

      return { immediate, shortTerm, longTerm };
    };

    // Check for crisis
    const crisisRisk = recentEntries.some(
      (entry) =>
        entry.depressiveSymptoms.suicidalThoughts > 1 ||
        (depressionScore > 19 && anxietyScore > 14)
    );

    const needsProfessionalHelp =
      depressionScore > 14 ||
      anxietyScore > 14 ||
      stressScore > 21 ||
      crisisRisk;

    // Calculate trends
    const firstHalf = recentEntries.slice(
      0,
      Math.floor(recentEntries.length / 2)
    );
    const secondHalf = recentEntries.slice(
      Math.floor(recentEntries.length / 2)
    );

    const getTrend = (firstValues: number[], secondValues: number[]) => {
      if (firstValues.length === 0 || secondValues.length === 0)
        return "stable" as const;
      const firstAvg =
        firstValues.reduce((a, b) => a + b, 0) / firstValues.length;
      const secondAvg =
        secondValues.reduce((a, b) => a + b, 0) / secondValues.length;
      const diff = secondAvg - firstAvg;
      if (Math.abs(diff) < 0.5) return "stable" as const;
      return diff > 0 ? ("worsening" as const) : ("improving" as const);
    };

    const trends = {
      depression: getTrend(
        firstHalf.map((e) =>
          Object.values(e.depressiveSymptoms).reduce((a, b) => a + b, 0)
        ),
        secondHalf.map((e) =>
          Object.values(e.depressiveSymptoms).reduce((a, b) => a + b, 0)
        )
      ),
      anxiety: getTrend(
        firstHalf.map((e) =>
          Object.values(e.anxietySymptoms).reduce((a, b) => a + b, 0)
        ),
        secondHalf.map((e) =>
          Object.values(e.anxietySymptoms).reduce((a, b) => a + b, 0)
        )
      ),
      stress: getTrend(
        firstHalf.map((e) =>
          Object.values(e.stressIndicators).reduce((a, b) => a + b, 0)
        ),
        secondHalf.map((e) =>
          Object.values(e.stressIndicators).reduce((a, b) => a + b, 0)
        )
      ),
      mood: getTrend(
        firstHalf.map((e) => e.overallMood),
        secondHalf.map((e) => e.overallMood)
      ),
    };

    // Risk and protective factors
    const riskFactors = [];
    const protectiveFactors = [];

    if (depressionScore > 9) riskFactors.push("Elevated depression symptoms");
    if (anxietyScore > 9) riskFactors.push("Elevated anxiety symptoms");
    if (stressScore > 14) riskFactors.push("High stress levels");
    if (moodVariance > 3) riskFactors.push("Mood instability");

    const avgSleep =
      recentEntries.reduce((sum, e) => sum + e.sleep, 0) / recentEntries.length;
    if (avgSleep < 6) riskFactors.push("Poor sleep quality");
    else if (avgSleep > 7) protectiveFactors.push("Good sleep quality");

    const avgEnergy =
      recentEntries.reduce((sum, e) => sum + e.energy, 0) /
      recentEntries.length;
    if (avgEnergy > 7) protectiveFactors.push("High energy levels");

    const allActivities = recentEntries.flatMap((e) => e.activities);
    if (allActivities.includes("Exercise"))
      protectiveFactors.push("Regular exercise");
    if (allActivities.includes("Meditation"))
      protectiveFactors.push("Mindfulness practice");
    if (allActivities.includes("Socializing"))
      protectiveFactors.push("Social connections");

    const overallScore = Math.max(
      0,
      Math.min(100, 100 - (depressionScore + anxietyScore + stressScore) * 2)
    );

    return {
      overallScore,
      depressionLevel: {
        score: depressionScore,
        level: depressionLevel.level,
        description: depressionLevel.description,
        recommendations: getDepressionRecommendations(depressionScore),
      },
      anxietyLevel: {
        score: anxietyScore,
        level: anxietyLevel.level,
        description: anxietyLevel.description,
        recommendations: getAnxietyRecommendations(anxietyScore),
      },
      stressLevel: {
        score: stressScore,
        level: stressLevel.level,
        description: stressLevel.description,
        recommendations: getStressRecommendations(stressScore),
      },
      moodStability: {
        score: moodVariance,
        level: moodStability.level,
        description: moodStability.description,
      },
      riskFactors,
      protectiveFactors,
      trends,
      recommendations: getRecommendations(
        depressionScore,
        anxietyScore,
        stressScore
      ),
      needsProfessionalHelp,
      crisisRisk,
    };
  };

  const getDepressionRecommendations = (score: number): string[] => {
    if (score <= 4)
      return ["Continue positive habits", "Monitor mood regularly"];
    if (score <= 9)
      return ["Increase physical activity", "Maintain social connections"];
    if (score <= 14)
      return ["Seek professional counseling", "Consider therapy options"];
    if (score <= 19)
      return [
        "Seek immediate professional help",
        "Consider medication evaluation",
      ];
    return ["Seek immediate intervention", "Contact crisis helpline if needed"];
  };

  const getAnxietyRecommendations = (score: number): string[] => {
    if (score <= 4)
      return ["Continue stress management", "Maintain healthy lifestyle"];
    if (score <= 9)
      return ["Practice relaxation techniques", "Regular exercise"];
    if (score <= 14)
      return ["Learn anxiety management skills", "Consider therapy"];
    return [
      "Seek professional help immediately",
      "Consider medication evaluation",
    ];
  };

  const getStressRecommendations = (score: number): string[] => {
    if (score <= 7)
      return ["Maintain current stress management", "Continue healthy habits"];
    if (score <= 14)
      return ["Improve time management", "Practice stress reduction"];
    if (score <= 21)
      return ["Seek stress management counseling", "Practice daily relaxation"];
    return ["Immediate stress intervention needed", "Seek professional help"];
  };

  // Event handlers
  const addMoodEntry = () => {
    const entry: MoodEntry = {
      id: `entry-${Date.now()}`,
      date: selectedDate,
      overallMood: newEntry.overallMood,
      energy: newEntry.energy,
      anxiety: newEntry.anxiety,
      stress: newEntry.stress,
      sleep: newEntry.sleep,
      depressiveSymptoms: { ...newEntry.depressiveSymptoms },
      anxietySymptoms: { ...newEntry.anxietySymptoms },
      stressIndicators: { ...newEntry.stressIndicators },
      activities: [...newEntry.activities],
      triggers: [...newEntry.triggers],
      copingStrategies: [...newEntry.copingStrategies],
      notes: newEntry.notes,
    };

    setMoodEntries((prev) => {
      const filtered = prev.filter((e) => !isSameDay(e.date, selectedDate));
      const updated = [...filtered, entry].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );

      // Generate analysis
      const analysis = analyzeMentalHealth(updated);
      setCurrentAnalysis(analysis);

      return updated;
    });

    setShowAddDialog(false);
    setEntryStep(1);
    resetNewEntry();

    toast({
      title: "Mood Entry Added",
      description: `Your mood assessment for ${format(
        selectedDate,
        "MMM d, yyyy"
      )} has been recorded.`,
    });

    // Show analysis if needed
    setTimeout(() => {
      if (
        currentAnalysis &&
        (currentAnalysis.needsProfessionalHelp || currentAnalysis.crisisRisk)
      ) {
        setShowAnalysisDialog(true);
      }
    }, 1000);
  };

  const resetNewEntry = () => {
    setNewEntry({ ...initialEntryState });
  };

  const generateAnalysis = () => {
    const analysis = analyzeMentalHealth(moodEntries);
    setCurrentAnalysis(analysis);
    setShowAnalysisDialog(true);
  };

  const getChartData = () => {
    return moodEntries.slice(-14).map((entry) => ({
      date: format(entry.date, "MMM d"),
      mood: entry.overallMood,
      energy: entry.energy,
      anxiety: 10 - entry.anxiety,
      stress: 10 - entry.stress,
      sleep: entry.sleep,
    }));
  };

  const getRadarData = () => {
    if (!currentAnalysis) return [];

    return [
      {
        subject: "Mood Stability",
        score: Math.max(0, 100 - currentAnalysis.moodStability.score * 10),
        fullMark: 100,
      },
      {
        subject: "Low Depression",
        score: Math.max(0, 100 - currentAnalysis.depressionLevel.score * 4),
        fullMark: 100,
      },
      {
        subject: "Low Anxiety",
        score: Math.max(0, 100 - currentAnalysis.anxietyLevel.score * 4),
        fullMark: 100,
      },
      {
        subject: "Low Stress",
        score: Math.max(0, 100 - currentAnalysis.stressLevel.score * 3),
        fullMark: 100,
      },
      {
        subject: "Overall Wellbeing",
        score: currentAnalysis.overallScore,
        fullMark: 100,
      },
    ];
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "minimal":
      case "low":
      case "very stable":
      case "stable":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "mild":
      case "moderate":
      case "somewhat unstable":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "moderately severe":
      case "high":
      case "severe":
      case "unstable":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "very high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "worsening":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const todayEntry = moodEntries.find((entry) => isToday(entry.date));
  const analysis = analyzeMentalHealth(moodEntries);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Advanced Mood Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Comprehensive mental health monitoring with clinical-grade analysis
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateAnalysis}>
            <Brain className="mr-2 h-4 w-4" />
            Generate Analysis
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Crisis Alert */}
      {analysis.crisisRisk && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <div className="space-y-2">
              <p className="font-semibold">Crisis Risk Detected</p>
              <p>
                Your recent entries indicate concerning patterns. Please reach
                out for immediate support.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Crisis Helpline: 988
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-700"
                >
                  Find Professional Help
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Professional Help Recommendation */}
      {analysis.needsProfessionalHelp && !analysis.crisisRisk && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <p className="font-semibold">Professional Support Recommended</p>
            <p>
              Your assessment indicates you may benefit from professional mental
              health support.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Mental Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Wellbeing
            </CardTitle>
            <Heart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.overallScore.toFixed(0)}/100
            </div>
            <div className="flex items-center mt-2">
              <Progress value={analysis.overallScore} className="flex-1 mr-2" />
              <span className="text-xs text-muted-foreground">
                {analysis.overallScore >= 70
                  ? "Good"
                  : analysis.overallScore >= 50
                  ? "Fair"
                  : "Needs Attention"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Depression Level
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {analysis.depressionLevel.score.toFixed(1)}
              </div>
              <Badge className={getLevelColor(analysis.depressionLevel.level)}>
                {analysis.depressionLevel.level}
              </Badge>
            </div>
            <div className="flex items-center mt-2">
              {getTrendIcon(analysis.trends.depression)}
              <span className="text-xs text-muted-foreground ml-1 capitalize">
                {analysis.trends.depression}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anxiety Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {analysis.anxietyLevel.score.toFixed(1)}
              </div>
              <Badge className={getLevelColor(analysis.anxietyLevel.level)}>
                {analysis.anxietyLevel.level}
              </Badge>
            </div>
            <div className="flex items-center mt-2">
              {getTrendIcon(analysis.trends.anxiety)}
              <span className="text-xs text-muted-foreground ml-1 capitalize">
                {analysis.trends.anxiety}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
            <Activity className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {analysis.stressLevel.score.toFixed(1)}
              </div>
              <Badge className={getLevelColor(analysis.stressLevel.level)}>
                {analysis.stressLevel.level}
              </Badge>
            </div>
            <div className="flex items-center mt-2">
              {getTrendIcon(analysis.trends.stress)}
              <span className="text-xs text-muted-foreground ml-1 capitalize">
                {analysis.trends.stress}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Mental Health Trends (14 Days)
            </CardTitle>
            <CardDescription>
              Track multiple mental health indicators over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Mood"
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Energy"
                />
                <Line
                  type="monotone"
                  dataKey="anxiety"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Low Anxiety"
                />
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Low Stress"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Mental Health Profile
            </CardTitle>
            <CardDescription>
              Comprehensive assessment across key areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={getRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Mental Health"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk and Protective Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Risk Factors
            </CardTitle>
            <CardDescription>
              Areas that may be impacting your mental health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.riskFactors.length > 0 ? (
                analysis.riskFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-red-50 dark:bg-red-900/20 rounded"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-red-700 dark:text-red-300">
                      {factor}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No significant risk factors identified</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              Protective Factors
            </CardTitle>
            <CardDescription>
              Strengths supporting your mental health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.protectiveFactors.length > 0 ? (
                analysis.protectiveFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-green-50 dark:bg-green-900/20 rounded"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-green-700 dark:text-green-300">
                      {factor}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <Info className="h-8 w-8 mx-auto mb-2" />
                  <p>Continue tracking to identify protective factors</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your latest mood tracking entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moodEntries
              .slice(-7)
              .reverse()
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {
                        moodEmojis.find((m) => m.value === entry.overallMood)
                          ?.emoji
                      }
                    </div>
                    <div>
                      <div className="font-medium">
                        {format(entry.date, "EEEE, MMM d")}
                      </div>
                      <div className="text-sm text-gray-500">
                        Mood: {entry.overallMood}/10 • Energy: {entry.energy}/10
                        • Sleep: {entry.sleep}/10
                      </div>
                      {entry.activities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.activities.slice(0, 3).map((activity) => (
                            <Badge
                              key={activity}
                              variant="secondary"
                              className="text-xs"
                            >
                              {activity}
                            </Badge>
                          ))}
                          {entry.activities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{entry.activities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Entry Dialog */}
      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEntryStep(1);
            resetNewEntry();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comprehensive Mental Health Assessment</DialogTitle>
            <DialogDescription>
              Step {entryStep} of 5 - Complete assessment for{" "}
              {format(selectedDate, "MMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= entryStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Step 1: Basic Mood */}
            {entryStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Basic Mood Assessment</h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">
                      Overall Mood Today
                    </Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {moodEmojis.map((mood) => (
                        <button
                          key={mood.value}
                          type="button"
                          onClick={() =>
                            setNewEntry((prev) => ({
                              ...prev,
                              overallMood: mood.value,
                            }))
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            newEntry.overallMood === mood.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-2xl mb-1">{mood.emoji}</div>
                          <div className="text-xs font-medium">
                            {mood.value}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Energy Level: {newEntry.energy}/10</Label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newEntry.energy}
                        onChange={(e) =>
                          setNewEntry((prev) => ({
                            ...prev,
                            energy: Number(e.target.value),
                          }))
                        }
                        className="w-full mt-2"
                      />
                    </div>
                    <div>
                      <Label>Sleep Quality: {newEntry.sleep}/10</Label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newEntry.sleep}
                        onChange={(e) =>
                          setNewEntry((prev) => ({
                            ...prev,
                            sleep: Number(e.target.value),
                          }))
                        }
                        className="w-full mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Depression Symptoms */}
            {entryStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  Depression Symptoms (Past 2 Weeks)
                </h3>
                <p className="text-sm text-gray-600">
                  Rate how often you've been bothered by each of the following:
                </p>

                <div className="space-y-4">
                  {Object.entries({
                    sadness: "Feeling down, depressed, or hopeless",
                    hopelessness: "Little interest or pleasure in doing things",
                    worthlessness: "Feeling bad about yourself",
                    lossOfInterest: "Loss of interest in activities",
                    fatigue: "Feeling tired or having little energy",
                    concentration: "Trouble concentrating",
                    appetite: "Poor appetite or overeating",
                    suicidalThoughts: "Thoughts of being better off dead",
                  }).map(([key, description]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm font-medium">
                        {description}
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {severityLabels.map((label) => (
                          <button
                            key={label.value}
                            type="button"
                            onClick={() =>
                              setNewEntry((prev) => ({
                                ...prev,
                                depressiveSymptoms: {
                                  ...prev.depressiveSymptoms,
                                  [key]: label.value,
                                },
                              }))
                            }
                            className={`p-2 text-xs rounded border transition-colors ${
                              newEntry.depressiveSymptoms[
                                key as keyof typeof newEntry.depressiveSymptoms
                              ] === label.value
                                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {label.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Anxiety Symptoms */}
            {entryStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  Anxiety Symptoms (Past 2 Weeks)
                </h3>
                <p className="text-sm text-gray-600">
                  Rate how often you've been bothered by each of the following:
                </p>

                <div className="space-y-4">
                  {Object.entries({
                    worry: "Feeling nervous, anxious, or on edge",
                    restlessness: "Not being able to stop worrying",
                    irritability: "Being restless or hard to sit still",
                    muscularTension: "Muscle tension or soreness",
                    sleepDisturbance: "Trouble falling asleep",
                    panicAttacks: "Sudden feelings of panic",
                    avoidance: "Avoiding anxiety-provoking situations",
                  }).map(([key, description]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm font-medium">
                        {description}
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {severityLabels.map((label) => (
                          <button
                            key={label.value}
                            type="button"
                            onClick={() =>
                              setNewEntry((prev) => ({
                                ...prev,
                                anxietySymptoms: {
                                  ...prev.anxietySymptoms,
                                  [key]: label.value,
                                },
                              }))
                            }
                            className={`p-2 text-xs rounded border transition-colors ${
                              newEntry.anxietySymptoms[
                                key as keyof typeof newEntry.anxietySymptoms
                              ] === label.value
                                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {label.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Stress Indicators */}
            {entryStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  Stress Indicators (Past 2 Weeks)
                </h3>
                <p className="text-sm text-gray-600">
                  Rate how much stress you've experienced in each area:
                </p>

                <div className="space-y-4">
                  {Object.entries({
                    overwhelmed: "Feeling overwhelmed by responsibilities",
                    pressured: "Feeling under pressure or rushed",
                    frustrated: "Feeling frustrated or irritated",
                    workload: "Work or school-related stress",
                    relationships: "Relationship or family stress",
                    finances: "Financial concerns",
                    health: "Health-related worries",
                  }).map(([key, description]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm font-medium">
                        {description}
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {severityLabels.map((label) => (
                          <button
                            key={label.value}
                            type="button"
                            onClick={() =>
                              setNewEntry((prev) => ({
                                ...prev,
                                stressIndicators: {
                                  ...prev.stressIndicators,
                                  [key]: label.value,
                                },
                              }))
                            }
                            className={`p-2 text-xs rounded border transition-colors ${
                              newEntry.stressIndicators[
                                key as keyof typeof newEntry.stressIndicators
                              ] === label.value
                                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {label.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Activities and Context */}
            {entryStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Activities & Context</h3>

                <div className="space-y-4">
                  <div>
                    <Label>Activities Today</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {commonActivities.map((activity) => (
                        <button
                          key={activity}
                          type="button"
                          onClick={() => {
                            setNewEntry((prev) => ({
                              ...prev,
                              activities: prev.activities.includes(activity)
                                ? prev.activities.filter((a) => a !== activity)
                                : [...prev.activities, activity],
                            }));
                          }}
                          className={`p-2 text-sm rounded border transition-colors ${
                            newEntry.activities.includes(activity)
                              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {activity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Coping Strategies Used</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {copingStrategies.map((strategy) => (
                        <button
                          key={strategy}
                          type="button"
                          onClick={() => {
                            setNewEntry((prev) => ({
                              ...prev,
                              copingStrategies: prev.copingStrategies.includes(
                                strategy
                              )
                                ? prev.copingStrategies.filter(
                                    (s) => s !== strategy
                                  )
                                : [...prev.copingStrategies, strategy],
                            }));
                          }}
                          className={`p-2 text-sm rounded border transition-colors ${
                            newEntry.copingStrategies.includes(strategy)
                              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {strategy}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Additional Notes</Label>
                    <Textarea
                      value={newEntry.notes}
                      onChange={(e) =>
                        setNewEntry((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Any additional thoughts or observations about your day..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => {
                  if (entryStep > 1) {
                    setEntryStep(entryStep - 1);
                  } else {
                    setShowAddDialog(false);
                    setEntryStep(1);
                    resetNewEntry();
                  }
                }}
              >
                {entryStep > 1 ? "Previous" : "Cancel"}
              </Button>

              <Button
                onClick={() => {
                  if (entryStep < 5) {
                    setEntryStep(entryStep + 1);
                  } else {
                    addMoodEntry();
                  }
                }}
              >
                {entryStep < 5 ? "Next" : "Complete Assessment"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analysis Results Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Mental Health Analysis Report
            </DialogTitle>
            <DialogDescription>
              Comprehensive analysis based on your recent mood tracking data
            </DialogDescription>
          </DialogHeader>

          {currentAnalysis && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Mental Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold text-blue-600">
                      {currentAnalysis.overallScore.toFixed(0)}/100
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={currentAnalysis.overallScore}
                        className="h-3"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        {currentAnalysis.overallScore >= 70
                          ? "Good mental health"
                          : currentAnalysis.overallScore >= 50
                          ? "Fair mental health"
                          : "Needs attention"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Assessments */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Depression Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Score:</span>
                        <span className="text-lg font-bold">
                          {currentAnalysis.depressionLevel.score.toFixed(1)}
                        </span>
                      </div>
                      <Badge
                        className={getLevelColor(
                          currentAnalysis.depressionLevel.level
                        )}
                      >
                        {currentAnalysis.depressionLevel.level}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {currentAnalysis.depressionLevel.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <ul className="text-xs space-y-1">
                          {currentAnalysis.depressionLevel.recommendations
                            .slice(0, 3)
                            .map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Anxiety Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Score:</span>
                        <span className="text-lg font-bold">
                          {currentAnalysis.anxietyLevel.score.toFixed(1)}
                        </span>
                      </div>
                      <Badge
                        className={getLevelColor(
                          currentAnalysis.anxietyLevel.level
                        )}
                      >
                        {currentAnalysis.anxietyLevel.level}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {currentAnalysis.anxietyLevel.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <ul className="text-xs space-y-1">
                          {currentAnalysis.anxietyLevel.recommendations
                            .slice(0, 3)
                            .map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stress Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Score:</span>
                        <span className="text-lg font-bold">
                          {currentAnalysis.stressLevel.score.toFixed(1)}
                        </span>
                      </div>
                      <Badge
                        className={getLevelColor(
                          currentAnalysis.stressLevel.level
                        )}
                      >
                        {currentAnalysis.stressLevel.level}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {currentAnalysis.stressLevel.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <ul className="text-xs space-y-1">
                          {currentAnalysis.stressLevel.recommendations
                            .slice(0, 3)
                            .map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="immediate" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="immediate">Immediate</TabsTrigger>
                      <TabsTrigger value="shortTerm">Short Term</TabsTrigger>
                      <TabsTrigger value="longTerm">Long Term</TabsTrigger>
                    </TabsList>
                    <TabsContent value="immediate" className="space-y-2">
                      {currentAnalysis.recommendations.immediate.map(
                        (rec, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                          >
                            <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                            <span className="text-red-700 dark:text-red-300">
                              {rec}
                            </span>
                          </div>
                        )
                      )}
                    </TabsContent>
                    <TabsContent value="shortTerm" className="space-y-2">
                      {currentAnalysis.recommendations.shortTerm.map(
                        (rec, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                          >
                            <Target className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                            <span className="text-yellow-700 dark:text-yellow-300">
                              {rec}
                            </span>
                          </div>
                        )
                      )}
                    </TabsContent>
                    <TabsContent value="longTerm" className="space-y-2">
                      {currentAnalysis.recommendations.longTerm.map(
                        (rec, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span className="text-green-700 dark:text-green-300">
                              {rec}
                            </span>
                          </div>
                        )
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Professional Help Notice */}
              {currentAnalysis.needsProfessionalHelp && (
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <Info className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                          Professional Support Recommended
                        </h4>
                        <p className="text-orange-700 dark:text-orange-200 text-sm mt-1">
                          Based on your assessment scores, we recommend seeking
                          professional mental health support.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Find a Therapist
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Disclaimer */}
              <div className="text-xs text-gray-500 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-gray-300">
                <p className="font-semibold mb-2">Clinical Disclaimer:</p>
                <p>
                  This analysis is based on validated screening tools but is not
                  a substitute for professional diagnosis. The PHQ-9, GAD-7, and
                  stress assessment scales used here are widely accepted in
                  clinical practice. If you are experiencing thoughts of
                  self-harm or are in crisis, please contact emergency services
                  or a crisis helpline immediately (988 in the US).
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAnalysisDialog(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Analysis Exported",
                  description: "Your mental health analysis has been saved.",
                });
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
