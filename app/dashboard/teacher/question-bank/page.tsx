"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  BookOpen,
  Search,
  Filter,
  Upload,
  Download,
  Check,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface QuestionBankItem {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject?: string;
  topic?: string;
  tags: string[];
  explanation?: string;
  timesUsed: number;
  createdAt: string;
}

export default function QuestionBankPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionBankItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters
  const [subjects, setSubjects] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [questionTags, setQuestionTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, filterSubject, filterDifficulty, filterTag, searchQuery]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/teacher/question-bank', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.questions) {
        setQuestions(data.questions);
        setFilteredQuestions(data.questions);
      }
      if (data.filters) {
        setSubjects(data.filters.subjects || []);
        setTags(data.filters.tags || []);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    if (filterSubject) {
      filtered = filtered.filter(q => q.subject === filterSubject);
    }

    if (filterDifficulty) {
      filtered = filtered.filter(q => q.difficulty === filterDifficulty);
    }

    if (filterTag) {
      filtered = filtered.filter(q => q.tags.includes(filterTag));
    }

    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setDifficulty('medium');
    setSubject("");
    setTopic("");
    setQuestionTags([]);
    setTagInput("");
    setExplanation("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || options.some(o => !o.trim())) {
      alert('Please fill in the question and all options');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingId 
        ? `/api/teacher/question-bank/${editingId}`
        : '/api/teacher/question-bank';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          question,
          options,
          correctAnswer,
          difficulty,
          subject: subject || undefined,
          topic: topic || undefined,
          tags: questionTags,
          explanation: explanation || undefined,
        }),
      });

      const data = await response.json();
      if (data.question) {
        if (editingId) {
          setQuestions(questions.map(q => 
            q._id === editingId ? data.question : q
          ));
        } else {
          setQuestions([data.question, ...questions]);
        }
        resetForm();
        await fetchQuestions(); // Refresh to get updated filters
      } else {
        alert(data.error || 'Failed to save question');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (q: QuestionBankItem) => {
    setQuestion(q.question);
    setOptions(q.options);
    setCorrectAnswer(q.correctAnswer);
    setDifficulty(q.difficulty);
    setSubject(q.subject || "");
    setTopic(q.topic || "");
    setQuestionTags(q.tags || []);
    setExplanation(q.explanation || "");
    setEditingId(q._id);
    setShowForm(true);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/teacher/question-bank/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setQuestions(questions.filter(q => q._id !== questionId));
      } else {
        alert('Failed to delete question');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete question');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !questionTags.includes(tagInput.trim())) {
      setQuestionTags([...questionTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setQuestionTags(questionTags.filter(t => t !== tag));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleExportCSV = () => {
    const csv = [
      ['Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Correct Answer', 'Difficulty', 'Subject', 'Topic', 'Tags', 'Explanation'].join(','),
      ...filteredQuestions.map(q => [
        `"${q.question}"`,
        ...q.options.map(o => `"${o}"`),
        q.correctAnswer,
        q.difficulty,
        q.subject || '',
        q.topic || '',
        q.tags.join(';'),
        `"${q.explanation || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-bank-${Date.now()}.csv`;
    a.click();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#FF991C] animate-spin mx-auto mb-4" />
          <p className="text-[#F5F5F5]">Loading question bank...</p>
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
            <Link href="/dashboard/teacher">
              <Button variant="ghost" className="text-[#F5F5F5] hover:bg-[#FF991C]/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Question Bank</h1>
            <div className="flex gap-2">
              <Button
                onClick={handleExportCSV}
                variant="ghost" className="text-[#F5F5F5] hover:bg-[#FF991C]/10"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Actions */}
          <div className="mb-8 flex gap-4">
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
                  Add Question
                </>
              )}
            </Button>
          </div>

          {/* Form */}
          {showForm && (
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 mb-8">
              <CardHeader>
                <CardTitle className="text-black">
                  {editingId ? 'Edit Question' : 'Add New Question'}
                </CardTitle>
                <CardDescription className="text-black/60">
                  Create reusable questions for your tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="question" className="text-black">Question *</Label>
                    <textarea
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Enter question"
                      className="w-full px-3 py-2 bg-white border border-black/20 rounded-md min-h-[80px]"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-black">Options *</Label>
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={correctAnswer === index}
                            onChange={() => setCorrectAnswer(index)}
                            className="w-4 h-4"
                          />
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="bg-white border-black/20"
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-black/60 mt-1">Select the correct answer</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="difficulty" className="text-black">Difficulty</Label>
                      <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-black/20 rounded-md"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-black">Subject</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g., Mathematics"
                        className="bg-white border-black/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="topic" className="text-black">Topic</Label>
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Algebra"
                        className="bg-white border-black/20"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags" className="text-black">Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        placeholder="Add tag and press Enter"
                        className="bg-white border-black/20"
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="outline"
                        className="border-black/20"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {questionTags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[#FF991C]/20 text-black rounded-full text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="explanation" className="text-black">Explanation (Optional)</Label>
                    <textarea
                      id="explanation"
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      placeholder="Explain why this is the correct answer"
                      className="w-full px-3 py-2 bg-white border border-black/20 rounded-md min-h-[60px]"
                    />
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
                          {editingId ? 'Update' : 'Add'} Question
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

          {/* Filters */}
          <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 mb-8">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-black text-sm">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search questions..."
                      className="pl-9 bg-white border-black/20"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-black text-sm">Subject</Label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-black/20 rounded-md"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-black text-sm">Difficulty</Label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-black/20 rounded-md"
                  >
                    <option value="">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <Label className="text-black text-sm">Tag</Label>
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-black/20 rounded-md"
                  >
                    <option value="">All Tags</option>
                    {tags.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-black/60">
                  Showing {filteredQuestions.length} of {questions.length} questions
                </p>
                {(filterSubject || filterDifficulty || filterTag || searchQuery) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilterSubject("");
                      setFilterDifficulty("");
                      setFilterTag("");
                      setSearchQuery("");
                    }}
                    className="border-black/20"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-16 w-16 text-black/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {questions.length === 0 ? 'No questions yet' : 'No questions found'}
                  </h3>
                  <p className="text-black/60 mb-4">
                    {questions.length === 0 
                      ? 'Start building your question bank'
                      : 'Try adjusting your filters'
                    }
                  </p>
                  {questions.length === 0 && (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Question
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredQuestions.map((q, index) => (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 hover:border-[#FF991C]/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-black flex-1 pr-4">
                          {q.question}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(q.difficulty)}`}>
                            {q.difficulty.toUpperCase()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(q)}
                            className="border-[#FF991C]/30 hover:bg-[#FF991C]/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(q._id)}
                            className="border-red-500/30 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {q.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                              idx === q.correctAnswer
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-white border border-black/10'
                            }`}
                          >
                            {idx === q.correctAnswer && (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                            <span className="text-sm text-black">{option}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 flex-wrap text-xs text-black/50">
                        {q.subject && <span className="font-medium">📚 {q.subject}</span>}
                        {q.topic && <span>📖 {q.topic}</span>}
                        {q.tags.length > 0 && (
                          <div className="flex gap-1">
                            {q.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-[#FF991C]/10 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <span>Used {q.timesUsed} times</span>
                      </div>

                      {q.explanation && (
                        <div className="mt-3 pt-3 border-t border-black/10">
                          <p className="text-sm text-black/70 italic">
                            <AlertCircle className="h-3 w-3 inline mr-1" />
                            {q.explanation}
                          </p>
                        </div>
                      )}
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
