"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Clock, Search, Download, MessageSquare, Activity, Heart, Plus, Eye, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface FlaggedUser {
  id: string
  anonymousId: string
  riskLevel: "Low" | "Moderate" | "High" | "Critical"
  lastAssessment: string
  suicideRisk: number
  depressionRisk: number
  anxietyRisk: number
  assignedCounselor?: string
  status: "New" | "In Progress" | "Resolved" | "Escalated"
  lastActivity: string
  contactPreference: "email" | "phone" | "chat" | "none"
  urgencyScore: number
  notes?: string
  interventions: number
}

interface CaseTicket {
  id: string
  userId: string
  title: string
  description: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  createdAt: string
  updatedAt: string
  assignedTo?: string
  category: "Assessment" | "Chat" | "Crisis" | "Follow-up"
  tags: string[]
}

interface Intervention {
  id: string
  userId: string
  type: "Call" | "Email" | "Chat" | "In-Person" | "Referral"
  date: string
  duration?: number
  outcome: "Successful" | "No Response" | "Escalated" | "Scheduled Follow-up"
  notes: string
  counselor: string
}

const mockFlaggedUsers: FlaggedUser[] = [
  {
    id: "1",
    anonymousId: "USER_001",
    riskLevel: "Critical",
    lastAssessment: "2024-01-15",
    suicideRisk: 85,
    depressionRisk: 78,
    anxietyRisk: 65,
    status: "New",
    lastActivity: "2 hours ago",
    contactPreference: "phone",
    urgencyScore: 95,
    interventions: 0,
  },
  {
    id: "2",
    anonymousId: "USER_002",
    riskLevel: "High",
    lastAssessment: "2024-01-14",
    suicideRisk: 45,
    depressionRisk: 72,
    anxietyRisk: 68,
    assignedCounselor: "Dr. Smith",
    status: "In Progress",
    lastActivity: "1 day ago",
    contactPreference: "email",
    urgencyScore: 75,
    interventions: 2,
    notes: "Patient responsive to initial contact. Scheduled follow-up session.",
  },
  {
    id: "3",
    anonymousId: "USER_003",
    riskLevel: "High",
    lastAssessment: "2024-01-13",
    suicideRisk: 65,
    depressionRisk: 55,
    anxietyRisk: 48,
    assignedCounselor: "Dr. Johnson",
    status: "Escalated",
    lastActivity: "3 days ago",
    contactPreference: "chat",
    urgencyScore: 80,
    interventions: 3,
    notes: "Multiple failed contact attempts. Escalated to crisis team.",
  },
  {
    id: "4",
    anonymousId: "USER_004",
    riskLevel: "Moderate",
    lastAssessment: "2024-01-12",
    suicideRisk: 25,
    depressionRisk: 45,
    anxietyRisk: 52,
    assignedCounselor: "Dr. Williams",
    status: "In Progress",
    lastActivity: "2 days ago",
    contactPreference: "email",
    urgencyScore: 50,
    interventions: 1,
  },
  {
    id: "5",
    anonymousId: "USER_005",
    riskLevel: "Low",
    lastAssessment: "2024-01-11",
    suicideRisk: 15,
    depressionRisk: 35,
    anxietyRisk: 28,
    assignedCounselor: "Dr. Brown",
    status: "Resolved",
    lastActivity: "1 week ago",
    contactPreference: "none",
    urgencyScore: 25,
    interventions: 1,
    notes: "Successfully connected with local resources. Case resolved.",
  },
]

const mockTickets: CaseTicket[] = [
  {
    id: "1",
    userId: "USER_001",
    title: "High suicide risk detected in chat",
    description: "AI detected concerning language patterns indicating immediate suicide risk during chat session.",
    priority: "Urgent",
    status: "Open",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    category: "Crisis",
    tags: ["suicide-risk", "immediate-attention", "ai-flagged"],
  },
  {
    id: "2",
    userId: "USER_002",
    title: "Consistent depression indicators",
    description: "Multiple assessments showing increasing depression scores over the past month.",
    priority: "High",
    status: "In Progress",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-15T09:20:00Z",
    assignedTo: "Dr. Smith",
    category: "Assessment",
    tags: ["depression", "trending-worse", "follow-up-needed"],
  },
  {
    id: "3",
    userId: "USER_003",
    title: "Failed contact attempts",
    description: "Unable to reach high-risk user after multiple contact attempts via preferred method.",
    priority: "High",
    status: "In Progress",
    createdAt: "2024-01-13T12:00:00Z",
    updatedAt: "2024-01-15T08:15:00Z",
    assignedTo: "Dr. Johnson",
    category: "Follow-up",
    tags: ["no-contact", "escalation-needed", "high-risk"],
  },
  {
    id: "4",
    userId: "USER_004",
    title: "Anxiety spike detected",
    description: "Sudden increase in anxiety levels reported in latest assessment.",
    priority: "Medium",
    status: "Open",
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-12T14:30:00Z",
    category: "Assessment",
    tags: ["anxiety", "spike", "monitoring"],
  },
]

