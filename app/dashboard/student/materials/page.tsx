"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Download,
  Loader2,
  File,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface Material {
  _id: string;
  title: string;
  description?: string;
  type: 'pdf' | 'image' | 'video' | 'link' | 'document';
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  uploadedBy: {
    name: string;
  };
  createdAt: string;
}

interface Classroom {
  _id: string;
  name: string;
}

export default function StudentMaterialsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      fetchMaterials(selectedClassroom);
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

  const fetchMaterials = async (classroomId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/student/materials?classroomId=${classroomId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.materials) {
        setMaterials(data.materials);
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="h-8 w-8" />;
      case 'image':
        return <Image className="h-8 w-8" />;
      case 'video':
        return <Video className="h-8 w-8" />;
      case 'link':
        return <LinkIcon className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return 'text-red-500';
      case 'image':
        return 'text-blue-500';
      case 'video':
        return 'text-purple-500';
      case 'link':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

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
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Study Materials</h1>
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
          ) : materials.length === 0 ? (
            /* Empty State */
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 text-black/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No materials available</h3>
                <p className="text-black/60">
                  Your teacher hasn't uploaded any study materials yet
                </p>
              </CardContent>
            </Card>
          ) : (
            /* Materials List */
            <div className="grid grid-cols-1 gap-6">
              {materials.map((material, index) => (
                <motion.div
                  key={material._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 hover:border-[#FF991C]/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`${getTypeColor(material.type)} bg-white p-3 rounded-lg`}>
                          {getTypeIcon(material.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-black mb-1">
                            {material.title}
                          </h3>
                          {material.description && (
                            <p className="text-sm text-black/60 mb-2">
                              {material.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-black/50">
                            <span className="capitalize">{material.type}</span>
                            {material.fileSize && (
                              <span>{formatFileSize(material.fileSize)}</span>
                            )}
                            <span>Uploaded by {material.uploadedBy.name}</span>
                            <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div>
                          <a
                            href={material.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {material.type === 'link' ? 'Open Link' : 'Download'}
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
