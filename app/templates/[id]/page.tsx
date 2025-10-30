'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Copy,
  Clock,
  Eye,
  Star,
  Users,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { getCategoryIcon, getCategoryColor, getDifficultyById } from '@/lib/templateCategories';

interface TemplateQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface TemplateDetail {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: TemplateQuestion[];
  questionsCount: number;
  estimatedTime: number;
  timeLimitPerQuestion: number;
  cloneCount: number;
  averageRating: number;
  ratingCount: number;
  authorName: string;
  isOfficial: boolean;
  tags: string[];
  createdAt: string;
}

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<TemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchTemplate();
      fetchClassrooms();
    }
  }, [params.id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${params.id}`);
      const data = await response.json();
      setTemplate(data);
      setCustomTitle(data.title);
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/teacher/classrooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setClassrooms(data.classrooms || []);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const handleClone = async () => {
    if (!selectedClassroom) {
      alert('Please select a classroom');
      return;
    }

    setCloning(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/templates/${params.id}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          classroomId: selectedClassroom,
          title: customTitle,
          mode: 'deadline',
          startTime: new Date(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Template cloned successfully!');
        router.push('/dashboard/teacher');
      } else {
        alert(data.error || 'Failed to clone template');
      }
    } catch (error) {
      console.error('Error cloning template:', error);
      alert('An error occurred while cloning the template');
    } finally {
      setCloning(false);
      setShowCloneModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Template not found</p>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(template.category);
  const categoryColor = getCategoryColor(template.category);
  const difficulty = getDifficultyById(template.difficulty);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Templates
        </button>

        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="h-3" style={{ backgroundColor: categoryColor }}></div>

          <div className="p-8">
            {/* Category and Tags */}
            <div className="flex items-center gap-3 mb-4">
              <CategoryIcon className="w-6 h-6" style={{ color: categoryColor }} />
              <span className="text-lg font-semibold" style={{ color: categoryColor }}>
                {template.category}
              </span>
              {template.isOfficial && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  ✓ Official Template
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {template.title}
            </h1>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              {template.description}
            </p>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Eye className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.questionsCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Questions</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.estimatedTime}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Minutes</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Copy className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.cloneCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Clones</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500 fill-yellow-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.averageRating.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {template.ratingCount} ratings
                </div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`text-sm font-semibold ${difficulty?.badge} px-3 py-2 rounded-lg`}>
                  {difficulty?.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Difficulty</div>
              </div>
            </div>

            {/* Author and Clone Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Users className="w-5 h-5" />
                <span>Created by {template.authorName}</span>
              </div>

              <button
                onClick={() => setShowCloneModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg hover:shadow-xl"
              >
                <Copy className="w-5 h-5" />
                Clone to My Classroom
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Questions Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Questions Preview
          </h3>

          <div className="space-y-6">
            {template.questions.map((question, idx) => (
              <div
                key={idx}
                className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <p className="text-lg font-medium text-gray-900 dark:text-white flex-1">
                    {question.questionText}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
                  {question.options.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-lg border-2 ${
                        option === question.correctAnswer
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">{option}</span>
                        {option === question.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clone Modal */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Clone Template
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Test Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Enter custom title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Classroom
                </label>
                <select
                  value={selectedClassroom}
                  onChange={(e) => setSelectedClassroom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">-- Select Classroom --</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom._id} value={classroom._id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCloneModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                disabled={cloning}
              >
                Cancel
              </button>
              <button
                onClick={handleClone}
                disabled={cloning || !selectedClassroom}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cloning ? 'Cloning...' : 'Clone Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
