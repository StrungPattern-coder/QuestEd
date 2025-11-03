"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Bell, Shield, Puzzle, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsIntegration from "@/components/TeamsIntegration";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/teacher")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400 text-lg">
            Manage your account, preferences, and integrations
          </p>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 bg-white/5 p-1 rounded-lg">
              <TabsTrigger value="profile" className="data-[state=active]:bg-[#FF991C] data-[state=active]:text-black">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-[#FF991C] data-[state=active]:text-black">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#FF991C] data-[state=active]:text-black">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:bg-[#FF991C] data-[state=active]:text-black">
                <Puzzle className="h-4 w-4 mr-2" />
                Integrations
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#FF991C]" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your account details and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Full Name</label>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white">{user?.name || "Not set"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-white">{user?.email || "Not set"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Role</label>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white capitalize">{user?.role || "Teacher"}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black">
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-[#FF991C]" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Email Notifications</h4>
                      <p className="text-sm text-gray-400">Receive updates via email</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Test Submissions</h4>
                      <p className="text-sm text-gray-400">Get notified when students submit tests</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Classroom Activity</h4>
                      <p className="text-sm text-gray-400">Updates about classroom changes</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#FF991C]" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your password and security options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start gap-3">
                        <Key className="h-5 w-5 text-[#FF991C] mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">Change Password</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            Update your password to keep your account secure
                          </p>
                          <Button className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black">
                            Change Password
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-[#FF991C] mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            Add an extra layer of security to your account
                          </p>
                          <Button variant="outline">Coming Soon</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations">
              <TeamsIntegration onSuccess={() => {
                console.log("Teams integration successful!");
              }} />

              {/* Future Integrations */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6">
                <CardHeader>
                  <CardTitle>More Integrations Coming Soon</CardTitle>
                  <CardDescription className="text-gray-400">
                    We're working on adding more integrations to enhance your experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Google Classroom", status: "Coming Soon", icon: "🎓" },
                      { name: "Slack", status: "Coming Soon", icon: "💬" },
                      { name: "Discord", status: "Coming Soon", icon: "🎮" },
                      { name: "Zoom", status: "Coming Soon", icon: "📹" },
                    ].map((integration) => (
                      <div
                        key={integration.name}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{integration.icon}</span>
                          <div>
                            <h4 className="font-medium text-white">{integration.name}</h4>
                            <p className="text-xs text-gray-400">{integration.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
