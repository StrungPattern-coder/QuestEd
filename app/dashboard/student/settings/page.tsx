"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Bell, Shield, Puzzle, Mail, Key, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsIntegration from "@/components/TeamsIntegration";

export default function StudentSettingsPage() {
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
            onClick={() => router.push("/dashboard/student")}
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
                      <p className="text-white capitalize">{user?.role || "Student"}</p>
                    </div>
                  </div>
                  {user?.enrollmentNumber && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Enrollment Number</label>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-white">{user.enrollmentNumber}</p>
                      </div>
                    </div>
                  )}
                  {user?.rollNumber && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Roll Number</label>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-white">{user.rollNumber}</p>
                      </div>
                    </div>
                  )}
                  <div className="pt-4">
                    <Button className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black">
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Preferences */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#FF991C]" />
                    Learning Preferences
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize your learning experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Sound Effects</h4>
                      <p className="text-sm text-gray-400">Play sounds during quizzes</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Animations</h4>
                      <p className="text-sm text-gray-400">Show celebration animations</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Dark Mode</h4>
                      <p className="text-sm text-gray-400">Use dark theme (default)</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
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
                      <h4 className="font-medium text-white">New Test Assignments</h4>
                      <p className="text-sm text-gray-400">Get notified when teachers assign new tests</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Live Quiz Reminders</h4>
                      <p className="text-sm text-gray-400">Reminders for upcoming live quizzes</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Grade Updates</h4>
                      <p className="text-sm text-gray-400">Notifications when grades are posted</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Classroom Announcements</h4>
                      <p className="text-sm text-gray-400">Updates about classroom activities</p>
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

              {/* Privacy Settings */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#FF991C]" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Control your data and privacy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Profile Visibility</h4>
                      <p className="text-sm text-gray-400">Who can see your profile</p>
                    </div>
                    <Button variant="outline" size="sm">Classmates Only</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">Activity Status</h4>
                      <p className="text-sm text-gray-400">Show when you're online</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Puzzle className="h-5 w-5 text-[#FF991C]" />
                    Microsoft Teams Integration
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Connect your Microsoft Teams account to sync quizzes and participate in live sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamsIntegration onSuccess={() => {
                    console.log("Teams integration successful!");
                  }} />
                </CardContent>
              </Card>

              {/* Future Integrations */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>More Integrations Coming Soon</CardTitle>
                  <CardDescription className="text-gray-400">
                    We're working on adding more integrations to enhance your learning experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Google Classroom", status: "Coming Soon", icon: "🎓", desc: "Sync your classes" },
                      { name: "Microsoft OneNote", status: "Coming Soon", icon: "📝", desc: "Take notes during quizzes" },
                      { name: "Notion", status: "Coming Soon", icon: "📚", desc: "Export quiz results" },
                      { name: "Discord", status: "Coming Soon", icon: "🎮", desc: "Study group integration" },
                      { name: "Slack", status: "Coming Soon", icon: "💬", desc: "Classroom chat" },
                      { name: "Zoom", status: "Coming Soon", icon: "📹", desc: "Video quiz sessions" },
                    ].map((integration) => (
                      <div
                        key={integration.name}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 opacity-50"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{integration.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{integration.name}</h4>
                            <p className="text-xs text-gray-400 mb-1">{integration.desc}</p>
                            <span className="text-xs text-[#FF991C]">{integration.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Study Tools Integration */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#FF991C]" />
                    Study Tools & Extensions
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Enhance your learning with third-party study tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Grammarly", desc: "Check your quiz answers for grammar", icon: "✍️" },
                      { name: "Quizlet", desc: "Create flashcards from quiz questions", icon: "🎴" },
                      { name: "Anki", desc: "Spaced repetition learning", icon: "🧠" },
                    ].map((tool) => (
                      <div
                        key={tool.name}
                        className="p-3 bg-white/5 rounded-lg border border-white/10 opacity-50 flex items-center gap-3"
                      >
                        <span className="text-xl">{tool.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white">{tool.name}</h4>
                          <p className="text-xs text-gray-400">{tool.desc}</p>
                        </div>
                        <span className="text-xs text-[#FF991C]">Coming Soon</span>
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
