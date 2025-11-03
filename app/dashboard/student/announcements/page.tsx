"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  Megaphone,
  Pin,
  AlertCircle,
  BookOpen,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { subscribeToClassroomAnnouncements } from "@/lib/socket";

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

interface ClassroomWithAnnouncements {
  _id: string;
  name: string;
  subject: string;
  teacherId: {
    name: string;
  };
  announcements: Announcement[];
}

export default function StudentAnnouncementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<ClassroomWithAnnouncements[]>([]);
  const [expandedClassroom, setExpandedClassroom] = useState<string | null>(null);

  useEffect(() => {
    fetchClassroomsAndAnnouncements();
  }, []);

  // Subscribe to real-time updates for all classrooms
  useEffect(() => {
    if (classrooms.length === 0) return;

    const unsubscribeFns: (() => void)[] = [];

    classrooms.forEach((classroom) => {
      const unsubscribe = subscribeToClassroomAnnouncements(
        classroom._id,
        // Announcement added
        (newAnnouncement) => {
          setClassrooms((prev) =>
            prev.map((c) =>
              c._id === classroom._id
                ? { ...c, announcements: [newAnnouncement, ...c.announcements] }
                : c
            )
          );
        },
        // Announcement updated
        (updatedAnnouncement) => {
          setClassrooms((prev) =>
            prev.map((c) =>
              c._id === classroom._id
                ? {
                    ...c,
                    announcements: c.announcements.map((a) =>
                      a._id === updatedAnnouncement._id ? updatedAnnouncement : a
                    ),
                  }
                : c
            )
          );
        },
        // Announcement deleted
        (announcementId) => {
          setClassrooms((prev) =>
            prev.map((c) =>
              c._id === classroom._id
                ? { ...c, announcements: c.announcements.filter((a) => a._id !== announcementId) }
                : c
            )
          );
        }
      );
      unsubscribeFns.push(unsubscribe);
    });

    return () => {
      unsubscribeFns.forEach((fn) => fn());
    };
  }, [classrooms.length]); // Only re-subscribe when number of classrooms changes

  const fetchClassroomsAndAnnouncements = async () => {
    setLoading(true);
    try {
      // Fetch all student classrooms
      const classroomsResponse = await fetch('/api/student/classrooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const classroomsData = await classroomsResponse.json();
      if (classroomsData.classrooms) {
        // Fetch announcements for each classroom
        const classroomsWithAnnouncements = await Promise.all(
          classroomsData.classrooms.map(async (classroom: any) => {
            try {
              const announcementsResponse = await fetch(
                `/api/student/announcements?classroomId=${classroom._id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );
              const announcementsData = await announcementsResponse.json();
              return {
                ...classroom,
                announcements: announcementsData.announcements || [],
              };
            } catch (error) {
              console.error(`Failed to fetch announcements for classroom ${classroom._id}:`, error);
              return {
                ...classroom,
                announcements: [],
              };
            }
          })
        );

        setClassrooms(classroomsWithAnnouncements);
        // Auto-expand first classroom with announcements or just first classroom
        const firstWithAnnouncements = classroomsWithAnnouncements.find(c => c.announcements.length > 0);
        if (firstWithAnnouncements) {
          setExpandedClassroom(firstWithAnnouncements._id);
        } else if (classroomsWithAnnouncements.length > 0) {
          setExpandedClassroom(classroomsWithAnnouncements[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch classrooms:', error);
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

  return (
    <div className="min-h-screen bg-black pb-20">
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
        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-[#FF991C] animate-spin" />
          </div>
        ) : classrooms.length === 0 ? (
          /* No Classrooms */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
              <CardContent className="py-12 text-center">
                <Megaphone className="h-16 w-16 text-black/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No Classrooms Yet</h3>
                <p className="text-black/60">
                  You haven't joined any classrooms yet. Ask your teacher for an invitation!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Classrooms with Announcements */
          <div className="space-y-6">
            {classrooms.map((classroom, index) => {
              const pinnedAnnouncements = classroom.announcements.filter(a => a.pinned);
              const regularAnnouncements = classroom.announcements.filter(a => !a.pinned);
              const totalAnnouncements = classroom.announcements.length;

              return (
                <motion.div
                  key={classroom._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 overflow-hidden">
                    {/* Classroom Header */}
                    <CardHeader
                      className="cursor-pointer hover:bg-black/5 transition-colors"
                      onClick={() =>
                        setExpandedClassroom(
                          expandedClassroom === classroom._id ? null : classroom._id
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-[#FF991C]/20 p-3 rounded-xl">
                            <Megaphone className="h-6 w-6 text-[#FF991C]" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-black mb-1">
                              {classroom.name}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-black/60">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {classroom.subject || 'General'}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {classroom.teacherId?.name || 'Unknown Teacher'}
                              </span>
                              <span className="text-[#FF991C] font-medium">
                                {totalAnnouncements} announcement{totalAnnouncements !== 1 ? 's' : ''}
                                {pinnedAnnouncements.length > 0 && (
                                  <span className="ml-1">({pinnedAnnouncements.length} pinned)</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        {expandedClassroom === classroom._id ? (
                          <ChevronUp className="h-5 w-5 text-black/60" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-black/60" />
                        )}
                      </div>
                    </CardHeader>

                    {/* Announcements List */}
                    <AnimatePresence>
                      {expandedClassroom === classroom._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0">
                            {totalAnnouncements === 0 ? (
                              /* No Announcements for This Classroom */
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                                <h4 className="text-md font-semibold text-black mb-2">
                                  No Announcements Yet
                                </h4>
                                <p className="text-sm text-black/60 mb-3">
                                  {classroom.teacherId?.name || 'The teacher'} hasn't posted any announcements for this class yet.
                                </p>
                                <p className="text-xs text-black/50">
                                  💡 Tip: Check back later for important updates and information.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-6 pt-4">
                                {/* Pinned Announcements */}
                                {pinnedAnnouncements.length > 0 && (
                                  <div>
                                    <h3 className="text-sm font-semibold text-black/60 mb-3 flex items-center gap-2">
                                      <Pin className="h-4 w-4 text-[#FF991C]" />
                                      PINNED ANNOUNCEMENTS
                                    </h3>
                                    <div className="space-y-3">
                                      {pinnedAnnouncements.map((announcement) => (
                                        <div
                                          key={announcement._id}
                                          className="bg-gradient-to-br from-[#FF991C]/10 to-[#FF8F4D]/10 border border-[#FF991C]/30 rounded-lg p-4"
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              <Pin className="h-4 w-4 text-[#FF991C]" />
                                              {getPriorityIcon(announcement.priority)}
                                              <h4 className="text-md font-semibold text-black">
                                                {announcement.title}
                                              </h4>
                                            </div>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                              {announcement.priority.toUpperCase()}
                                            </span>
                                          </div>
                                          <p className="text-sm text-black/70 mb-2 whitespace-pre-wrap">
                                            {announcement.content}
                                          </p>
                                          <div className="flex items-center gap-3 text-xs text-black/50">
                                            <span>{new Date(announcement.createdAt).toLocaleString()}</span>
                                            <span>by {announcement.createdBy.name}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Regular Announcements */}
                                {regularAnnouncements.length > 0 && (
                                  <div>
                                    {pinnedAnnouncements.length > 0 && (
                                      <h3 className="text-sm font-semibold text-black/60 mb-3">
                                        ALL ANNOUNCEMENTS
                                      </h3>
                                    )}
                                    <div className="space-y-3">
                                      {regularAnnouncements.map((announcement) => (
                                        <div
                                          key={announcement._id}
                                          className="bg-white border border-[#FF991C]/10 rounded-lg p-4 hover:border-[#FF991C]/30 transition-all"
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              {getPriorityIcon(announcement.priority)}
                                              <h4 className="text-md font-semibold text-black">
                                                {announcement.title}
                                              </h4>
                                            </div>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                              {announcement.priority.toUpperCase()}
                                            </span>
                                          </div>
                                          <p className="text-sm text-black/70 mb-2 whitespace-pre-wrap">
                                            {announcement.content}
                                          </p>
                                          <div className="flex items-center gap-3 text-xs text-black/50">
                                            <span>{new Date(announcement.createdAt).toLocaleString()}</span>
                                            <span>by {announcement.createdBy.name}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
