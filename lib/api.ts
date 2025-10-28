const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api`
  : '/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('token');
    
    console.log(`Fetching ${endpoint}, token exists:`, !!token);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log(`Response for ${endpoint}:`, response.status, response.statusText);

    const data = await response.json();

    if (!response.ok) {
      console.error(`Error response for ${endpoint}:`, data);
      return { error: data.error || 'An error occurred' };
    }

    console.log(`Success response for ${endpoint}:`, data);
    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// Auth API
export const authApi = {
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    enrollmentNumber?: string;
    rollNumber?: string;
  }) => fetchApi('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials: { email: string; password: string }) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => fetchApi('/auth/me'),
};

// Teacher API
export const teacherApi = {
  // Classrooms
  createClassroom: (data: { name: string; description?: string }) =>
    fetchApi('/teacher/classrooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getClassrooms: () => fetchApi('/teacher/classrooms'),

  updateClassroom: (id: string, data: { name?: string; description?: string }) =>
    fetchApi(`/teacher/classrooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteClassroom: (id: string) =>
    fetchApi(`/teacher/classrooms/${id}`, {
      method: 'DELETE',
    }),

  addStudent: (classroomId: string, studentEmail: string) =>
    fetchApi(`/teacher/classrooms/${classroomId}/students`, {
      method: 'POST',
      body: JSON.stringify({ studentEmail }),
    }),

  removeStudent: (classroomId: string, studentId: string) =>
    fetchApi(`/teacher/classrooms/${classroomId}/students/${studentId}`, {
      method: 'DELETE',
    }),

  inviteStudent: (classroomId: string, studentEmail: string) =>
    fetchApi(`/teacher/classrooms/${classroomId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ studentEmail }),
    }),

  // Tests
  createTest: (testData: any) =>
    fetchApi('/teacher/tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    }),

  getTests: (classroomId?: string) =>
    fetchApi(`/teacher/tests${classroomId ? `?classroomId=${classroomId}` : ''}`),

  startLiveTest: (testId: string) =>
    fetchApi(`/teacher/tests/${testId}/start`, {
      method: 'POST',
    }),

  stopLiveTest: (testId: string) =>
    fetchApi(`/teacher/tests/${testId}/stop`, {
      method: 'POST',
    }),

  uploadQuestions: (testId: string, data: { questions?: any[]; csvContent?: string }) =>
    fetchApi(`/teacher/tests/${testId}/questions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTestResults: (testId: string) => fetchApi(`/teacher/tests/${testId}/results`),

  getLeaderboard: (classroomId: string) =>
    fetchApi(`/teacher/leaderboard/${classroomId}`),
};

// Student API
export const studentApi = {
  getClassrooms: () => fetchApi('/student/classrooms'),

  getTests: () => fetchApi('/student/tests'),

  getTestDetails: (testId: string) => fetchApi(`/student/tests/${testId}`),

  joinLiveTest: (joinCode: string) =>
    fetchApi('/student/tests/join', {
      method: 'POST',
      body: JSON.stringify({ joinCode }),
    }),

  submitTest: (testId: string, answers: any[]) =>
    fetchApi(`/student/tests/${testId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  getTestResult: (testId: string) => fetchApi(`/student/tests/${testId}/result`),
};
