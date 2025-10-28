"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherApi } from "@/lib/api";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateClassroomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await teacherApi.createClassroom(formData);

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.data) {
        router.push("/dashboard/teacher");
      }
    } catch (err) {
      setError("Failed to create classroom");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="relative z-10 container mx-auto px-6 py-8">
        <Link href="/dashboard/teacher">
          <Button variant="ghost" className="text-[#F5F5F5] hover:bg-white/10 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#FFA266]/20 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-[#FFA266]" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-black">Create New Classroom</CardTitle>
                  <CardDescription className="text-black/60">
                    Set up a new class for your German language students
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold text-black">
                    Classroom Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., German A1 - Batch 2025"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 border-gray-300 focus:border-[#FFA266] focus:ring-[#FFA266]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold text-black">
                    Description (Optional)
                  </Label>
                  <textarea
                    id="description"
                    placeholder="Brief description of the classroom..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:border-[#FFA266] focus:ring-[#FFA266] focus:ring-1"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 h-12 border-2"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-[#FFA266] hover:bg-[#FF8F4D] text-black font-semibold shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Classroom"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
