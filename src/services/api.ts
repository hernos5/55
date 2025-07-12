import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  PaginatedResponse,
  User,
  Question,
  Answer,
  Notification,
  LoginForm,
  RegisterForm,
  QuestionForm,
  AnswerForm,
  ProfileForm,
  QuestionFilters,
  NotificationFilters,
  VoteType,
  PopularTag
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: RegisterForm): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post('/auth/register', data),

  login: (data: LoginForm): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post('/auth/login', data),

  getMe: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.get('/auth/me'),

  updateProfile: (data: ProfileForm): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.put('/auth/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.put('/auth/password', data),
};

// Questions API
export const questionsAPI = {
  getQuestions: (filters?: QuestionFilters): Promise<AxiosResponse<PaginatedResponse<Question>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/questions?${params.toString()}`);
  },

  getQuestion: (id: string): Promise<AxiosResponse<ApiResponse<{ question: Question; answers: Answer[] }>>> =>
    api.get(`/questions/${id}`),

  createQuestion: (data: QuestionForm): Promise<AxiosResponse<ApiResponse<{ question: Question }>>> =>
    api.post('/questions', data),

  updateQuestion: (id: string, data: Partial<QuestionForm>): Promise<AxiosResponse<ApiResponse<{ question: Question }>>> =>
    api.put(`/questions/${id}`, data),

  deleteQuestion: (id: string): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/questions/${id}`),

  voteQuestion: (id: string, type: VoteType): Promise<AxiosResponse<ApiResponse<{ question: Question }>>> =>
    api.post(`/questions/${id}/vote`, { type }),

  getPopularTags: (limit?: number): Promise<AxiosResponse<ApiResponse<{ tags: PopularTag[] }>>> => {
    const params = limit ? `?limit=${limit}` : '';
    return api.get(`/questions/tags/popular${params}`);
  },
};

// Answers API
export const answersAPI = {
  getAnswersForQuestion: (questionId: string, page?: number, sort?: string): Promise<AxiosResponse<PaginatedResponse<Answer>>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (sort) params.append('sort', sort);
    return api.get(`/answers/question/${questionId}?${params.toString()}`);
  },

  getAnswer: (id: string): Promise<AxiosResponse<ApiResponse<{ answer: Answer }>>> =>
    api.get(`/answers/${id}`),

  createAnswer: (data: AnswerForm): Promise<AxiosResponse<ApiResponse<{ answer: Answer }>>> =>
    api.post('/answers', data),

  updateAnswer: (id: string, content: string): Promise<AxiosResponse<ApiResponse<{ answer: Answer }>>> =>
    api.put(`/answers/${id}`, { content }),

  deleteAnswer: (id: string): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/answers/${id}`),

  voteAnswer: (id: string, type: VoteType): Promise<AxiosResponse<ApiResponse<{ answer: Answer }>>> =>
    api.post(`/answers/${id}/vote`, { type }),

  acceptAnswer: (id: string): Promise<AxiosResponse<ApiResponse<{ answer: Answer }>>> =>
    api.post(`/answers/${id}/accept`),

  unacceptAnswer: (id: string): Promise<AxiosResponse<ApiResponse<{ answer: Answer }>>> =>
    api.delete(`/answers/${id}/accept`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (filters?: NotificationFilters): Promise<AxiosResponse<PaginatedResponse<Notification>>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/notifications?${params.toString()}`);
  },

  getUnreadCount: (): Promise<AxiosResponse<ApiResponse<{ unreadCount: number }>>> =>
    api.get('/notifications/unread-count'),

  markAsRead: (id: string): Promise<AxiosResponse<ApiResponse<{ notification: Notification }>>> =>
    api.put(`/notifications/${id}/read`),

  markAsUnread: (id: string): Promise<AxiosResponse<ApiResponse<{ notification: Notification }>>> =>
    api.put(`/notifications/${id}/unread`),

  markAllAsRead: (): Promise<AxiosResponse<ApiResponse<{ modifiedCount: number }>>> =>
    api.put('/notifications/mark-all-read'),

  deleteNotification: (id: string): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/notifications/${id}`),

  deleteAllRead: (): Promise<AxiosResponse<ApiResponse<{ deletedCount: number }>>> =>
    api.delete('/notifications/read'),
};

// Health check
export const healthAPI = {
  check: (): Promise<AxiosResponse<{ status: string; message: string; timestamp: string }>> =>
    api.get('/health'),
};

export default api;