const mockInterventions: Intervention[] = [
  {
    id: "1",
    userId: "USER_002",
    type: "Call",
    date: "2024-01-15T14:00:00Z",
    duration: 45,
    outcome: "Successful",
    notes: "Patient was responsive and agreed to schedule regular check-ins. Provided coping strategies.",
    counselor: "Dr. Smith",
  },
  {
    id: "2",
    userId: "USER_003",
    type: "Email",
    date: "2024-01-14T10:30:00Z",
    outcome: "No Response",
    notes: "Sent follow-up email with resources and contact information. No response received.",
    counselor: "Dr. Johnson",
  },
  {
    id: "3",
    userId: "USER_004",
    type: "Chat",
    date: "2024-01-13T16:20:00Z",
    duration: 30,
    outcome: "Scheduled Follow-up",
    notes: "Brief chat session. Patient requested follow-up appointment next week.",
    counselor: "Dr. Williams",
  },
]

const mockTrendData = [
  { date: "2024-01-01", flaggedUsers: 12, interventions: 8, resolved: 5, newCases: 3 },
  { date: "2024-01-02", flaggedUsers: 15, interventions: 10, resolved: 7, newCases: 5 },
  { date: "2024-01-03", flaggedUsers: 18, interventions: 12, resolved: 9, newCases: 4 },
  { date: "2024-01-04", flaggedUsers: 14, interventions: 9, resolved: 6, newCases: 2 },
  { date: "2024-01-05", flaggedUsers: 20, interventions: 15, resolved: 11, newCases: 6 },
  { date: "2024-01-06", flaggedUsers: 16, interventions: 11, resolved: 8, newCases: 3 },
  { date: "2024-01-07", flaggedUsers: 22, interventions: 18, resolved: 13, newCases: 7 },
]

const riskDistributionData = [
  { name: "Low", value: 35, fill: "#10b981" },
  { name: "Moderate", value: 25, fill: "#f59e0b" },
  { name: "High", value: 30, fill: "#ef4444" },
  { name: "Critical", value: 10, fill: "#dc2626" },
]

