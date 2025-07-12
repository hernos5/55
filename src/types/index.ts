// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'guest' | 'user' | 'admin';
  reputation: number;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  lastActive: string;
}

export interface AuthUser extends User {
  token: string;
}

// Question types
export interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  author: User;
  votes: number;
  upvotes: Array<{ user: string; createdAt: string }>;
  downvotes: Array<{ user: string; createdAt: string }>;
  acceptedAnswer?: string;
  views: number;
  answerCount: number;
  lastActivity: string;
  status: 'open' | 'closed' | 'duplicate';
  createdAt: string;
  updatedAt: string;
}

// Answer types
export interface Answer {
  _id: string;
  content: string;
  question: string;
  author: User;
  votes: number;
  upvotes: Array<{ user: string; createdAt: string }>;
  downvotes: Array<{ user: string; createdAt: string }>;
  isAccepted: boolean;
  acceptedAt?: string;
  editHistory: Array<{
    content: string;
    editedAt: string;
    editedBy: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  _id: string;
  recipient: string;
  message: string;
  read: boolean;
  type: 'answer' | 'comment' | 'vote' | 'accepted' | 'mention' | 'system';
  relatedQuestion?: Question;
  relatedAnswer?: Answer;
  relatedUser?: User;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; param: string }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface QuestionForm {
  title: string;
  description: string;
  tags: string[];
}

export interface AnswerForm {
  content: string;
  questionId: string;
}

export interface ProfileForm {
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
}

// Filter and sort types
export interface QuestionFilters {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'votes' | 'activity' | 'views';
  tag?: string;
  search?: string;
  status?: 'open' | 'closed' | 'duplicate' | 'all';
  author?: string;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: 'answer' | 'comment' | 'vote' | 'accepted' | 'mention' | 'system';
}

// Vote types
export type VoteType = 'up' | 'down';

// Component prop types
export interface VotingButtonsProps {
  votes: number;
  userVote?: VoteType | null;
  onVote: (type: VoteType) => void;
  disabled?: boolean;
}

export interface TagProps {
  tag: string;
  count?: number;
  onClick?: (tag: string) => void;
  removable?: boolean;
  onRemove?: (tag: string) => void;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  errors?: Array<{ msg: string; param: string }>;
}

// Search types
export interface SearchResult {
  questions: Question[];
  totalResults: number;
  searchTerm: string;
}

// Stats types
export interface UserStats {
  questionsAsked: number;
  answersGiven: number;
  acceptedAnswers: number;
  totalVotes: number;
  reputation: number;
}

export interface PopularTag {
  tag: string;
  count: number;
}

