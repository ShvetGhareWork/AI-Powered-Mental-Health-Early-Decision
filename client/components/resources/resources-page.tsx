"use client";

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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Phone,
  ExternalLink,
  BookOpen,
  Users,
  Heart,
  Brain,
  Shield,
  Clock,
  Star,
  Download,
  Play,
  FileText,
  Headphones,
  Award,
  TrendingUp,
  Calendar,
  MessageCircle,
  Bookmark,
  Share2,
  ChevronRight,
  Target,
  Activity,
  PieChart,
  Info,
  Sparkles,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type:
    | "article"
    | "hotline"
    | "app"
    | "book"
    | "video"
    | "tool"
    | "support-group"
    | "podcast"
    | "worksheet"
    | "course";
  url?: string;
  phone?: string;
  rating?: number;
  reviews?: number;
  free: boolean;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  duration?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  language?: string[];
  author?: string;
  publishedDate?: string;
  completionRate?: number;
}

const resources: Resource[] = [
  // Crisis Resources
  {
    id: "1",
    title: "National Suicide Prevention Lifeline",
    description:
      "24/7 free and confidential support for people in distress and prevention resources for you or your loved ones.",
    category: "Crisis Support",
    type: "hotline",
    phone: "988",
    free: true,
    tags: ["crisis", "suicide", "24/7", "emergency", "confidential"],
    featured: true,
    language: ["English", "Spanish"],
  },
  {
    id: "2",
    title: "Crisis Text Line",
    description:
      "Free, 24/7 support for those in crisis. Text HOME to 741741 from anywhere in the US, anytime, about any type of crisis.",
    category: "Crisis Support",
    type: "hotline",
    phone: "741741",
    free: true,
    tags: ["crisis", "text", "24/7", "emergency", "anonymous"],
    language: ["English", "Spanish"],
  },
  {
    id: "3",
    title: "SAMHSA National Helpline",
    description:
      "Treatment referral and information service for individuals and families facing mental health and/or substance use disorders.",
    category: "Crisis Support",
    type: "hotline",
    phone: "1-800-662-4357",
    free: true,
    tags: ["treatment", "referral", "substance-abuse", "family-support"],
    language: ["English", "Spanish"],
  },
  {
    id: "4",
    title: "Trans Lifeline",
    description:
      "Peer support service run by trans people, for trans and questioning callers.",
    category: "Crisis Support",
    type: "hotline",
    phone: "877-565-8860",
    free: true,
    tags: ["transgender", "LGBTQ+", "peer-support", "crisis"],
  },
  {
    id: "5",
    title: "National Domestic Violence Hotline",
    description:
      "24/7 confidential support for domestic violence survivors and their loved ones.",
    category: "Crisis Support",
    type: "hotline",
    phone: "1-800-799-7233",
    free: true,
    tags: ["domestic-violence", "abuse", "safety", "confidential"],
    language: ["English", "Spanish", "200+ languages via interpreter"],
  },

  // Educational Articles
  {
    id: "6",
    title: "Understanding Depression: A Complete Guide",
    description:
      "Comprehensive guide covering symptoms, causes, treatment options, and recovery strategies for depression.",
    category: "Education",
    type: "article",
    url: "https://www.nimh.nih.gov/health/topics/depression",
    free: true,
    tags: ["depression", "symptoms", "treatment", "recovery"],
    featured: true,
    duration: "15 min read",
    author: "Dr. Sarah Johnson, MD",
    publishedDate: "2024-01-15",
    rating: 4.8,
    reviews: 1247,
  },
  {
    id: "7",
    title: "Anxiety Management: Evidence-Based Techniques",
    description:
      "Learn proven strategies including CBT, mindfulness, and breathing techniques to manage anxiety effectively.",
    category: "Education",
    type: "article",
    url: "https://www.anxiety.org/anxiety-management-techniques",
    free: true,
    tags: ["anxiety", "CBT", "mindfulness", "breathing", "coping"],
    duration: "12 min read",
    author: "Dr. Michael Chen, PhD",
    rating: 4.7,
    reviews: 892,
    trending: true,
  },
  {
    id: "8",
    title: "Building Resilience: Your Mental Strength Toolkit",
    description:
      "Discover how to develop psychological resilience, bounce back from setbacks, and build emotional strength.",
    category: "Education",
    type: "article",
    url: "https://www.apa.org/topics/resilience",
    free: true,
    tags: ["resilience", "mental-strength", "coping", "emotional-intelligence"],
    duration: "18 min read",
    author: "Dr. Lisa Rodriguez, LCSW",
    rating: 4.9,
    reviews: 654,
  },
  {
    id: "9",
    title: "Sleep and Mental Health: The Connection",
    description:
      "Explore the bidirectional relationship between sleep quality and mental health, plus practical sleep hygiene tips.",
    category: "Education",
    type: "article",
    url: "https://www.sleepfoundation.org/mental-health",
    free: true,
    tags: ["sleep", "mental-health", "hygiene", "insomnia"],
    duration: "10 min read",
    author: "Dr. James Wilson, Sleep Specialist",
    rating: 4.6,
    reviews: 423,
  },
  {
    id: "10",
    title: "Trauma-Informed Self-Care Strategies",
    description:
      "Gentle, trauma-informed approaches to self-care and healing for survivors of various types of trauma.",
    category: "Education",
    type: "article",
    url: "https://www.traumainformedcare.chcs.org/trauma-informed-self-care/",
    free: true,
    tags: ["trauma", "self-care", "healing", "PTSD", "survivors"],
    duration: "20 min read",
    author: "Dr. Amanda Foster, Trauma Specialist",
    rating: 4.8,
    reviews: 567,
  },

  {
    id: "11",
    title: "Headspace: Meditation & Mindfulness",
    description:
      "Guided meditation, sleep stories, and mindfulness exercises designed by experts to help reduce stress and anxiety.",
    category: "Apps & Tools",
    type: "app",
    url: "https://www.headspace.com/",
    rating: 4.8,
    reviews: 125000,
    free: false,
    tags: ["meditation", "mindfulness", "sleep", "stress-relief"],
    featured: true,
    difficulty: "Beginner",
    completionRate: 78,
  },
  {
    id: "12",
    title: "Calm: Sleep, Meditate, Relax",
    description:
      "Sleep stories, meditation programs, masterclasses, and relaxing music to help you unwind and sleep better.",
    category: "Apps & Tools",
    type: "app",
    url: "https://www.calm.com/",
    rating: 4.7,
    reviews: 98000,
    free: false,
    tags: ["sleep", "meditation", "relaxation", "music"],
    difficulty: "Beginner",
    completionRate: 82,
  },
  {
    id: "13",
    title: "MindShift: Anxiety Management",
    description:
      "Free app using CBT techniques to help you learn to relax, develop more helpful ways of thinking, and identify active steps.",
    category: "Apps & Tools",
    type: "app",
    url: "https://www.anxietycanada.com/resources/mindshift-cbt/",
    rating: 4.5,
    reviews: 15000,
    free: true,
    tags: ["anxiety", "CBT", "worry", "coping-skills"],
    difficulty: "Intermediate",
    completionRate: 65,
  },
  {
    id: "14",
    title: "Sanvello: Anxiety & Depression",
    description:
      "Track your mood, practice coping techniques, and connect with a supportive community.",
    category: "Apps & Tools",
    type: "app",
    url: "https://sanvello.com/",
    rating: 4.4,
    reviews: 22000,
    free: true,
    tags: ["mood-tracking", "anxiety", "depression", "community"],
    difficulty: "Beginner",
    completionRate: 71,
  },
  {
    id: "15",
    title: "PTSD Coach",
    description:
      "Evidence-based app designed to help manage symptoms of PTSD. Created by VA's National Center for PTSD.",
    category: "Apps & Tools",
    type: "app",
    url: "https://mobile.va.gov/app/ptsd-coach",
    rating: 4.6,
    reviews: 8500,
    free: true,
    tags: ["PTSD", "trauma", "veterans", "coping"],
    difficulty: "Intermediate",
    completionRate: 58,
  },

  {
    id: "16",
    title: "Feeling Good: The New Mood Therapy",
    description:
      "The classic bestseller that introduced cognitive behavioral therapy techniques for overcoming depression and anxiety.",
    category: "Books",
    type: "book",
    url: "https://www.goodreads.com/book/show/46674.Feeling_Good",
    rating: 4.6,
    reviews: 3200,
    free: false,
    tags: ["CBT", "depression", "therapy", "classic"],
    author: "David D. Burns, MD",
    publishedDate: "1980",
  },

  {
    id: "18",
    title: "The Body Keeps the Score",
    description:
      "Groundbreaking book on how trauma affects the body and brain, and innovative treatments for recovery.",
    category: "Books",
    type: "book",
    url: "https://www.goodreads.com/book/show/18693771-the-body-keeps-the-score",
    rating: 4.8,
    reviews: 5600,
    free: false,
    tags: ["trauma", "PTSD", "neuroscience", "recovery"],
    author: "Bessel van der Kolk, MD",
    publishedDate: "2014",
    trending: true,
  },

  {
    id: "20",
    title: "Introduction to Mindfulness Meditation",
    description:
      "Free 8-week course introducing mindfulness meditation practices for stress reduction and mental clarity.",
    category: "Education",
    type: "course",
    url: "https://palousemindfulness.com/",
    rating: 4.7,
    reviews: 890,
    free: true,
    tags: ["mindfulness", "meditation", "course", "stress-reduction"],
    duration: "8 weeks",
    difficulty: "Beginner",
    author: "Mindfulness Institute",
  },

  {
    id: "23",
    title: "The Mental Health Toolkit",
    description:
      "Weekly podcast featuring expert interviews, practical tips, and evidence-based strategies for mental wellness.",
    category: "Education",
    type: "podcast",
    url: "https://mentalhealthtoolkit.podbean.com/",
    rating: 4.7,
    reviews: 1200,
    free: true,
    tags: ["podcast", "expert-interviews", "mental-wellness", "strategies"],
    author: "Dr. Amanda Chen",
    trending: true,
  },

  {
    id: "28",
    title: "NAMI Support Groups",
    description:
      "Free support groups for individuals and families affected by mental illness, available nationwide.",
    category: "Support Groups",
    type: "support-group",
    url: "https://www.nami.org/Support-Education/Support-Groups",
    free: true,
    tags: ["support", "community", "family", "nationwide"],
    language: ["English", "Spanish"],
  },

  {
    id: "31",
    title: "Psychology Today Therapist Finder",
    description:
      "Comprehensive directory to find licensed therapists, psychiatrists, and mental health professionals in your area.",
    category: "Professional Help",
    type: "tool",
    url: "https://www.psychologytoday.com/us/therapists",
    free: true,
    tags: ["therapist", "professional", "directory", "local"],
    rating: 4.5,
    reviews: 2300,
  },
];

