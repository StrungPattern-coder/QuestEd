"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import TeamsIntegration from "@/components/TeamsIntegration";

export default function IntegrationsPage() {
  const router = useRouter();

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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <Puzzle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Integrations</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Connect your QuestEd account with external platforms to sync data and enhance functionality.
          </p>
        </motion.div>

        {/* Teams Integration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TeamsIntegration onSuccess={() => {
            console.log("Teams integration successful!");
          }} />
        </motion.div>

        {/* Future Integrations Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
        >
          <h3 className="text-xl font-semibold mb-2">More Integrations Coming Soon</h3>
          <p className="text-gray-400">
            We're working on adding more integrations like Google Classroom, Slack, and Discord. Stay tuned!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
