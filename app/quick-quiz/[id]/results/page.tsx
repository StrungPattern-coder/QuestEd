"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Home, ArrowLeft, Loader2, XCircle } from "lucide-react";

interface QuizResult {
  participantName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  rank?: number;
}

interface Test {
  _id: string;
  title: string;
  hostName?: string;
  questions: any[];
}

export default function QuickQuizResults() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Test | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResults();
  }, [testId]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      // Fetch test details
      const testResponse = await fetch(`/api/quick-quiz/${testId}`);
      if (!testResponse.ok) throw new Error("Quiz not found");
      
      const testData = await testResponse.json();
      setTest(testData.test);

      // For quick quizzes, we don't store submissions in the database
      // So we'll just show the test info
      // In a future update, you could add a results API endpoint
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Results</h2>
            <p className="text-gray-600 mb-4">{error || "Quiz not found"}</p>
            <Button onClick={() => router.push("/quick-quiz")}>
              Back to Quick Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6 flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/quick-quiz/${testId}/host`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Host
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/quick-quiz")}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Results</h1>
          <p className="text-xl text-gray-600">{test.title}</p>
          {test.hostName && (
            <p className="text-sm text-gray-500 mt-1">Hosted by {test.hostName}</p>
          )}
        </motion.div>

        {/* Quiz Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {test.questions.length}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.length}
              </div>
              <div className="text-sm text-gray-600">Participants</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.length > 0
                  ? Math.round(
                      results.reduce((acc, r) => acc + r.percentage, 0) /
                        results.length
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Results Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-6 h-6 text-purple-600" />
              Quiz Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quiz Completed!
              </h3>
              <p className="text-gray-600 mb-4">
                This quick quiz has been completed. Individual participant results are shown on their devices.
              </p>
              <div className="bg-white rounded-lg p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quiz Title:</span>
                  <span className="font-semibold">{test.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold">{test.questions.length}</span>
                </div>
                {test.hostName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Host:</span>
                    <span className="font-semibold">{test.hostName}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            About Quick Quiz Results
          </h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Quick quizzes are designed for instant, lightweight assessments</li>
            <li>• Participants see their individual results on their own devices</li>
            <li>• Results are not stored permanently in the database</li>
            <li>• For detailed analytics and stored results, use Classroom Tests instead</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/quick-quiz")}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Create Another Quiz
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex-1"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
