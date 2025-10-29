"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export default function QuickQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Quiz details, 2: Add questions, 3: Review
  const [quizTitle, setQuizTitle] = useState("");
  const [hostName, setHostName] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCreateQuiz = async () => {
    // Validate
    if (!quizTitle.trim()) {
      setError("Please enter a quiz title");
      return;
    }
    if (!hostName.trim()) {
      setError("Please enter your name");
      return;
    }

    const validQuestions = questions.filter(q => 
      q.questionText.trim() && 
      q.options.every(o => o.trim()) &&
      q.correctAnswer.trim()
    );

    if (validQuestions.length === 0) {
      setError("Please add at least one complete question");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/quick-quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quizTitle,
          hostName,
          timeLimitPerQuestion: timeLimit,
          questions: validQuestions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create quiz");
        setLoading(false);
        return;
      }

      // Redirect to the live quiz page
      router.push(`/quick-quiz/${data.test._id}/host?code=${data.joinCode}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF991C]/10 via-black to-black" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-[#F5F5F5] hover:text-[#FF991C] mb-4 text-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">
            <Zap className="inline h-10 w-10 text-[#FF991C] mr-2" />
            Quick Quiz Creator
          </h1>
          <p className="text-[#F5F5F5]/70">
            Create a quiz in minutes. No signup required!
          </p>
        </div>

        {/* Step 1: Quiz Details */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-[#F5F5F5]/95 border-[#FF991C]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-black">Quiz Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Quiz Title *
                  </label>
                  <Input
                    placeholder="e.g., Friday Fun Quiz"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Your Name *
                  </label>
                  <Input
                    placeholder="Who's hosting this quiz?"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Time per Question (seconds)
                  </label>
                  <Input
                    type="number"
                    min="10"
                    max="120"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="text-base"
                  />
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!quizTitle.trim() || !hostName.trim()}
                  className="w-full bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-semibold"
                >
                  Next: Add Questions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Add Questions */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {questions.map((question, qIndex) => (
              <Card key={qIndex} className="bg-[#F5F5F5]/95 border-[#FF991C]/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-black">
                    Question {qIndex + 1}
                  </CardTitle>
                  {questions.length > 1 && (
                    <Button
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
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Question Text *
                    </label>
                    <Input
                      placeholder="Enter your question"
                      value={question.questionText}
                      onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                      className="text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Options (All 4 required) *
                    </label>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <Input
                          key={oIndex}
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className="text-base"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Correct Answer *
                    </label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => updateQuestion(qIndex, "correctAnswer", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base"
                    >
                      <option value="">Select correct answer</option>
                      {question.options.map((option, oIndex) => (
                        <option key={oIndex} value={option} disabled={!option.trim()}>
                          {option || `Option ${oIndex + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            ))}

            {error && (
              <div className="bg-red-500/15 border border-red-300/30 text-[#F5F5F5] p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={addQuestion}
                variant="outline"
                className="flex-1 border-[#FF991C]/30 text-black hover:bg-[#FF991C]/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
              <Button
                onClick={handleCreateQuiz}
                disabled={loading}
                className="flex-1 bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-semibold"
              >
                {loading ? "Creating..." : "Create Quiz"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={() => setStep(1)}
              variant="ghost"
              className="w-full text-[#F5F5F5] hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Details
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