const categories = [
  "All",
  "Crisis Support",
  "Education",
  "Apps & Tools",
  "Books",
  "Support Groups",
  "Professional Help",
  "Tools & Worksheets",
];

const resourceTypes = {
  article: {
    icon: FileText,
    label: "Article",
    color: "bg-blue-100 text-blue-500",
  },
  hotline: { icon: Phone, label: "Hotline", color: "bg-red-100 text-red-800" },
  app: { icon: Download, label: "App", color: "bg-green-100 text-green-800" },
  book: {
    icon: BookOpen,
    label: "Book",
    color: "bg-purple-100 text-purple-800",
  },
  video: { icon: Play, label: "Video", color: "bg-orange-100 text-orange-800" },
  tool: { icon: Brain, label: "Tool", color: "bg-indigo-100 text-indigo-800" },
  "support-group": {
    icon: Users,
    label: "Support Group",
    color: "bg-pink-100 text-pink-800",
  },
  podcast: {
    icon: Headphones,
    label: "Podcast",
    color: "bg-yellow-100 text-yellow-800",
  },
  worksheet: {
    icon: FileText,
    label: "Worksheet",
    color: "bg-teal-100 text-teal-800",
  },
  course: { icon: Award, label: "Course", color: "bg-cyan-100 text-cyan-800" },
};

