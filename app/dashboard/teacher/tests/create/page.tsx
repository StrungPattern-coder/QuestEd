"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherApi } from "@/lib/api";
import { 
  ArrowLeft, 
  FileText, 
  Loader2, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar,
  ArrowRight,
  Check,
  Settings,
  ListChecks,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: number;
}

const STEPS = [
  { id: 1, name: "Basic Info", icon: Settings, description: "Test details" },
  { id: 2, name: "Questions", icon: ListChecks, description: "Add questions" },
  { id: 3, name: "Review", icon: Sparkles, description: "Final check" },
];

export default function CreateTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingClassrooms, setLoadingClassrooms] = useState(true);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  
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
    setLoadingClassrooms(true);
    try {
      const response = await teacherApi.getClassrooms();
      console.log('Classrooms response:', response);
      
      if (response.error) {
        console.error('Error fetching classrooms:', response.error);
        setError(response.error);
        setLoadingClassrooms(false);
        return;
      }
      
      if (response.data) {
        const classroomsList = (response.data as any).classrooms || [];
        console.log('Classrooms list:', classroomsList);
        setClassrooms(classroomsList);
      }
    } catch (err) {
      console.error('Failed to fetch classrooms:', err);
      setError('Failed to load classrooms');
    } finally {
      setLoadingClassrooms(false);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    try {
      const text = await file.text();
      let parsedQuestions: Question[] = [];

      if (fileType === 'json') {
        // Parse JSON format
        const data = JSON.parse(text);
        parsedQuestions = data.map((q: any) => ({
          questionText: q.questionText || q.question || '',
          options: q.options || [],
          correctAnswer: q.options?.indexOf(q.correctAnswer) || 0,
        }));
      } else if (fileType === 'csv') {
        // Parse CSV format
        const lines = text.split('\n').filter(line => line.trim());
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
          if (parts.length >= 6) {
            const [questionText, correctAnswer, opt1, opt2, opt3, opt4] = parts;
            const options = [opt1, opt2, opt3, opt4];
            parsedQuestions.push({
              questionText,
              options,
              correctAnswer: options.indexOf(correctAnswer),
            });
          }
        }
      }

      if (parsedQuestions.length > 0) {
        setQuestions(parsedQuestions);
        setError('');
      } else {
        setError('No valid questions found in the file');
      }
    } catch (err) {
      console.error('Error parsing file:', err);
      setError('Failed to parse file. Please check the format.');
    }

    // Reset file input
    e.target.value = '';
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

  const validateStep1 = () => {
    if (!formData.classroomId) {
      setError("Please select a classroom");
      return false;
    }
    if (!formData.title.trim()) {
      setError("Please enter a test title");
      return false;
    }
    if (formData.mode === "deadline" && (!formData.startTime || !formData.endTime)) {
      setError("Please set start and end times for deadline mode");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} is empty`);
        return false;
      }
      if (q.options.some(opt => !opt.trim())) {
        setError(`Question ${i + 1} has empty options`);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert correctAnswer from index to actual text
      const formattedQuestions = questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.options[q.correctAnswer],
      }));

      // Prepare test data with proper date conversion
      const testData: any = {
        classroomId: formData.classroomId,
        title: formData.title,
        description: formData.description,
        mode: formData.mode,
        timeLimitPerQuestion: formData.timeLimitPerQuestion,
        questions: formattedQuestions,
      };

      // Convert datetime-local values to ISO strings properly
      // datetime-local gives us "2025-10-29T03:00" which is in local time
      // We need to convert it to ISO string maintaining the local time as-is
      if (formData.mode === 'deadline') {
        if (formData.startTime) {
          // Create date from local datetime string and convert to ISO
          testData.startTime = new Date(formData.startTime).toISOString();
        }
        if (formData.endTime) {
          testData.endTime = new Date(formData.endTime).toISOString();
        }
      } else {
        // For live mode, set default times
        const now = new Date();
        testData.startTime = now.toISOString();
        testData.endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours later
      }

      const response = await teacherApi.createTest(testData);

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

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                scale: currentStep === step.id ? 1.1 : 1,
                backgroundColor: currentStep >= step.id ? "#FFA266" : "#E5E7EB",
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                currentStep >= step.id ? "text-black" : "text-gray-400"
              }`}
            >
              {currentStep > step.id ? (
                <Check className="h-6 w-6" />
              ) : (
                <step.icon className="h-6 w-6" />
              )}
            </motion.div>
            <p className={`text-xs mt-2 font-medium ${
              currentStep >= step.id ? "text-[#FFA266]" : "text-gray-400"
            }`}>
              {step.name}
            </p>
          </div>
          {index < STEPS.length - 1 && (
            <motion.div
              initial={false}
              animate={{
                backgroundColor: currentStep > step.id ? "#FFA266" : "#E5E7EB",
              }}
              className="w-24 h-1 mx-4 rounded-full"
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-black mb-2">Test Configuration</h3>
        <p className="text-black/60">Let's start with the basic details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="classroomId" className="text-base font-semibold text-black">
            Select Classroom *
          </Label>
          {loadingClassrooms ? (
            <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl flex items-center text-black/50 bg-white">
              <Loader2 className="h-5 w-5 mr-2 animate-spin text-[#FFA266]" />
              Loading classrooms...
            </div>
          ) : classrooms.length === 0 ? (
            <div className="w-full p-4 border-2 border-yellow-300 bg-yellow-50 rounded-xl text-sm text-yellow-800">
              <p className="font-semibold mb-1">No classrooms found</p>
              <p>Please create a classroom first before creating a test.</p>
            </div>
          ) : (
            <select
              id="classroomId"
              value={formData.classroomId}
              onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
              className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:border-[#FFA266] focus:ring-2 focus:ring-[#FFA266]/20 transition-all bg-white text-base"
              required
            >
              <option value="">Choose a classroom...</option>
              {classrooms.map((classroom) => (
                <option key={classroom._id} value={classroom._id}>
                  {classroom.name} ({classroom.students?.length || 0} students)
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mode" className="text-base font-semibold text-black">
            Test Mode *
          </Label>
          <select
            id="mode"
            value={formData.mode}
            onChange={(e) => setFormData({ ...formData, mode: e.target.value as "live" | "deadline" })}
            className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:border-[#FFA266] focus:ring-2 focus:ring-[#FFA266]/20 transition-all bg-white text-base"
            required
          >
            <option value="deadline">📅 Deadline Mode (Scheduled)</option>
            <option value="live">⚡ Live Mode (Kahoot-style)</option>
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
          placeholder="e.g., German Verbs & Conjugation Quiz"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="h-14 border-2 border-gray-200 rounded-xl focus:border-[#FFA266] focus:ring-2 focus:ring-[#FFA266]/20 text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-semibold text-black">
          Description (Optional)
        </Label>
        <textarea
          id="description"
          placeholder="Brief description of what this test covers..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full min-h-[100px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FFA266] focus:ring-2 focus:ring-[#FFA266]/20 transition-all resize-none text-base"
        />
      </div>

      {formData.mode === "deadline" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-gray-100"
        >
          <div className="space-y-2">
            <Label htmlFor="startTime" className="text-base font-semibold text-black flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FFA266]" />
              Start Time *
            </Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="h-14 border-2 border-gray-200 rounded-xl focus:border-[#FFA266] focus:ring-2 focus:ring-[#FFA266]/20"
              required={formData.mode === "deadline"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime" className="text-base font-semibold text-black flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#FFA266]" />
              End Time *
            </Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="h-14 border-2 border-gray-200 rounded-xl focus:border-[#FFA266] focus:ring-2 focus:ring-[#FFA266]/20"
              required={formData.mode === "deadline"}
            />
          </div>
        </motion.div>
      )}

      <div className="space-y-2 pt-4 border-t-2 border-gray-100">
        <Label htmlFor="timeLimit" className="text-base font-semibold text-black flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#FFA266]" />
          Time per Question
        </Label>
        <div className="flex items-center gap-4">
          <Input
            id="timeLimit"
            type="number"
            min="10"
            max="300"
            value={formData.timeLimitPerQuestion}
            onChange={(e) => setFormData({ ...formData, timeLimitPerQuestion: parseInt(e.target.value) || 30 })}
            className="h-14 w-32 border-2 border-gray-200 rounded-xl focus:border-[#FFA266] focus:ring-2 focus:ring-[#FFA266]/20 text-center text-lg font-semibold"
          />
          <span className="text-black/60">seconds</span>
        </div>
        <p className="text-xs text-black/50 mt-1">Students will have this much time to answer each question</p>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-black mb-2">Add Your Questions</h3>
        <p className="text-black/60">Create engaging multiple-choice questions</p>
      </div>

      {/* Upload Question Bank */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
        <h4 className="text-lg font-semibold text-black mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Upload Question Bank
        </h4>
        <p className="text-sm text-black/70 mb-4">
          Upload a CSV or JSON file with your questions. This will replace all current questions.
        </p>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            className="hidden"
            id="question-file-upload"
          />
          <label htmlFor="question-file-upload">
            <Button
              type="button"
              onClick={() => document.getElementById('question-file-upload')?.click()}
              variant="outline"
              className="border-2 border-blue-300 hover:bg-blue-100 text-black cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Choose File (CSV/JSON)
            </Button>
          </label>
          <div className="text-xs text-black/60">
            <p className="font-semibold mb-1">CSV Format:</p>
            <code className="bg-white px-2 py-1 rounded text-xs">Question Text,Correct Answer,Option 1,Option 2,Option 3,Option 4</code>
            <p className="font-semibold mt-2 mb-1">JSON Format:</p>
            <code className="bg-white px-2 py-1 rounded text-xs">{'[{"questionText":"...", "options":["A","B","C","D"], "correctAnswer":"A"}]'}</code>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#FFA266]/20 p-2 rounded-lg">
            <ListChecks className="h-5 w-5 text-[#FFA266]" />
          </div>
          <span className="font-semibold text-black">
            {questions.length} Question{questions.length !== 1 ? "s" : ""}
          </span>
        </div>
        <Button
          type="button"
          onClick={addQuestion}
          className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black font-semibold shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {questions.map((question, qIndex) => (
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qIndex * 0.05 }}
          >
            <Card className="bg-white border-2 border-gray-200 hover:border-[#FFA266]/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#FFA266]/10 to-transparent">
                <CardTitle className="text-lg text-black font-bold">
                  Question {qIndex + 1}
                </CardTitle>
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
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-black">
                    Question Text *
                  </Label>
                  <Input
                    type="text"
                    placeholder="Was ist das? (What is this?)"
                    value={question.questionText}
                    onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                    className="h-12 border-2 border-gray-200 rounded-lg focus:border-[#FFA266] focus:ring-2 focus:ring-[#FFA266]/20"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-black">Answer Options *</Label>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 font-bold text-gray-600">
                        {String.fromCharCode(65 + optIndex)}
                      </div>
                      <Input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        value={option}
                        onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                        className="flex-1 h-12 border-2 border-gray-200 rounded-lg focus:border-[#FFA266] focus:ring-2 focus:ring-[#FFA266]/20"
                        required
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === optIndex}
                          onChange={() => updateQuestion(qIndex, "correctAnswer", optIndex)}
                          className="w-5 h-5 text-[#FFA266] focus:ring-[#FFA266] cursor-pointer"
                        />
                        <span className={`text-xs font-semibold min-w-[60px] ${
                          question.correctAnswer === optIndex ? "text-green-600" : "text-gray-400"
                        }`}>
                          {question.correctAnswer === optIndex ? "✓ Correct" : "Correct?"}
                        </span>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-black/50 mt-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#FFA266]"></span>
                    Select the radio button to mark the correct answer
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <ListChecks className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No questions added yet</p>
          <Button
            type="button"
            onClick={addQuestion}
            className="mt-4 bg-[#FFA266] hover:bg-[#FF8F4D] text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Question
          </Button>
        </div>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-black mb-2">Review Your Test</h3>
        <p className="text-black/60">Everything looks good? Let's create it!</p>
      </div>

      <Card className="bg-gradient-to-br from-[#FFA266]/10 to-[#FF8F4D]/5 border-2 border-[#FFA266]/30">
        <CardHeader>
          <CardTitle className="text-xl text-black">Test Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-black/60 mb-1">Classroom</p>
              <p className="font-semibold text-black">
                {classrooms.find(c => c._id === formData.classroomId)?.name || "Not selected"}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-black/60 mb-1">Mode</p>
              <p className="font-semibold text-black">
                {formData.mode === "live" ? "⚡ Live Mode" : "📅 Deadline Mode"}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-black/60 mb-1">Questions</p>
              <p className="font-semibold text-black text-2xl">{questions.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-black/60 mb-1">Time/Question</p>
              <p className="font-semibold text-black text-2xl">{formData.timeLimitPerQuestion}s</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-black/60 mb-2">Title</p>
            <p className="font-semibold text-black text-lg">{formData.title}</p>
          </div>

          {formData.description && (
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-black/60 mb-2">Description</p>
              <p className="text-black">{formData.description}</p>
            </div>
          )}

          {formData.mode === "deadline" && formData.startTime && formData.endTime && (
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-black/60 mb-2">Schedule</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-black/50 mb-1">Start</p>
                  <p className="font-semibold text-black">
                    {new Date(formData.startTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-black/50 mb-1">End</p>
                  <p className="font-semibold text-black">
                    {new Date(formData.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-black flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-[#FFA266]" />
            Questions Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
          {questions.map((question, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-black text-sm mb-2">
                {index + 1}. {question.questionText}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`text-xs p-2 rounded ${
                      question.correctAnswer === optIndex
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "bg-white text-black/70"
                    }`}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option}
                    {question.correctAnswer === optIndex && " ✓"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );

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
          <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div 
                  className="bg-[#FFA266] p-4 rounded-2xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <FileText className="h-8 w-8 text-black" />
                </motion.div>
                <div>
                  <CardTitle className="text-4xl text-black font-bold">Create New Test</CardTitle>
                  <CardDescription className="text-black/60 text-lg">
                    Build an engaging quiz for your students
                  </CardDescription>
                </div>
              </div>

              {renderStepIndicator()}
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm mb-6 flex items-start gap-3"
                  >
                    <span className="text-red-500 text-xl">⚠️</span>
                    <div>
                      <p className="font-semibold mb-1">Oops! Something needs attention:</p>
                      <p>{error}</p>
                    </div>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-8 mt-8 border-t-2 border-gray-200">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 h-14 border-2 border-gray-300 hover:border-gray-400 text-black font-semibold text-lg"
                      disabled={loading}
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Back
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => router.back()}
                      variant="outline"
                      className="flex-1 h-14 border-2 border-gray-300 hover:border-gray-400 text-black font-semibold text-lg"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  )}

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 h-14 bg-[#FFA266] hover:bg-[#FF8F4D] text-black font-bold text-lg shadow-xl"
                    >
                      Continue
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1 h-14 bg-gradient-to-r from-[#FFA266] to-[#FF8F4D] hover:from-[#FF8F4D] hover:to-[#FFA266] text-black font-bold text-lg shadow-xl"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Creating Your Test...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Create Test
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