export function CounselorDashboard() {
  const [selectedUser, setSelectedUser] = useState<FlaggedUser | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<CaseTicket | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRisk, setFilterRisk] = useState("all")
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showInterventionDialog, setShowInterventionDialog] = useState(false)
  const [showTicketDialog, setShowTicketDialog] = useState(false)
  const [newIntervention, setNewIntervention] = useState({
    type: "Call",
    notes: "",
    outcome: "Successful",
  })
  const { toast } = useToast()

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "escalated":
        return "bg-red-100 text-red-800"
      case "open":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const assignCounselor = (userId: string, counselor: string) => {
    toast({
      title: "Counselor Assigned",
      description: `${counselor} has been assigned to ${userId}`,
    })
    setShowAssignDialog(false)
  }

  const createIntervention = () => {
    if (!selectedUser) return

    toast({
      title: "Intervention Recorded",
      description: `${newIntervention.type} intervention recorded for ${selectedUser.anonymousId}`,
    })
    setShowInterventionDialog(false)
    setNewIntervention({ type: "Call", notes: "", outcome: "Successful" })
  }

  const exportData = (type: "users" | "tickets" | "interventions") => {
    let data: any[] = []
    let filename = ""

    switch (type) {
      case "users":
        data = mockFlaggedUsers
        filename = "flagged-users"
        break
      case "tickets":
        data = mockTickets
        filename = "case-tickets"
        break
      case "interventions":
        data = mockInterventions
        filename = "interventions"
        break
    }

    const csvContent = [Object.keys(data[0]).join(","), ...data.map((row) => Object.values(row).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: `${type} data has been exported to CSV.`,
    })
  }

  const filteredUsers = mockFlaggedUsers.filter((user) => {
    const matchesSearch = user.anonymousId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || user.status.toLowerCase() === filterStatus
    const matchesRisk = filterRisk === "all" || user.riskLevel.toLowerCase() === filterRisk
    return matchesSearch && matchesStatus && matchesRisk
  })

  const criticalUsers = mockFlaggedUsers.filter((user) => user.riskLevel === "Critical").length
  const newCases = mockFlaggedUsers.filter((user) => user.status === "New").length
  const inProgress = mockFlaggedUsers.filter((user) => user.status === "In Progress").length
  const totalInterventions = mockInterventions.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Counselor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Monitor and manage mental health cases and interventions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportData("users")}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button onClick={() => setShowTicketDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalUsers}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Cases</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{newCases}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Activity className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interventions</CardTitle>
            <Heart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalInterventions}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Trends</CardTitle>
            <CardDescription>Daily case volume and intervention activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                <Line type="monotone" dataKey="flaggedUsers" stroke="#ef4444" strokeWidth={2} name="Flagged Users" />
                <Line type="monotone" dataKey="interventions" stroke="#10b981" strokeWidth={2} name="Interventions" />
                <Line type="monotone" dataKey="resolved" stroke="#3b82f6" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Current distribution of risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="flagged-users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flagged-users">Flagged Users</TabsTrigger>
          <TabsTrigger value="case-tickets">Case Tickets</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="flagged-users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by user ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Flagged Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Flagged Users</CardTitle>
              <CardDescription>Users requiring attention based on AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Counselor</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Urgency Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.anonymousId}</TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(user.riskLevel)}>{user.riskLevel}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{user.assignedCounselor || "Unassigned"}</TableCell>
                      <TableCell>{user.lastActivity}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                user.urgencyScore >= 80
                                  ? "bg-red-500"
                                  : user.urgencyScore >= 60
                                    ? "bg-orange-500"
                                    : user.urgencyScore >= 40
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                              }`}
                              style={{ width: `${user.urgencyScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{user.urgencyScore}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowAssignDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowInterventionDialog(true)
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="case-tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Tickets</CardTitle>
              <CardDescription>Active cases and intervention requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">#{ticket.id}</TableCell>
                      <TableCell>{ticket.userId}</TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.title}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      </TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                      <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => setSelectedTicket(ticket)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Interventions</CardTitle>
              <CardDescription>Log of counselor interventions and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Counselor</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInterventions.map((intervention) => (
                    <TableRow key={intervention.id}>
                      <TableCell className="font-medium">{intervention.userId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{intervention.type}</Badge>
                      </TableCell>
                      <TableCell>{new Date(intervention.date).toLocaleDateString()}</TableCell>
                      <TableCell>{intervention.duration ? `${intervention.duration} min` : "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(intervention.outcome)}>{intervention.outcome}</Badge>
                      </TableCell>
                      <TableCell>{intervention.counselor}</TableCell>
                      <TableCell className="max-w-xs truncate">{intervention.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Intervention Effectiveness</CardTitle>
                <CardDescription>Success rates by intervention type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { type: "Call", successful: 85, total: 100 },
                      { type: "Email", successful: 60, total: 80 },
                      { type: "Chat", successful: 75, total: 90 },
                      { type: "In-Person", successful: 95, total: 100 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="successful" fill="#10b981" name="Successful" />
                    <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
                <CardDescription>Average response time by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Urgent</span>
                    <span className="text-sm text-green-600">15 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">High</span>
                    <span className="text-sm text-yellow-600">2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Medium</span>
                    <span className="text-sm text-blue-600">8 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Low</span>
                    <span className="text-sm text-gray-600">24 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details: {selectedUser?.anonymousId}</DialogTitle>
            <DialogDescription>Comprehensive view of user risk assessment and history</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Suicide Risk:</span>
                      <span className="text-sm font-medium text-red-600">{selectedUser.suicideRisk}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Depression:</span>
                      <span className="text-sm font-medium text-orange-600">{selectedUser.depressionRisk}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Anxiety:</span>
                      <span className="text-sm font-medium text-yellow-600">{selectedUser.anxietyRisk}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Case Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Risk Level:</span>
                      <Badge className={getRiskColor(selectedUser.riskLevel)}>{selectedUser.riskLevel}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Interventions:</span>
                      <span className="text-sm font-medium">{selectedUser.interventions}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Contact Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Preferred Method:</span>
                      <Badge variant="outline" className="capitalize">
                        {selectedUser.contactPreference}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Activity:</span>
                      <span className="text-sm">{selectedUser.lastActivity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Assessment:</span>
                      <span className="text-sm">{selectedUser.lastAssessment}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedUser.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Case Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedUser.notes}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAssignDialog(true)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Assign Counselor
                </Button>
                <Button
                  onClick={() => {
                    setShowInterventionDialog(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Record Intervention
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Counselor Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Counselor</DialogTitle>
            <DialogDescription>Assign a counselor to {selectedUser?.anonymousId}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="counselor">Select Counselor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a counselor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                  <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                  <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                  <SelectItem value="dr-brown">Dr. Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Assignment Notes</Label>
              <Textarea placeholder="Add any relevant notes for the assigned counselor..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => assignCounselor(selectedUser?.id || "", "Dr. Smith")}>Assign Counselor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Intervention Dialog */}
      <Dialog open={showInterventionDialog} onOpenChange={setShowInterventionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Intervention</DialogTitle>
            <DialogDescription>Log an intervention for {selectedUser?.anonymousId}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="intervention-type">Intervention Type</Label>
              <Select
                value={newIntervention.type}
                onValueChange={(value) => setNewIntervention({ ...newIntervention, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Call">Phone Call</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Chat">Chat Session</SelectItem>
                  <SelectItem value="In-Person">In-Person Meeting</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Select
                value={newIntervention.outcome}
                onValueChange={(value) => setNewIntervention({ ...newIntervention, outcome: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Successful">Successful</SelectItem>
                  <SelectItem value="No Response">No Response</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                  <SelectItem value="Scheduled Follow-up">Scheduled Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Intervention Notes</Label>
              <Textarea
                value={newIntervention.notes}
                onChange={(e) => setNewIntervention({ ...newIntervention, notes: e.target.value })}
                placeholder="Describe the intervention and any relevant details..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterventionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createIntervention}>Record Intervention</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
