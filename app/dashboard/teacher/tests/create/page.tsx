"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherApi } from "@/lib/api";
import { ArrowLeft, FileText, Loader2, Plus, Trash2, Clock, Calendar } from "lucide-react";
import Link from "next/link";

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export default function CreateTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    classroomId: "",
    title: "",
    description: "",
    mode: "deadline" as "live" | "deadline",
    startTime: "",
    endTime: "",
    timeLimitPerQuestion: 30,
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    const response = await teacherApi.getClassrooms();
    if (response.data) {
      setClassrooms((response.data as any).classrooms || []);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} is empty`);
        setLoading(false);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        setError(`Question ${i + 1} has empty options`);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await teacherApi.createTest({
        ...formData,
        questions,
      });

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.data) {
        router.push("/dashboard/teacher");
      }
    } catch (err) {
      setError("Failed to create test");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color"></div>
      </div>

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
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#FFA266]/20 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-[#FFA266]" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-black">Create New Test</CardTitle>
                  <CardDescription className="text-black/60">
                    Design a German language quiz for your students
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Step 1: Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-black border-b pb-2">Test Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="classroomId" className="text-base font-semibold text-black">
                        Classroom *
                      </Label>
                      <select
                        id="classroomId"
                        value={formData.classroomId}
                        onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                        className="w-full h-12 px-3 border border-gray-300 rounded-md focus:border-[#FFA266] focus:ring-[#FFA266] focus:ring-1"
                        required
                      >
                        <option value="">Select a classroom</option>
                        {classrooms.map((classroom) => (
                          <option key={classroom._id} value={classroom._id}>
                            {classroom.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mode" className="text-base font-semibold text-black">
                        Test Mode *
                      </Label>
                      <select
                        id="mode"
                        value={formData.mode}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value as "live" | "deadline" })}
                        className="w-full h-12 px-3 border border-gray-300 rounded-md focus:border-[#FFA266] focus:ring-[#FFA266] focus:ring-1"
                        required
                      >
                        <option value="deadline">Deadline Mode</option>
                        <option value="live">Live Mode (Kahoot-style)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-semibold text-black">
                      Test Title *
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="e.g., German Verbs Quiz"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                      placeholder="Brief description of the test..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:border-[#FFA266] focus:ring-[#FFA266] focus:ring-1"
                    />
                  </div>

                  {formData.mode === "deadline" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-base font-semibold text-black flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Start Time *
                        </Label>
                        <Input
                          id="startTime"
                          type="datetime-local"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          className="h-12"
                          required={formData.mode === "deadline"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-base font-semibold text-black flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          End Time *
                        </Label>
                        <Input
                          id="endTime"
                          type="datetime-local"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                          className="h-12"
                          required={formData.mode === "deadline"}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="timeLimit" className="text-base font-semibold text-black">
                      Time per Question (seconds)
                    </Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min="10"
                      max="300"
                      value={formData.timeLimitPerQuestion}
                      onChange={(e) => setFormData({ ...formData, timeLimitPerQuestion: parseInt(e.target.value) })}
                      className="h-12 w-32"
                    />
                  </div>
                </div>

                {/* Step 2: Questions */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-xl font-bold text-black">Questions</h3>
                    <Button
                      type="button"
                      onClick={addQuestion}
                      className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>

                  {questions.map((question, qIndex) => (
                    <Card key={qIndex} className="bg-white border-[#FFA266]/20">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg text-black">Question {qIndex + 1}</CardTitle>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-black">
                            Question Text *
                          </Label>
                          <Input
                            type="text"
                            placeholder="Enter your question in German..."
                            value={question.questionText}
                            onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-black">Options *</Label>
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={question.correctAnswer === optIndex}
                                onChange={() => updateQuestion(qIndex, "correctAnswer", optIndex)}
                                className="w-4 h-4 text-[#FFA266] focus:ring-[#FFA266]"
                              />
                              <Input
                                type="text"
                                placeholder={`Option ${optIndex + 1}`}
                                value={option}
                                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                                className="flex-1"
                                required
                              />
                              <span className="text-xs text-black/60 min-w-[80px]">
                                {question.correctAnswer === optIndex && "✓ Correct"}
                              </span>
                            </div>
                          ))}
                          <p className="text-xs text-black/60 mt-2">
                            Select the radio button next to the correct answer
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                        Creating Test...
                      </>
                    ) : (
                      "Create Test"
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
