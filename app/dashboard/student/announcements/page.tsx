"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  Megaphone,
  Pin,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  pinned: boolean;
  createdBy: {
    name: string;
  };
  createdAt: string;
}

interface Classroom {
  _id: string;
  name: string;
}

export default function StudentAnnouncementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      fetchAnnouncements(selectedClassroom);
    }
  }, [selectedClassroom]);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('/api/student/tests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.tests) {
        // Extract unique classrooms
        const uniqueClassrooms = Array.from(
          new Map(
            data.tests.map((test: any) => [
              test.classroomId._id,
              {
                _id: test.classroomId._id,
                name: test.classroomId.name,
              },
            ])
          ).values()
        );
        setClassrooms(uniqueClassrooms as Classroom[]);
        if (uniqueClassrooms.length > 0) {
          setSelectedClassroom((uniqueClassrooms[0] as Classroom)._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch classrooms:', error);
    }
  };

  const fetchAnnouncements = async (classroomId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/student/announcements?classroomId=${classroomId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.announcements) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
    return null;
  };

  const pinnedAnnouncements = announcements.filter(a => a.pinned);
  const regularAnnouncements = announcements.filter(a => !a.pinned);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <nav className="border-b border-[#FF991C]/20 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/student">
              <Button variant="ghost" className="text-[#F5F5F5] hover:bg-[#FF991C]/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Announcements</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Classroom Selector */}
          {classrooms.length > 0 && (
            <div className="mb-8">
              <label className="block text-[#F5F5F5] text-sm font-medium mb-2">
                Select Classroom
              </label>
              <select
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                className="w-full max-w-md px-4 py-2 bg-[#F5F5F5]/95 border border-[#FF991C]/20 rounded-md text-black"
              >
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-[#FF991C] animate-spin" />
            </div>
          ) : announcements.length === 0 ? (
            /* Empty State */
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
              <CardContent className="py-12 text-center">
                <Megaphone className="h-16 w-16 text-black/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No announcements</h3>
                <p className="text-black/60">
                  Your teacher hasn't posted any announcements yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Pinned Announcements */}
              {pinnedAnnouncements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <Pin className="h-5 w-5 text-[#FF991C]" />
                    Pinned Announcements
                  </h2>
                  <div className="space-y-4">
                    {pinnedAnnouncements.map((announcement, index) => (
                      <motion.div
                        key={announcement._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="backdrop-blur-xl bg-gradient-to-br from-[#FF991C]/20 to-[#FF8F4D]/20 border-[#FF991C]/50">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Pin className="h-5 w-5 text-[#FF991C]" />
                                {getPriorityIcon(announcement.priority)}
                                <h3 className="text-xl font-semibold text-[#F5F5F5]">
                                  {announcement.title}
                                </h3>
                              </div>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                {announcement.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[#F5F5F5]/90 mb-3 whitespace-pre-wrap">
                              {announcement.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-[#F5F5F5]/70">
                              <span>Posted {new Date(announcement.createdAt).toLocaleString()}</span>
                              <span>by {announcement.createdBy.name}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Announcements */}
              {regularAnnouncements.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">
                    All Announcements
                  </h2>
                  <div className="space-y-4">
                    {regularAnnouncements.map((announcement, index) => (
                      <motion.div
                        key={announcement._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 hover:border-[#FF991C]/50 transition-all">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {getPriorityIcon(announcement.priority)}
                                <h3 className="text-xl font-semibold text-black">
                                  {announcement.title}
                                </h3>
                              </div>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                {announcement.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-black/70 mb-3 whitespace-pre-wrap">
                              {announcement.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-black/50">
                              <span>Posted {new Date(announcement.createdAt).toLocaleString()}</span>
                              <span>by {announcement.createdBy.name}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
