"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, Send, Bot, User, AlertTriangle, Phone, Heart } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "crisis" | "suggestion"
  suggestions?: string[]
}

const crisisKeywords = [
  "suicide",
  "kill myself",
  "end it all",
  "want to die",
  "no point living",
  "hurt myself",
  "self harm",
  "cutting",
  "overdose",
  "jump off",
]

const helplineNumbers = [
  { country: "US", name: "National Suicide Prevention Lifeline", number: "988" },
  { country: "UK", name: "Samaritans", number: "116 123" },
  { country: "AU", name: "Lifeline Australia", number: "13 11 14" },
  { country: "CA", name: "Talk Suicide Canada", number: "1-833-456-4566" },
]

export function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI mental health companion. I'm here to listen and provide support 24/7. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
      suggestions: [
        "I'm feeling anxious",
        "I'm having a tough day",
        "I need someone to talk to",
        "I'm feeling overwhelmed",
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [crisisDetected, setCrisisDetected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectCrisis = (message: string): boolean => {
    const lowerMessage = message.toLowerCase()
    return crisisKeywords.some((keyword) => lowerMessage.includes(keyword))
  }

  const generateBotResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const isCrisis = detectCrisis(userMessage)

    if (isCrisis) {
      setCrisisDetected(true)
      return {
        id: Date.now().toString(),
        content:
          "I'm very concerned about what you've shared. Your life has value and there are people who want to help. Please consider reaching out to a crisis helpline immediately. Would you like me to provide some emergency contacts?",
        sender: "bot",
        timestamp: new Date(),
        type: "crisis",
        suggestions: ["Yes, show me helpline numbers", "I need immediate help", "Tell me more about getting support"],
      }
    }

    // Generate contextual responses based on keywords
    const lowerMessage = userMessage.toLowerCase()
    let response = ""
    let suggestions: string[] = []

    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety")) {
      response =
        "I understand you're feeling anxious. Anxiety can be overwhelming, but there are techniques that can help. Would you like to try a breathing exercise, or would you prefer to talk about what's making you feel this way?"
      suggestions = [
        "Let's try a breathing exercise",
        "I want to talk about what's bothering me",
        "Tell me about anxiety management",
        "I need coping strategies",
      ]
    } else if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("down")) {
      response =
        "I'm sorry you're feeling this way. It's okay to feel sad sometimes, and I'm here to listen. Would you like to share what's been weighing on your mind, or would you prefer some gentle suggestions for lifting your mood?"
      suggestions = [
        "I want to share what's bothering me",
        "Give me some mood-lifting suggestions",
        "Tell me about dealing with sadness",
        "I feel alone",
      ]
    } else if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelmed")) {
      response =
        "Feeling stressed and overwhelmed is very common, especially in today's world. Let's work together to break things down into manageable pieces. What's the main source of your stress right now?"
      suggestions = [
        "Work is stressing me out",
        "I have too much to do",
        "I can't handle everything",
        "Teach me stress management",
      ]
    } else if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
      response =
        "Sleep issues can really affect your mental health. Good sleep hygiene is crucial for wellbeing. Are you having trouble falling asleep, staying asleep, or both?"
      suggestions = ["I can't fall asleep", "I wake up during the night", "I don't feel rested", "Give me sleep tips"]
    } else {
      // Generic supportive response
      const responses = [
        "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you're feeling?",
        "I appreciate you opening up. It takes courage to talk about your feelings. What would be most helpful for you right now?",
        "I hear you, and your feelings are valid. Would you like to explore this topic further or try some coping techniques?",
        "That sounds challenging. I'm here to support you through this. What kind of help would be most beneficial?",
      ]
      response = responses[Math.floor(Math.random() * responses.length)]
      suggestions = [
        "I need coping strategies",
        "I want to talk more",
        "Help me understand my feelings",
        "What should I do next?",
      ]
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: "bot",
      timestamp: new Date(),
      type: "text",
      suggestions,
    }
  }

  const sendMessage = async (content?: string) => {
    const messageContent = content || inputMessage.trim()
    if (!messageContent) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      // Generate bot response
      const botResponse = await generateBotResponse(messageContent)
      setMessages((prev) => [...prev, botResponse])

      if (botResponse.type === "crisis") {
        toast({
          title: "Crisis Support Available",
          description: "Please consider reaching out for immediate help.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Sorry, I encountered an error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const showHelplines = () => {
    const helplineMessage: Message = {
      id: Date.now().toString(),
      content: "Here are some crisis helpline numbers you can call right now:",
      sender: "bot",
      timestamp: new Date(),
      type: "crisis",
    }
    setMessages((prev) => [...prev, helplineMessage])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Mental Health Companion</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">24/7 anonymous support and conversation</p>
        </div>
        <Badge variant="secondary" className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Online
        </Badge>
      </div>

      {crisisDetected && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <div className="space-y-2">
              <p className="font-semibold">Crisis Support Available</p>
              <p>If you're in immediate danger, please call emergency services (911) or contact a crisis helpline.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {helplineNumbers.map((helpline, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className="text-red-700 border-red-300 hover:bg-red-100"
                    onClick={() => window.open(`tel:${helpline.number}`)}
                  >
                    <Phone className="mr-1 h-3 w-3" />
                    {helpline.country}: {helpline.number}
                  </Button>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Chat with AI Companion
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    {message.sender === "user" ? (
                      <>
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : message.type === "crisis"
                          ? "bg-red-50 border border-red-200 text-red-900"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>

                    {/* Suggestion buttons */}
                    {message.suggestions && message.sender === "bot" && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="text-xs h-6"
                            onClick={() => sendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button onClick={() => sendMessage()} disabled={!inputMessage.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This is an AI companion for support. In emergencies, contact local emergency services.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Quick Support Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => sendMessage("I'm feeling anxious and need help")}
            >
              I'm feeling anxious
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => sendMessage("I'm having trouble sleeping")}
            >
              Sleep problems
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => sendMessage("I need stress management techniques")}
            >
              Stress management
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
