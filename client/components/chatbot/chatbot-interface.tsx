"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  AlertTriangle,
  Phone,
  Heart,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "crisis" | "suggestion";
  suggestions?: string[];
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
];

const helplineNumbers = [
  {
    country: "US",
    name: "National Suicide Prevention Lifeline",
    number: "988",
  },
  { country: "UK", name: "Samaritans", number: "116 123" },
  { country: "AU", name: "Lifeline Australia", number: "13 11 14" },
  { country: "CA", name: "Talk Suicide Canada", number: "1-833-456-4566" },
];

export function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setMessages([
      {
        id: "1",
        content:
          "Hello! I'm your AI mental health companion. How are you feeling today?",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
        suggestions: [
          "I'm anxious",
          "Having a tough day",
          "Need to talk",
          "Feeling overwhelmed",
        ],
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectCrisis = (message: string): boolean => {
    return crisisKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );
  };

  const generateBotResponse = async (userMessage: string): Promise<Message> => {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const isCrisis = detectCrisis(userMessage);
    if (isCrisis) {
      setCrisisDetected(true);
      return {
        id: Date.now().toString(),
        content:
          "I'm very concerned about what you've shared. Would you like helpline numbers?",
        sender: "bot",
        timestamp: new Date(),
        type: "crisis",
        suggestions: ["Yes, show me numbers", "I need immediate help"],
      };
    }

    const responses = [
      "Thank you for sharing. Would you like to tell me more?",
      "I appreciate your openness. Would you like to explore this further?",
      "I'm here for you. Would a calming exercise help?",
    ];

    return {
      id: Date.now().toString(),
      content: responses[Math.floor(Math.random() * responses.length)],
      sender: "bot",
      timestamp: new Date(),
      type: "text",
      suggestions: [
        "Tell me more",
        "Coping strategies",
        "Quick breathing exercise",
      ],
    };
  };

  const sendMessage = async (content?: string) => {
    const messageContent = content || inputMessage.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    const botResponse = await generateBotResponse(messageContent);
    setMessages((prev) => [...prev, botResponse]);

    if (botResponse.type === "crisis") {
      toast({
        title: "Crisis Support Available",
        description: "Consider immediate help.",
        variant: "destructive",
      });
    }

    setIsTyping(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-3xl font-bold">AI Mental Health Companion</h1>
        <Badge variant="secondary">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Online
        </Badge>
      </div>

      {crisisDetected && (
        <Alert>
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <p className="font-semibold">Crisis Support Available</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {helplineNumbers.map((helpline, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  onClick={() => window.open(`tel:${helpline.number}`)}
                >
                  {helpline.country}: {helpline.number}
                </Button>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="flex flex-col h-[75vh]">
        <CardHeader>
          <CardTitle>
            <MessageSquare className="mr-2 h-5 w-5 inline" />
            Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className="max-w-[75%] p-3 rounded-lg text-sm"
                style={{
                  background:
                    m.sender === "user"
                      ? "#3B82F6"
                      : m.type === "crisis"
                      ? "#FECACA"
                      : "#E5E7EB",
                  color: m.sender === "user" ? "white" : "black",
                }}
              >
                <p>{m.content}</p>
              </div>
            </div>
          ))}
          {isTyping && <p className="text-gray-500">AI is typing...</p>}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="border-t p-2 flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <Button onClick={() => sendMessage()} disabled={!inputMessage.trim()}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
