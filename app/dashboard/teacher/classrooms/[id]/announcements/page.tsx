"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Plus,
  X,
  Trash2,
  Edit,
  Loader2,
  Megaphone,
  Pin,
  PinOff,
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
    email: string;
  };
  createdAt: string;
}

export default function TeacherAnnouncementsPage() {
  const router = useRouter();
  const params = useParams();
  const classroomId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, [classroomId]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/teacher/announcements?classroomId=${classroomId}`, {
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

  const resetForm = () => {
    setTitle("");
    setContent("");
    setPriority('medium');
    setPinned(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingId 
        ? `/api/teacher/announcements/${editingId}`
        : '/api/teacher/announcements';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          content,
          priority,
          pinned,
          classroomId,
        }),
      });

      const data = await response.json();
      if (data.announcement) {
        if (editingId) {
          setAnnouncements(announcements.map(a => 
            a._id === editingId ? data.announcement : a
          ));
        } else {
          setAnnouncements([data.announcement, ...announcements]);
        }
        resetForm();
      } else {
        alert(data.error || 'Failed to save announcement');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setTitle(announcement.title);
    setContent(announcement.content);
    setPriority(announcement.priority);
    setPinned(announcement.pinned);
    setEditingId(announcement._id);
    setShowForm(true);
  };

  const handleDelete = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await fetch(`/api/teacher/announcements/${announcementId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setAnnouncements(announcements.filter(a => a._id !== announcementId));
      } else {
        alert('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete announcement');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#FF991C] animate-spin mx-auto mb-4" />
          <p className="text-[#F5F5F5]">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <nav className="border-b border-[#FF991C]/20 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/dashboard/teacher/classrooms/${classroomId}`}>
              <Button variant="ghost" className="text-[#F5F5F5] hover:bg-[#FF991C]/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Classroom
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
          {/* Create Button */}
          <div className="mb-8">
            <Button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-semibold"
            >
              {showForm ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  New Announcement
                </>
              )}
            </Button>
          </div>

          {/* Form */}
          {showForm && (
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 mb-8">
              <CardHeader>
                <CardTitle className="text-black">
                  {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                </CardTitle>
                <CardDescription className="text-black/60">
                  Share important information with your students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-black">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter announcement title"
                      className="bg-white border-black/20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-black">Content *</Label>
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter announcement content"
                      className="w-full px-3 py-2 bg-white border border-black/20 rounded-md min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority" className="text-black">Priority</Label>
                      <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-black/20 rounded-md"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-black">Pin to Top</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id="pinned"
                          checked={pinned}
                          onChange={(e) => setPinned(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="pinned" className="text-sm text-black/70">
                          Pin this announcement
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          {editingId ? 'Update' : 'Create'} Announcement
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="border-black/20"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Announcements List */}
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
                <CardContent className="py-12 text-center">
                  <Megaphone className="h-16 w-16 text-black/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">No announcements yet</h3>
                  <p className="text-black/60 mb-4">
                    Create your first announcement to share with students
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Announcement
                  </Button>
                </CardContent>
              </Card>
            ) : (
              announcements.map((announcement, index) => (
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
                          {announcement.pinned && (
                            <Pin className="h-5 w-5 text-[#FF991C]" />
                          )}
                          <h3 className="text-xl font-semibold text-black">
                            {announcement.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority.toUpperCase()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(announcement)}
                            className="border-[#FF991C]/30 hover:bg-[#FF991C]/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(announcement._id)}
                            className="border-red-500/30 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
