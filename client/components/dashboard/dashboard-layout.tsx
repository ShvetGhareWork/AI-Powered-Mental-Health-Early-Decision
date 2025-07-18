"use client";

import type React from "react";
import { useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Brain,
  Home,
  MessageSquare,
  ClipboardList,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  User,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/components/providers/notification-provider";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Mental Health Check", url: "/mental-health-check", icon: Brain },
  { title: "Self Assessment", url: "/assessment", icon: ClipboardList },
  { title: "Mood Tracker", url: "/moodtracker", icon: Heart },
  { title: "Resources", url: "/resources", icon: BookOpen },
  { title: "Profile", url: "/profile", icon: User },
];

const counselorItems = [
  { title: "Counselor Dashboard", url: "/counselor", icon: Users },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  // const { user, logout } = useAuth()
  const { notifications } = useNotifications();
  const [UserDetails, setUserDetails] = useState({});
  const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/auth/login")
  //   }
  // }, [user, router])

  // if (!user) {
  //   return null
  // }

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  // const allMenuItems = [...menuItems, ...(user.role === "counselor" || user.role === "admin" ? counselorItems : [])]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center space-x-2 px-2 py-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold">MindGuard</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={"/placeholder.svg"} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {UserDetails.name}{" "}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {UserDetails.role}
                        </span>
                      </div>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("count");
                        localStorage.removeItem("AsscessmentCount");
                        router.push("/auth/login");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
