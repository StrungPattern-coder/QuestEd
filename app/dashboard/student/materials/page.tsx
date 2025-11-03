"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Download,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  File,
  User,
  FolderOpen,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { subscribeToClassroomMaterials } from "@/lib/socket";

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

interface ClassroomWithMaterials {
  _id: string;
  name: string;
  subject: string;
  teacherId: {
    name: string;
  };
  materials: Material[];
}

export default function StudentMaterialsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<ClassroomWithMaterials[]>([]);
  const [expandedClassroom, setExpandedClassroom] = useState<string | null>(null);

  useEffect(() => {
    fetchClassroomsAndMaterials();
  }, []);

  // Subscribe to real-time updates for all classrooms
  useEffect(() => {
    if (classrooms.length === 0) return;

    const unsubscribeFns: (() => void)[] = [];

    classrooms.forEach((classroom) => {
      const unsubscribe = subscribeToClassroomMaterials(
        classroom._id,
        // Material added
        (newMaterial) => {
          setClassrooms((prev) =>
            prev.map((c) =>
              c._id === classroom._id
                ? { ...c, materials: [newMaterial, ...c.materials] }
                : c
            )
          );
        },
        // Material deleted
        (materialId) => {
          setClassrooms((prev) =>
            prev.map((c) =>
              c._id === classroom._id
                ? { ...c, materials: c.materials.filter((m) => m._id !== materialId) }
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

  const fetchClassroomsAndMaterials = async () => {
    setLoading(true);
    try {
      // Fetch classrooms the student is part of
      const classroomsResponse = await fetch('/api/student/classrooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!classroomsResponse.ok) {
        throw new Error('Failed to fetch classrooms');
      }

      const classroomsData = await classroomsResponse.json();
      
      // Fetch materials for each classroom
      const classroomsWithMaterials = await Promise.all(
        classroomsData.classrooms.map(async (classroom: any) => {
          try {
            const materialsResponse = await fetch(
              `/api/student/materials?classroomId=${classroom._id}`,
              {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );

            if (materialsResponse.ok) {
              const materialsData = await materialsResponse.json();
              return {
                ...classroom,
                materials: materialsData.materials || [],
              };
            }
          } catch (error) {
            console.error(`Failed to fetch materials for ${classroom.name}:`, error);
          }
          
          return {
            ...classroom,
            materials: [],
          };
        })
      );

      setClassrooms(classroomsWithMaterials);
      // Auto-expand first classroom
      if (classroomsWithMaterials.length > 0) {
        setExpandedClassroom(classroomsWithMaterials[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch classrooms and materials:', error);
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
        return <ImageIcon className="h-8 w-8" />;
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
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Study Materials</h1>
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
                <BookOpen className="h-16 w-16 text-black/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">No Classrooms Yet</h3>
                <p className="text-black/60">
                  You haven't joined any classrooms yet. Ask your teacher for an invitation!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Classrooms with Materials */
          <div className="space-y-6">
            {classrooms.map((classroom, index) => (
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
                          <FolderOpen className="h-6 w-6 text-[#FF991C]" />
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
                              {classroom.materials.length} material{classroom.materials.length !== 1 ? 's' : ''}
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

                  {/* Materials List */}
                  <AnimatePresence>
                    {expandedClassroom === classroom._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          {classroom.materials.length === 0 ? (
                            /* No Materials for This Classroom */
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                              <h4 className="text-md font-semibold text-black mb-2">
                                No Study Materials Yet
                              </h4>
                              <p className="text-sm text-black/60 mb-3">
                                {classroom.teacherId?.name || 'The teacher'} hasn't uploaded any materials for this subject yet.
                              </p>
                              <p className="text-xs text-black/50">
                                💡 Tip: Check back later or contact your teacher if you need specific materials.
                              </p>
                            </div>
                          ) : (
                            /* Materials Grid */
                            <div className="grid grid-cols-1 gap-4 pt-4">
                              {classroom.materials.map((material) => (
                                <div
                                  key={material._id}
                                  className="bg-white border border-[#FF991C]/10 rounded-lg p-4 hover:border-[#FF991C]/30 transition-all hover:shadow-md"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className={`${getTypeColor(material.type)} bg-gray-50 p-3 rounded-lg flex-shrink-0`}>
                                      {getTypeIcon(material.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-md font-semibold text-black mb-1">
                                        {material.title}
                                      </h4>
                                      {material.description && (
                                        <p className="text-sm text-black/60 mb-2">
                                          {material.description}
                                        </p>
                                      )}
                                      <div className="flex flex-wrap items-center gap-3 text-xs text-black/50">
                                        <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                                          {material.type}
                                        </span>
                                        {material.fileSize && (
                                          <span>{formatFileSize(material.fileSize)}</span>
                                        )}
                                        <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                      <a
                                        href={material.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Button
                                          size="sm"
                                          className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black"
                                        >
                                          <Download className="h-4 w-4 mr-2" />
                                          {material.type === 'link' ? 'Open' : 'Download'}
                                        </Button>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
