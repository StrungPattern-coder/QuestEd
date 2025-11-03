"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Link as LinkIcon,
  Unlink,
  Users,
  MessageSquare,
  Send,
  AlertCircle,
  RefreshCw,
  Download
} from "lucide-react";
import confetti from "canvas-confetti";
import { playSoundEffect } from "@/lib/sounds";

interface TeamsIntegrationProps {
  onSuccess?: () => void;
}

interface Integration {
  accountType: string;
  email: string;
  displayName: string;
  connectedAt: string;
  lastSyncAt: string;
}

interface Team {
  id: string;
  displayName: string;
  description?: string;
}

interface Channel {
  id: string;
  displayName: string;
  description?: string;
}

export default function TeamsIntegration({ onSuccess }: TeamsIntegrationProps) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<any>(null);
  const [error, setError] = useState("");
  const [showAdminHelp, setShowAdminHelp] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (connected) {
      loadTeams();
    }
  }, [connected]);

  useEffect(() => {
    if (selectedTeam) {
      loadChannels(selectedTeam);
    }
  }, [selectedTeam]);

  const checkConnection = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/teams/integration/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConnected(data.connected);
        setIntegration(data.integration);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const handleConnect = async (accountType: 'personal' | 'work') => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/teams/auth/initiate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Microsoft OAuth
        window.location.href = data.authUrl;
      } else {
        setError("Failed to initiate connection");
        setLoading(false);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setError("An error occurred");
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const confirmed = confirm(
        "Are you sure you want to disconnect Microsoft Teams? You will no longer be able to send notifications to Teams."
      );

      if (!confirmed) return;

      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/teams/integration/status", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setConnected(false);
        setIntegration(null);
        setTeams([]);
        setChannels([]);
        setSelectedTeam("");
        setSelectedChannel("");
        playSoundEffect.wrongAnswer();
      } else {
        setError("Failed to disconnect");
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const loadTeams = async () => {
    try {
      setLoadingTeams(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/teams/integration/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams || []);
      }
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const loadChannels = async (teamId: string) => {
    try {
      setLoadingChannels(true);
      setChannels([]);
      setSelectedChannel("");
      
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/teams/integration/channels?teamId=${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setChannels(data.channels || []);
      }
    } catch (error) {
      console.error("Error loading channels:", error);
    } finally {
      setLoadingChannels(false);
    }
  };

  const sendTestNotification = async () => {
    if (!selectedTeam || !selectedChannel) {
      setError("Please select a team and channel");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");

      const response = await fetch("/api/teams/integration/post-message", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: selectedTeam,
          channelId: selectedChannel,
          message: "🎉 QuestEd is now connected! You'll receive quiz and test notifications here.",
        }),
      });

      if (response.ok) {
        playSoundEffect.achievement();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        alert("Test notification sent successfully!");
        if (onSuccess) onSuccess();
      } else {
        setError("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncFromTeams = async () => {
    if (!confirm("This will import all your Microsoft Teams classrooms and students into QuestEd. Continue?")) {
      return;
    }

    try {
      setSyncing(true);
      setError("");
      setSyncResults(null);
      
      const token = localStorage.getItem("token");

      const response = await fetch("/api/teams/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSyncResults(data.results);
        playSoundEffect.achievement();
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#5B5FC7', '#7c3aed', '#06b6d4'],
        });
        
        // Reload classrooms after sync
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to sync Teams data");
      }
    } catch (error: any) {
      console.error("Error syncing from Teams:", error);
      setError(error.message || "An error occurred during sync");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-[#5B5FC7]" />
          Microsoft Teams Integration
        </CardTitle>
        <CardDescription>
          Connect your Microsoft Teams to send quiz and test notifications directly to your channels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!connected ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connect Microsoft Teams
              </h3>
              <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                Choose your account type to connect. Both personal Microsoft accounts and organizational (work/school) accounts are supported.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Button
                  onClick={() => handleConnect('work')}
                  disabled={loading}
                  className="h-auto py-4 px-6 flex flex-col items-center gap-2 bg-[#5B5FC7] hover:bg-[#4B4FB7]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Users className="w-6 h-6" />
                      <div>
                        <div className="font-semibold">Work or School</div>
                        <div className="text-xs opacity-90">Organization account</div>
                      </div>
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleConnect('personal')}
                  disabled={loading}
                  variant="outline"
                  className="h-auto py-4 px-6 flex flex-col items-center gap-2 border-2 border-[#5B5FC7] text-[#5B5FC7] hover:bg-[#5B5FC7] hover:text-white"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <LinkIcon className="w-6 h-6" />
                      <div>
                        <div className="font-semibold">Personal</div>
                        <div className="text-xs opacity-90">Microsoft account</div>
                      </div>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Connected</p>
                  <p className="text-sm text-green-700">
                    {integration?.displayName} ({integration?.email})
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Account type: {integration?.accountType}
                  </p>
                </div>
                <Button
                  onClick={handleDisconnect}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                  className="text-green-700 hover:text-green-900 hover:bg-green-100"
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>

            {/* Sync from Teams Button */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Import from Microsoft Teams</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Sync your Teams classrooms, students, and assignments into QuestEd. This will create classrooms for all your Teams classes.
                  </p>
                  <Button
                    onClick={handleSyncFromTeams}
                    disabled={syncing}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    {syncing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync from Teams
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Sync Results */}
            {syncResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">Sync Completed!</p>
                    <div className="text-xs text-green-700 mt-2 space-y-1">
                      <p>✅ Created {syncResults.classroomsCreated} new classrooms</p>
                      <p>✅ Updated {syncResults.classroomsUpdated} existing classrooms</p>
                      <p>✅ Added {syncResults.studentsAdded} new students</p>
                      {syncResults.errors.length > 0 && (
                        <p className="text-yellow-700">⚠️ {syncResults.errors.length} errors occurred</p>
                      )}
                    </div>
                    <p className="text-xs text-green-600 mt-2">Reloading page in 3 seconds...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Team Selection */}
            <div className="space-y-2">
              <Label htmlFor="team">Select Team</Label>
              {loadingTeams ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#5B5FC7]" />
                  <span className="ml-2 text-sm text-gray-600">Loading teams...</span>
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-600">
                  No teams found. Make sure you're a member of at least one team.
                </div>
              ) : (
                <select
                  id="team"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B5FC7]"
                >
                  <option value="">Choose a team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.displayName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Channel Selection */}
            {selectedTeam && (
              <div className="space-y-2">
                <Label htmlFor="channel">Select Channel</Label>
                {loadingChannels ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#5B5FC7]" />
                    <span className="ml-2 text-sm text-gray-600">Loading channels...</span>
                  </div>
                ) : channels.length === 0 ? (
                  <div className="text-center py-4 text-sm text-gray-600">
                    No channels found in this team.
                  </div>
                ) : (
                  <select
                    id="channel"
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B5FC7]"
                  >
                    <option value="">Choose a channel...</option>
                    {channels.map((channel) => (
                      <option key={channel.id} value={channel.id}>
                        {channel.displayName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Send Test Notification */}
            {selectedChannel && (
              <Button
                onClick={sendTestNotification}
                disabled={loading}
                className="w-full bg-[#5B5FC7] hover:bg-[#4B4FB7]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Test Notification
              </Button>
            )}
          </div>
        )}

        {/* Admin Approval Help Section */}
        <div className="border-t pt-4 mt-6">
          <button
            onClick={() => setShowAdminHelp(!showAdminHelp)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            Getting "Admin approval required" error?
          </button>
          
          {showAdminHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm"
            >
              <h4 className="font-semibold text-yellow-900 mb-2">Why am I seeing this error?</h4>
              <p className="text-yellow-800 mb-3">
                Your organization requires admin consent before third-party apps can access Microsoft Teams data. This is a common security policy.
              </p>
              
              <h4 className="font-semibold text-yellow-900 mb-2">Solutions:</h4>
              <ul className="space-y-2 text-yellow-800">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>
                    <strong>Use a Personal Microsoft Account:</strong> If you have a personal Microsoft account (e.g., yourname@outlook.com, @hotmail.com), click the "Personal" button instead.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>
                    <strong>Request Admin Consent:</strong> Contact your IT administrator and share this Azure AD App ID: <code className="bg-yellow-100 px-1 py-0.5 rounded">0b9142a9-fcdd-45dc-8a42-6618065dc0de</code>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>
                    <strong>Test Without Teams:</strong> You can still use all QuestEd features without Teams integration. Create classrooms manually instead.
                  </span>
                </li>
              </ul>

              <div className="mt-3 pt-3 border-t border-yellow-300">
                <p className="text-xs text-yellow-700">
                  <strong>Note for Students:</strong> If you're testing with a student account, you'll need teacher/administrator privileges to connect Teams. Try using a personal account or manual classroom creation instead.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
