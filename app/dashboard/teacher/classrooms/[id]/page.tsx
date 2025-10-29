"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherApi } from "@/lib/api";
import { 
  ArrowLeft, 
  Users, 
  Mail, 
  Loader2, 
  Trash2, 
  UserPlus,
  Copy,
  CheckCircle,
  BookOpen,
  FileText
} from "lucide-react";
import Link from "next/link";

interface Student {
  _id: string;
  name: string;
  email: string;
  enrollmentNumber?: string;
}

interface Classroom {
  _id: string;
  name: string;
  description: string;
  students: Student[];
  createdAt: string;
}

export default function ClassroomDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classroomId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [error, setError] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => {
    fetchClassroomDetails();
  }, [classroomId]);

  const fetchClassroomDetails = async () => {
    setLoading(true);
    try {
      const response = await teacherApi.getClassrooms();
      if (response.data) {
        const classrooms = (response.data as any).classrooms || [];
        const found = classrooms.find((c: any) => c._id === classroomId);
        if (found) {
          setClassroom(found);
        } else {
          setError("Classroom not found");
        }
      }
    } catch (err) {
      setError("Failed to load classroom details");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) return;

    setInviting(true);
    setError("");
    setInviteSuccess("");

    try {
      const response = await teacherApi.inviteStudent(classroomId, studentEmail);
      
      if (response.error) {
        setError(response.error);
      } else {
        setInviteSuccess(`Invitation sent to ${studentEmail}`);
        setStudentEmail("");
        // Refresh classroom data
        await fetchClassroomDetails();
      }
    } catch (err) {
      setError("Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to remove this student?")) return;

    try {
      const response = await teacherApi.removeStudent(classroomId, studentId);
      if (response.error) {
        setError(response.error);
      } else {
        await fetchClassroomDetails();
      }
    } catch (err) {
      setError("Failed to remove student");
    }
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/join-classroom/${classroomId}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF991C]" />
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">Classroom Not Found</h2>
          <Link href="/dashboard/teacher">
            <Button className="bg-[#FF991C] hover:bg-[#FF8F4D]">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
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
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <Card className="bg-[#F5F5F5]/95 border-[#FF991C]/20 mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#FF991C]/20 p-4 rounded-xl">
                    <BookOpen className="h-8 w-8 text-[#FF991C]" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-black mb-1">{classroom.name}</CardTitle>
                    <CardDescription className="text-black/70 text-base">
                      {classroom.description || "No description provided"}
                    </CardDescription>
                    <p className="text-sm text-black/50 mt-2">
                      {classroom.students.length} student{classroom.students.length !== 1 ? "s" : ""} enrolled
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {inviteSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              {inviteSuccess}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invite Student Card */}
            <Card className="bg-[#F5F5F5]/95 border-[#FF991C]/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-[#FF991C]/20 p-2 rounded-lg">
                    <UserPlus className="h-5 w-5 text-[#FF991C]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-black">Invite Student</CardTitle>
                    <CardDescription className="text-black/60">Send invitation via email</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInviteStudent} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="student@ms.pict.edu"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="h-12"
                      required
                    />
                    <p className="text-xs text-black/60">
                      Student must have an account with this email
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-semibold"
                    disabled={inviting}
                  >
                    {inviting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-black/10">
                  <p className="text-sm text-black/70 mb-3">Or share this link:</p>
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="w-full border-[#FF991C]/30 hover:border-[#FF991C] hover:bg-[#FF991C]/10"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Invite Link
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="bg-[#F5F5F5]/95 border-[#FF991C]/20">
              <CardHeader>
                <CardTitle className="text-xl text-black">Classroom Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-[#FF991C]" />
                    <span className="text-black font-medium">Total Students</span>
                  </div>
                  <span className="text-2xl font-bold text-black">{classroom.students.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#FF991C]" />
                    <span className="text-black font-medium">Tests Created</span>
                  </div>
                  <span className="text-2xl font-bold text-black">-</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#FF991C]" />
                    <span className="text-black font-medium">Created</span>
                  </div>
                  <span className="text-sm text-black/70">
                    {new Date(classroom.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Students List */}
          <Card className="bg-[#F5F5F5]/95 border-[#FF991C]/20 mt-6">
            <CardHeader>
              <CardTitle className="text-2xl text-black">Enrolled Students</CardTitle>
              <CardDescription className="text-black/60">
                Manage students in this classroom
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classroom.students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-black/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">No Students Yet</h3>
                  <p className="text-sm text-black/60">
                    Invite students using the form above to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {classroom.students.map((student, index) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-[#FF991C]/10 hover:border-[#FF991C]/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#FF991C]/20 w-12 h-12 rounded-full flex items-center justify-center">
                          <span className="text-[#FF991C] font-bold text-lg">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-black">{student.name}</h4>
                          <p className="text-sm text-black/60">{student.email}</p>
                          {student.enrollmentNumber && (
                            <p className="text-xs text-black/50">Enrollment: {student.enrollmentNumber}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRemoveStudent(student._id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