const mentalHealthStats = [
  {
    label: "Adults with Mental Illness",
    value: "1 in 5",
    description: "Experience mental illness each year",
  },
  {
    label: "Youth with Depression",
    value: "13%",
    description: "Of adolescents experience major depression",
  },
  {
    label: "Treatment Gap",
    value: "60%",
    description: "Of adults with mental illness don't receive treatment",
  },
  {
    label: "Recovery Rate",
    value: "80%",
    description: "Of people with mental illness recover with proper treatment",
  },
];

export function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || resource.category === selectedCategory;
    const matchesType = !selectedType || resource.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredResources = resources.filter((resource) => resource.featured);
  const trendingResources = resources.filter((resource) => resource.trending);

  const ResourceCard = ({
    resource,
    compact = false,
  }: {
    resource: Resource;
    compact?: boolean;
  }) => {
    const TypeIcon = resourceTypes[resource.type].icon;
    const typeColor = resourceTypes[resource.type].color;

    return (
      <Card
        className={`h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
          compact ? "p-4" : ""
        }`}
      >
        <CardHeader className={compact ? "pb-2" : "pb-3"}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${typeColor}`}>
                <TypeIcon className="h-4 w-4" />
              </div>
              <Badge
                variant={resource.free ? "secondary" : "outline"}
                className="text-xs"
              >
                {resource.free ? "Free" : "Paid"}
              </Badge>
              {resource.trending && (
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            {resource.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{resource.rating}</span>
                {resource.reviews && (
                  <span className="text-xs text-gray-500">
                    ({resource.reviews.toLocaleString()})
                  </span>
                )}
              </div>
            )}
          </div>
          <CardTitle
            className={`leading-tight ${compact ? "text-base" : "text-lg"}`}
          >
            {resource.title}
          </CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {resource.description}
          </CardDescription>

          {!compact && (
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              {resource.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {resource.duration}
                </div>
              )}
              {resource.difficulty && (
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {resource.difficulty}
                </div>
              )}
              {resource.author && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {resource.author}
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, compact ? 2 : 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > (compact ? 2 : 3) && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - (compact ? 2 : 3)}
              </Badge>
            )}
          </div>

          {resource.completionRate && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Completion Rate</span>
                <span>{resource.completionRate}%</span>
              </div>
              <Progress value={resource.completionRate} className="h-2" />
            </div>
          )}

          <div className="flex gap-2">
            {resource.phone && (
              <Button size="sm" className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Call {resource.phone}
              </Button>
            )}
            {resource.url && (
              <Button size="sm" variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                {resource.type === "app" ? "Download" : "Visit"}
              </Button>
            )}
            <Button size="sm" variant="ghost" className="px-2">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="px-2">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
        <div className="absolute top-4 right-4 opacity-10">
          <Brain className="h-32 w-32" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-600">
              Comprehensive Mental Health Resources
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Mental Health{" "}
            <span className="text-blue-600">Resource Hub</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-8">
            Discover evidence-based tools, expert guidance, and supportive
            communities to help you on your mental wellness journey. From crisis
            support to daily wellness practices, find the resources that work
            for you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-5 w-5 mr-2" />
              Explore Resources
            </Button>
            <Button size="lg" variant="outline">
              <Phone className="h-5 w-5 mr-2" />
              Crisis Support
            </Button>
          </div>
        </div>
      </div>

      {/* Mental Health Statistics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mentalHealthStats.map((stat, index) => (
          <Card
            key={index}
            className="text-center p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stat.value}
            </div>
            <div className="font-semibold text-gray-200 mb-1">{stat.label}</div>
            <div className="text-sm text-gray-600">{stat.description}</div>
          </Card>
        ))}
      </section>

      {/* Emergency Banner */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 text-lg">
                Crisis Support Available 24/7
              </h3>
              <p className="text-red-700">
                If you're in crisis or having thoughts of self-harm, help is
                available immediately. You're not alone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="destructive" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call 988
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Text 741741
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Resources */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Featured Resources</h2>
            <p className="text-gray-600">
              Hand-picked resources recommended by mental health professionals
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>

      {/* Trending Resources */}
      {trendingResources.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start  sm:items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Trending This Week</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Popular resources that are helping people right now
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {trendingResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} compact />
            ))}
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="bg-gray-50 rounded-2xl p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Find Your Perfect Resource
            </h2>
            <p className="text-gray-600">
              Search through our comprehensive collection of mental health
              resources
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by keyword, condition, or resource type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-xs py-2"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(null)}
              className="h-9"
            >
              All Types
            </Button>
            {Object.entries(resourceTypes).map(
              ([type, { icon: Icon, label }]) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setSelectedType(selectedType === type ? null : type)
                  }
                  className="h-9"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">All Resources</h2>
            <p className="text-gray-600">
              {filteredResources.length} resources found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <PieChart className="h-4 w-4 mr-2" />
              Sort by Rating
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Sort by Date
            </Button>
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No resources found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search terms or filters. You can also browse
                our featured resources above.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedType(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>

      {/* Resource Categories Overview */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Explore by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our resources are organized into categories to help you find exactly
            what you need for your mental health journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(1).map((category) => {
            const categoryResources = resources.filter(
              (r) => r.category === category
            );
            const categoryIcons = {
              "Crisis Support": Shield,
              Education: BookOpen,
              "Apps & Tools": Download,
              Books: BookOpen,
              "Support Groups": Users,
              "Professional Help": Heart,
              "Tools & Worksheets": FileText,
            };
            const Icon =
              categoryIcons[category as keyof typeof categoryIcons] || Brain;

            return (
              <Card
                key={category}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white rounded-lg group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category}</h3>
                    <p className="text-sm text-gray-600">
                      {categoryResources.length} resources
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-purple-600 group-hover:text-purple-700">
                  <span className="text-sm font-medium">
                    Explore {category}
                  </span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-white/20 rounded-full">
              <Heart className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Take the Next Step in Your Mental Health Journey
          </h2>
          <p className="text-xl opacity-90">
            Ready to prioritize your mental wellness? Our platform offers
            personalized assessments, mood tracking, and AI-powered support to
            complement these resources.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Brain className="h-5 w-5 mr-2" />
              Take Free Assessment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Activity className="h-5 w-5 mr-2" />
              Start Mood Tracking
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat with AI Support
            </Button>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Info className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-amber-900">
                Important Disclaimer
              </h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                The resources provided here are for informational and
                educational purposes only. They are not intended to replace
                professional medical advice, diagnosis, or treatment. Always
                seek the advice of qualified mental health professionals with
                any questions you may have regarding a mental health condition.
                If you are experiencing a mental health emergency, please call
                911 or go to your nearest emergency room immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
