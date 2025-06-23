"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, ChevronRight, RotateCcw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Question {
  id: string
  text: string
  options: {
    value: number
    label: string
  }[]
}

interface AssessmentResult {
  category: string
  score: number
  maxScore: number
  level: string
  description: string
  recommendations: string[]
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
    text: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "4",
    text: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
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
    text: "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself or that you are a failure?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "7",
    text: "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "8",
    text: "Over the last 2 weeks, how often have you been bothered by moving or speaking slowly, or being fidgety?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: "9",
    text: "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
]

export function SelfAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<AssessmentResult | null>(null)
  const { toast } = useToast()

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      completeAssessment()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const completeAssessment = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    const maxScore = assessmentQuestions.length * 3

    let level = "Minimal"
    let description = ""
    let recommendations: string[] = []

    if (totalScore <= 4) {
      level = "Minimal"
      description =
        "Your responses suggest minimal depression symptoms. This is a positive indicator of your mental health."
      recommendations = [
        "Continue maintaining healthy lifestyle habits",
        "Stay connected with friends and family",
        "Practice regular self-care activities",
        "Monitor your mood and seek help if symptoms worsen",
      ]
    } else if (totalScore <= 9) {
      level = "Mild"
      description =
        "Your responses suggest mild depression symptoms. While manageable, it's important to address these feelings."
      recommendations = [
        "Consider talking to a counselor or therapist",
        "Engage in regular physical activity",
        "Practice mindfulness and relaxation techniques",
        "Maintain a regular sleep schedule",
        "Connect with supportive friends and family",
      ]
    } else if (totalScore <= 14) {
      level = "Moderate"
      description = "Your responses suggest moderate depression symptoms. Professional support would be beneficial."
      recommendations = [
        "Strongly consider professional counseling or therapy",
        "Speak with your healthcare provider",
        "Join a support group",
        "Develop a daily routine and stick to it",
        "Avoid alcohol and drugs",
        "Practice stress management techniques",
      ]
    } else if (totalScore <= 19) {
      level = "Moderately Severe"
      description = "Your responses suggest moderately severe depression symptoms. Professional help is recommended."
      recommendations = [
        "Seek professional mental health treatment immediately",
        "Consider medication evaluation with a psychiatrist",
        "Inform trusted friends or family about your situation",
        "Create a safety plan",
        "Avoid making major life decisions",
        "Focus on basic self-care activities",
      ]
    } else {
      level = "Severe"
      description =
        "Your responses suggest severe depression symptoms. Immediate professional help is strongly recommended."
      recommendations = [
        "Seek immediate professional mental health treatment",
        "Contact a crisis helpline if you have thoughts of self-harm",
        "Consider inpatient or intensive outpatient treatment",
        "Inform trusted individuals about your condition",
        "Follow up regularly with mental health professionals",
        "Take medication as prescribed by a healthcare provider",
      ]
    }

    const result: AssessmentResult = {
      category: "Depression Screening (PHQ-9)",
      score: totalScore,
      maxScore,
      level,
      description,
      recommendations,
    }

    setResults(result)
    setIsCompleted(true)

    toast({
      title: "Assessment Complete",
      description: "Your mental health assessment results are ready.",
    })
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsCompleted(false)
    setResults(null)
  }

  const downloadResults = () => {
    if (!results) return

    const reportContent = `
Mental Health Self-Assessment Results
Generated on: ${new Date().toLocaleDateString()}

ASSESSMENT: ${results.category}
SCORE: ${results.score}/${results.maxScore}
LEVEL: ${results.level}

DESCRIPTION:
${results.description}

RECOMMENDATIONS:
${results.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join("\n")}

IMPORTANT DISCLAIMER:
This assessment is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing severe symptoms or thoughts of self-harm, please seek immediate professional help or contact a crisis helpline.

Emergency Contacts:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency Services: 911
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mental-health-assessment-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Results Downloaded",
      description: "Your assessment results have been downloaded.",
    })
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "minimal":
        return "bg-green-100 text-green-800"
      case "mild":
        return "bg-yellow-100 text-yellow-800"
      case "moderate":
        return "bg-orange-100 text-orange-800"
      case "moderately severe":
        return "bg-red-100 text-red-800"
      case "severe":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100

  if (isCompleted && results) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assessment Results</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Your mental health assessment is complete</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={downloadResults} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Results
            </Button>
            <Button onClick={resetAssessment}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Take Again
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{results.category}</span>
              <Badge className={getLevelColor(results.level)}>{results.level}</Badge>
            </CardTitle>
            <CardDescription>
              Score: {results.score} out of {results.maxScore}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Assessment Score</span>
                <span className="text-sm text-muted-foreground">
                  {results.score}/{results.maxScore}
                </span>
              </div>
              <Progress value={(results.score / results.maxScore) * 100} className="h-2" />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Assessment Summary</h3>
              <p className="text-gray-700 dark:text-gray-300">{results.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {results.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {(results.level === "Moderately Severe" || results.level === "Severe") && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Important Notice</h4>
                <p className="text-red-700 dark:text-red-200 text-sm mb-3">
                  Your assessment indicates significant symptoms that warrant immediate professional attention. Please
                  consider reaching out for help right away.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="destructive">
                    Find a Therapist
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                    Crisis Resources
                  </Button>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-semibold mb-1">Disclaimer:</p>
              <p>
                This assessment is for informational purposes only and is not a substitute for professional medical
                advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions
                you may have regarding a medical condition.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mental Health Self-Assessment</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">PHQ-9 Depression Screening Questionnaire</p>
        </div>
        <Badge variant="secondary">
          Question {currentQuestion + 1} of {assessmentQuestions.length}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Assessment Progress
            </CardTitle>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{assessmentQuestions[currentQuestion].text}</h3>

            <RadioGroup
              value={answers[assessmentQuestions[currentQuestion].id]?.toString()}
              onValueChange={(value) => handleAnswer(assessmentQuestions[currentQuestion].id, Number.parseInt(value))}
              className="space-y-3"
            >
              {assessmentQuestions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
              Previous
            </Button>

            <Button
              onClick={nextQuestion}
              disabled={
                !answers[assessmentQuestions[currentQuestion].id] &&
                answers[assessmentQuestions[currentQuestion].id] !== 0
              }
            >
              {currentQuestion === assessmentQuestions.length - 1 ? "Complete Assessment" : "Next"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About This Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              The PHQ-9 is a widely used screening tool for depression. It consists of 9 questions that correspond to
              the diagnostic criteria for major depressive disorder.
            </p>
            <p>
              <strong>Scoring:</strong> Each question is scored from 0-3, with total scores ranging from 0-27.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>0-4: Minimal depression</li>
              <li>5-9: Mild depression</li>
              <li>10-14: Moderate depression</li>
              <li>15-19: Moderately severe depression</li>
              <li>20-27: Severe depression</li>
            </ul>
            <p className="text-xs mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <strong>Important:</strong> This tool is for screening purposes only and should not replace professional
              medical evaluation. If you're experiencing thoughts of self-harm, please seek immediate help.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
