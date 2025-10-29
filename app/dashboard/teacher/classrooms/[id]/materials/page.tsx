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
  Upload,
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Trash2,
  Download,
  Loader2,
  Plus,
  X,
  File,
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
    email: string;
  };
  createdAt: string;
}

export default function TeacherMaterialsPage() {
  const router = useRouter();
  const params = useParams();
  const classroomId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<'pdf' | 'image' | 'video' | 'link' | 'document'>('pdf');
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, [classroomId]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/teacher/materials?classroomId=${classroomId}`, {
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !fileUrl.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      const response = await fetch('/api/teacher/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          description,
          type,
          fileUrl,
          fileName: fileName || title,
          classroomId,
        }),
      });

      const data = await response.json();
      if (data.material) {
        setMaterials([data.material, ...materials]);
        // Reset form
        setTitle("");
        setDescription("");
        setFileUrl("");
        setFileName("");
        setShowUploadForm(false);
      } else {
        alert(data.error || 'Failed to upload material');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload material');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const response = await fetch(`/api/teacher/materials/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setMaterials(materials.filter(m => m._id !== materialId));
      } else {
        alert('Failed to delete material');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete material');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#FF991C] animate-spin mx-auto mb-4" />
          <p className="text-[#F5F5F5]">Loading materials...</p>
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
          {/* Upload Button */}
          <div className="mb-8">
            <Button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-semibold"
            >
              {showUploadForm ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Material
                </>
              )}
            </Button>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 mb-8">
              <CardHeader>
                <CardTitle className="text-black">Upload New Material</CardTitle>
                <CardDescription className="text-black/60">
                  Add study materials for your students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-black">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter material title"
                      className="bg-white border-black/20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-black">Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description (optional)"
                      className="bg-white border-black/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-black">Type *</Label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-black/20 rounded-md"
                      required
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="document">Document</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="link">External Link</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="fileUrl" className="text-black">
                      {type === 'link' ? 'URL' : 'File URL'} *
                    </Label>
                    <Input
                      id="fileUrl"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder={type === 'link' ? 'https://example.com' : 'https://your-storage.com/file.pdf'}
                      className="bg-white border-black/20"
                      required
                    />
                    <p className="text-xs text-black/60 mt-1">
                      Upload files to Google Drive, Dropbox, or your preferred storage and paste the public link here
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="fileName" className="text-black">File Name</Label>
                    <Input
                      id="fileName"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="Enter file name (optional)"
                      className="bg-white border-black/20"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={uploading}
                      className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Material
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowUploadForm(false)}
                      className="border-black/20"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Materials List */}
          <div className="grid grid-cols-1 gap-6">
            {materials.length === 0 ? (
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
                <CardContent className="py-12 text-center">
                  <Upload className="h-16 w-16 text-black/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">No materials yet</h3>
                  <p className="text-black/60 mb-4">
                    Upload study materials for your students
                  </p>
                  <Button
                    onClick={() => setShowUploadForm(true)}
                    className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Material
                  </Button>
                </CardContent>
              </Card>
            ) : (
              materials.map((material, index) => (
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
                            <span>Uploaded {new Date(material.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={material.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#FF991C]/30 hover:bg-[#FF991C]/10"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              {material.type === 'link' ? 'Open' : 'Download'}
                            </Button>
                          </a>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(material._id)}
                            className="border-red-500/30 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
