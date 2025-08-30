// Universal App Template の型定義

// ===== 共通型定義 =====
export type AppTab = 'weight' | 'sleep' | 'todo' | 'dashboard';

export interface AppState {
  currentTab: AppTab;
  isLoading: boolean;
  error: string | null;
}

// ===== 体重管理 =====
export interface Weight {
  id: string;
  value: number; // kg単位
  unit: 'kg' | 'lb';
  measuredAt: Date;
  note?: string;
}

export interface WeightRecord {
  id: string;
  userId: string;
  weight: Weight;
  bmi?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeightGoal {
  id: string;
  userId: string;
  targetWeight: number;
  targetDate: Date;
  currentWeight: number;
  isActive: boolean;
  createdAt: Date;
}

export interface WeightStats {
  currentWeight: number;
  previousWeight: number;
  weightChange: number;
  averageWeekly: number;
  averageMonthly: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
}

// ===== 睡眠管理 =====
export interface Sleep {
  id: string;
  bedTime: Date;
  wakeTime: Date;
  sleepDuration: number; // 分単位
  sleepQuality: 1 | 2 | 3 | 4 | 5; // 1=悪い, 5=良い
  note?: string;
}

export interface SleepRecord {
  id: string;
  userId: string;
  sleep: Sleep;
  deepSleep?: number; // 分単位
  lightSleep?: number; // 分単位
  remSleep?: number; // 分単位
  awakeTime?: number; // 分単位
  createdAt: Date;
  updatedAt: Date;
}

export interface SleepGoal {
  id: string;
  userId: string;
  targetSleepDuration: number; // 分単位
  targetBedTime: string; // HH:mm形式
  targetWakeTime: string; // HH:mm形式
  isActive: boolean;
  createdAt: Date;
}

export interface SleepStats {
  averageSleepDuration: number;
  averageBedTime: string;
  averageWakeTime: string;
  averageSleepQuality: number;
  sleepConsistency: number; // 0-100の一貫性スコア
  weeklyTrend: 'improving' | 'declining' | 'stable';
}

// ===== ToDo管理 =====
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TodoCategory = 'work' | 'personal' | 'health' | 'finance' | 'learning' | 'other';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: TodoPriority;
  status: TodoStatus;
  category: TodoCategory;
  dueDate?: Date;
  estimatedDuration?: number; // 分単位
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TodoFilter {
  status?: TodoStatus[];
  priority?: TodoPriority[];
  category?: TodoCategory[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  searchText?: string;
}

export interface TodoStats {
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
  overdueTodos: number;
  completionRate: number; // 0-100のパーセンテージ
  averageCompletionTime: number; // 日単位
  productivityScore: number; // 0-100のスコア
}

// ===== API レスポンス型 =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== フォーム型定義 =====
export interface WeightFormData {
  value: number;
  unit: 'kg' | 'lb';
  measuredAt: Date;
  note?: string;
  bodyFatPercentage?: number;
  muscleMass?: number;
}

export interface SleepFormData {
  bedTime: Date;
  wakeTime: Date;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: TodoPriority;
  category: TodoCategory;
  dueDate?: Date;
  estimatedDuration?: number;
  tags: string[];
}

// ===== 設定関連 =====
export interface AppSettings {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
  timezone: string;
  notifications: {
    weight: boolean;
    sleep: boolean;
    todo: boolean;
    reminders: boolean;
  };
  units: {
    weight: 'kg' | 'lb';
    temperature: 'celsius' | 'fahrenheit';
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
}

// ===== ダッシュボード関連 =====
export interface DashboardData {
  weightStats: WeightStats;
  sleepStats: SleepStats;
  todoStats: TodoStats;
  recentActivities: ActivityRecord[];
  insights: InsightRecord[];
}

export interface ActivityRecord {
  id: string;
  type: 'weight' | 'sleep' | 'todo';
  action: string;
  timestamp: Date;
  data: any;
}

export interface InsightRecord {
  id: string;
  type: 'tip' | 'warning' | 'achievement' | 'trend';
  title: string;
  message: string;
  category: 'weight' | 'sleep' | 'todo' | 'general';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  isRead: boolean;
}