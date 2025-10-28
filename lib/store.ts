import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  enrollmentNumber?: string;
  rollNumber?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface TestState {
  currentQuestionIndex: number;
  answers: Array<{ questionId: string; selectedAnswer: string }>;
  timeRemaining: number;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setTimeRemaining: (time: number) => void;
  resetTest: () => void;
}

export const useTestStore = create<TestState>((set) => ({
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: 0,

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  setAnswer: (questionId, answer) =>
    set((state) => {
      const existingIndex = state.answers.findIndex((a) => a.questionId === questionId);
      if (existingIndex >= 0) {
        const newAnswers = [...state.answers];
        newAnswers[existingIndex] = { questionId, selectedAnswer: answer };
        return { answers: newAnswers };
      }
      return { answers: [...state.answers, { questionId, selectedAnswer: answer }] };
    }),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  resetTest: () => set({ currentQuestionIndex: 0, answers: [], timeRemaining: 0 }),
}));
