// Universal App Template のアプリケーションサービス
import { 
  AppState, 
  AppTab, 
  DashboardData, 
  ActivityRecord, 
  InsightRecord,
  ApiResponse,
  WeightFormData,
  SleepFormData,
  TodoFormData,
  WeightRecord,
  SleepRecord,
  Todo,
  WeightStats,
  SleepStats,
  TodoStats
} from '../types/app';

// ドメインサービスのインポート
import * as WeightService from '../domain/weight';
import * as SleepService from '../domain/sleep';
import * as TodoService from '../domain/todo';

// ===== 定数定義 =====
const APP_STATE_STORAGE_KEY = 'integrated_life_app_state';
const ACTIVITY_STORAGE_KEY = 'integrated_life_app_activities';
const INSIGHTS_STORAGE_KEY = 'integrated_life_app_insights';
const USER_ID = 'default_user'; // 将来的にはユーザー認証で動的に設定

// ===== アプリケーション状態管理 =====

/**
 * アプリケーション状態を取得
 */
export function getAppState(): AppState {
  try {
    const stored = localStorage.getItem(APP_STATE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    const defaultState: AppState = {
      currentTab: 'dashboard',
      isLoading: false,
      error: null
    };
    
    saveAppState(defaultState);
    return defaultState;
  } catch (error) {
    console.error('Error getting app state:', error);
    return {
      currentTab: 'dashboard',
      isLoading: false,
      error: 'アプリケーション状態の取得に失敗しました'
    };
  }
}

/**
 * アプリケーション状態を保存
 */
export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving app state:', error);
  }
}

/**
 * アクティブタブを変更
 */
export function setActiveTab(tab: AppTab): AppState {
  try {
    const currentState = getAppState();
    const newState: AppState = {
      ...currentState,
      currentTab: tab,
      error: null
    };
    
    saveAppState(newState);
    // アクティビティログは他の機能のみ対象とする
    
    return newState;
  } catch (error) {
    console.error('Error setting active tab:', error);
    const errorState = getAppState();
    return {
      ...errorState,
      error: 'タブの切り替えに失敗しました'
    };
  }
}

/**
 * ローディング状態を設定
 */
export function setLoadingState(isLoading: boolean): AppState {
  try {
    const currentState = getAppState();
    const newState: AppState = {
      ...currentState,
      isLoading
    };
    
    saveAppState(newState);
    return newState;
  } catch (error) {
    console.error('Error setting loading state:', error);
    return getAppState();
  }
}

/**
 * エラー状態を設定
 */
export function setErrorState(error: string | null): AppState {
  try {
    const currentState = getAppState();
    const newState: AppState = {
      ...currentState,
      error,
      isLoading: false
    };
    
    saveAppState(newState);
    return newState;
  } catch (error) {
    console.error('Error setting error state:', error);
    return getAppState();
  }
}

// ===== 体重管理サービス =====

/**
 * 体重記録を作成
 */
export async function createWeightRecord(formData: WeightFormData): Promise<ApiResponse<WeightRecord>> {
  try {
    setLoadingState(true);
    
    const record = WeightService.createWeightRecord(USER_ID, formData);
    
    logActivity('weight', '体重記録を追加', {
      weight: record.weight.value,
      unit: record.weight.unit
    });
    
    // インサイト生成
    generateWeightInsights();
    
    setLoadingState(false);
    
    return {
      success: true,
      data: record,
      message: '体重記録を保存しました',
      timestamp: new Date()
    };
  } catch (error) {
    setLoadingState(false);
    const errorMessage = error instanceof Error ? error.message : '体重記録の作成に失敗しました';
    setErrorState(errorMessage);
    
    return {
      success: false,
      data: {} as WeightRecord,
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

/**
 * 体重記録一覧を取得
 */
export async function getWeightRecords(page: number = 1, pageSize: number = 50): Promise<ApiResponse<{
  records: WeightRecord[];
  totalCount: number;
  hasMore: boolean;
}>> {
  try {
    setLoadingState(true);
    
    const result = WeightService.getWeightRecords(USER_ID, page, pageSize);
    
    setLoadingState(false);
    
    return {
      success: true,
      data: result,
      timestamp: new Date()
    };
  } catch (error) {
    setLoadingState(false);
    const errorMessage = error instanceof Error ? error.message : '体重記録の取得に失敗しました';
    setErrorState(errorMessage);
    
    return {
      success: false,
      data: { records: [], totalCount: 0, hasMore: false },
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

/**
 * 体重統計を取得
 */
export async function getWeightStats(): Promise<ApiResponse<WeightStats>> {
  try {
    const stats = WeightService.calculateWeightStats(USER_ID);
    
    return {
      success: true,
      data: stats,
      timestamp: new Date()
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '体重統計の取得に失敗しました';
    
    return {
      success: false,
      data: {} as WeightStats,
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

// ===== 睡眠管理サービス =====

/**
 * 睡眠記録を作成
 */
export async function createSleepRecord(formData: SleepFormData): Promise<ApiResponse<SleepRecord>> {
  try {
    setLoadingState(true);
    
    const record = SleepService.createSleepRecord(USER_ID, formData);
    
    logActivity('sleep', '睡眠記録を追加', {
      sleepDuration: record.sleep.sleepDuration,
      sleepQuality: record.sleep.sleepQuality
    });
    
    // インサイト生成
    generateSleepInsights();
    
    setLoadingState(false);
    
    return {
      success: true,
      data: record,
      message: '睡眠記録を保存しました',
      timestamp: new Date()
    };
  } catch (error) {
    setLoadingState(false);
    const errorMessage = error instanceof Error ? error.message : '睡眠記録の作成に失敗しました';
    setErrorState(errorMessage);
    
    return {
      success: false,
      data: {} as SleepRecord,
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

/**
 * 睡眠記録一覧を取得
 */
export async function getSleepRecords(page: number = 1, pageSize: number = 50): Promise<ApiResponse<{
  records: SleepRecord[];
  totalCount: number;
  hasMore: boolean;
}>> {
  try {
    setLoadingState(true);
    
    const result = SleepService.getSleepRecords(USER_ID, page, pageSize);
    
    setLoadingState(false);
    
    return {
      success: true,
      data: result,
      timestamp: new Date()
    };
  } catch (error) {
    setLoadingState(false);
    const errorMessage = error instanceof Error ? error.message : '睡眠記録の取得に失敗しました';
    setErrorState(errorMessage);
    
    return {
      success: false,
      data: { records: [], totalCount: 0, hasMore: false },
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

/**
 * 睡眠統計を取得
 */
export async function getSleepStats(): Promise<ApiResponse<SleepStats>> {
  try {
    const stats = SleepService.calculateSleepStats(USER_ID);
    
    return {
      success: true,
      data: stats,
      timestamp: new Date()
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '睡眠統計の取得に失敗しました';
    
    return {
      success: false,
      data: {} as SleepStats,
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

// ===== Todo管理サービス =====

/**
 * Todoを作成
 */
export async function createTodo(formData: TodoFormData): Promise<ApiResponse<Todo>> {
  try {
    setLoadingState(true);
    
    const todo = TodoService.createTodo(formData);
    
    logActivity('todo', 'Todoを追加', {
      title: todo.title,
      priority: todo.priority,
      category: todo.category
    });
    
    // インサイト生成
    generateTodoInsights();
    
    setLoadingState(false);
    
    return {
      success: true,
      data: todo,
      message: 'Todoを作成しました',
      timestamp: new Date()
    };
  } catch (error) {
    setLoadingState(false);
    const errorMessage = error instanceof Error ? error.message : 'Todoの作成に失敗しました';
    setErrorState(errorMessage);
    
    return {
      success: false,
      data: {} as Todo,
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

/**
 * Todo一覧を取得
 */
export async function getTodos(filter?: any, page: number = 1, pageSize: number = 50): Promise<ApiResponse<{
  todos: Todo[];
  totalCount: number;
  hasMore: boolean;
}>> {
  try {
    setLoadingState(true);
    
    const result = TodoService.getTodos(filter, page, pageSize);
    
    setLoadingState(false);
    
    return {
      success: true,
      data: result,
      timestamp: new Date()
    };
  } catch (error) {
    setLoadingState(false);
    const errorMessage = error instanceof Error ? error.message : 'Todoの取得に失敗しました';
    setErrorState(errorMessage);
    
    return {
      success: false,
      data: { todos: [], totalCount: 0, hasMore: false },
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

/**
 * Todoのステータスを更新
 */
export async function updateTodoStatus(todoId: string, status: any): Promise<ApiResponse<Todo>> {
  try {
    setLoadingState(true);
    
    const todo = TodoService.updateTodoStatus(todoId, status);
    
    logActivity('todo', `Todoステータス更新: ${status}`, {
      todoId: todo.id,
      title: todo.title,
      status: status
    });
    
    // インサイト生成
    generateTodoInsights();
    
    setLoadingState(false);
    
    return {
      success: true,
      data: todo,
      message: 'Todoのステータスを更新しました',
      timestamp: new Date()
    };
  } catch (error) {
    setLoadingState(false);
    const errorMessage = error instanceof Error ? error.message : 'Todoステータスの更新に失敗しました';
    setErrorState(errorMessage);
    
    return {
      success: false,
      data: {} as Todo,
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

/**
 * Todo統計を取得
 */
export async function getTodoStats(): Promise<ApiResponse<TodoStats>> {
  try {
    const stats = TodoService.calculateTodoStats();
    
    return {
      success: true,
      data: stats,
      timestamp: new Date()
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Todo統計の取得に失敗しました';
    
    return {
      success: false,
      data: {} as TodoStats,
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

// ===== ダッシュボードサービス =====

/**
 * ダッシュボードデータを取得
 */
export async function getDashboardData(): Promise<ApiResponse<DashboardData>> {
  try {
    setLoadingState(true);
    
    // 各統計データを並行取得
    const [weightStatsResult, sleepStatsResult, todoStatsResult] = await Promise.all([
      getWeightStats(),
      getSleepStats(),
      getTodoStats()
    ]);
    
    const recentActivities = getRecentActivities(10);
    const insights = getActiveInsights();
    
    const dashboardData: DashboardData = {
      weightStats: weightStatsResult.data,
      sleepStats: sleepStatsResult.data,
      todoStats: todoStatsResult.data,
      recentActivities,
      insights
    };
    
    setLoadingState(false);
    
    return {
      success: true,
      data: dashboardData,
      timestamp: new Date()
    };
  } catch (error) {
    setLoadingState(false);
    const errorMessage = error instanceof Error ? error.message : 'ダッシュボードデータの取得に失敗しました';
    setErrorState(errorMessage);
    
    return {
      success: false,
      data: {} as DashboardData,
      error: errorMessage,
      timestamp: new Date()
    };
  }
}

// ===== アクティビティログ =====

/**
 * アクティビティを記録
 */
function logActivity(type: 'weight' | 'sleep' | 'todo', action: string, data: any): void {
  try {
    const activities = getStoredActivities();
    
    const newActivity: ActivityRecord = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      action,
      timestamp: new Date(),
      data
    };
    
    activities.unshift(newActivity);
    
    // 最新100件のみ保持
    const trimmedActivities = activities.slice(0, 100);
    
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmedActivities));
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

/**
 * 最近のアクティビティを取得
 */
function getRecentActivities(limit: number = 10): ActivityRecord[] {
  try {
    const activities = getStoredActivities();
    return activities.slice(0, limit);
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return [];
  }
}

/**
 * 保存されたアクティビティを取得
 */
function getStoredActivities(): ActivityRecord[] {
  try {
    const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!stored) return [];
    
    const activities = JSON.parse(stored);
    return activities.map((activity: any) => ({
      ...activity,
      timestamp: new Date(activity.timestamp)
    }));
  } catch (error) {
    console.error('Error loading activities:', error);
    return [];
  }
}

// ===== インサイト生成 =====

/**
 * 体重関連のインサイトを生成
 */
function generateWeightInsights(): void {
  try {
    const stats = WeightService.calculateWeightStats(USER_ID);
    const insights: InsightRecord[] = [];
    
    // 体重変化の傾向
    if (Math.abs(stats.weightChange) > 1) {
      const type = stats.weightChange > 0 ? 'warning' : 'tip';
      const message = stats.weightChange > 0 
        ? `体重が${stats.weightChange}kg増加しています。食生活を見直してみましょう。`
        : `体重が${Math.abs(stats.weightChange)}kg減少しています。順調に目標に近づいています！`;
      
      insights.push(createInsight(type, '体重変化', message, 'weight', 'medium'));
    }
    
    // BMIによるアドバイス
    if (stats.bmiCategory === 'overweight') {
      insights.push(createInsight('warning', 'BMI警告', '適正体重を上回っています。運動量を増やすことをお勧めします。', 'weight', 'high'));
    } else if (stats.bmiCategory === 'underweight') {
      insights.push(createInsight('warning', 'BMI警告', '適正体重を下回っています。栄養バランスの良い食事を心がけましょう。', 'weight', 'high'));
    }
    
    saveInsights(insights);
  } catch (error) {
    console.error('Error generating weight insights:', error);
  }
}

/**
 * 睡眠関連のインサイトを生成
 */
function generateSleepInsights(): void {
  try {
    const stats = SleepService.calculateSleepStats(USER_ID);
    const insights: InsightRecord[] = [];
    
    // 睡眠時間のアドバイス
    const sleepHours = stats.averageSleepDuration / 60;
    if (sleepHours < 6) {
      insights.push(createInsight('warning', '睡眠不足', '平均睡眠時間が不足しています。7-9時間の睡眠を目指しましょう。', 'sleep', 'high'));
    } else if (sleepHours > 9) {
      insights.push(createInsight('tip', '睡眠過多', '睡眠時間が長すぎる可能性があります。睡眠の質を見直してみましょう。', 'sleep', 'medium'));
    }
    
    // 睡眠の質のアドバイス
    if (stats.averageSleepQuality < 3) {
      insights.push(createInsight('warning', '睡眠の質', '睡眠の質が低下しています。就寝前のリラックス時間を設けることをお勧めします。', 'sleep', 'medium'));
    }
    
    // 睡眠の一貫性
    if (stats.sleepConsistency < 70) {
      insights.push(createInsight('tip', '睡眠リズム', '睡眠時間が不規則です。毎日同じ時間に就寝・起床することを心がけましょう。', 'sleep', 'medium'));
    }
    
    saveInsights(insights);
  } catch (error) {
    console.error('Error generating sleep insights:', error);
  }
}

/**
 * Todo関連のインサイトを生成
 */
function generateTodoInsights(): void {
  try {
    const stats = TodoService.calculateTodoStats();
    const insights: InsightRecord[] = [];
    
    // 完了率のアドバイス
    if (stats.completionRate < 50) {
      insights.push(createInsight('warning', 'タスク完了率', '完了率が低下しています。タスクの優先順位を見直してみましょう。', 'todo', 'medium'));
    } else if (stats.completionRate > 80) {
      insights.push(createInsight('achievement', '高い生産性', '素晴らしい完了率です！この調子で頑張りましょう。', 'todo', 'low'));
    }
    
    // 期限切れのアドバイス
    if (stats.overdueTodos > 0) {
      insights.push(createInsight('warning', '期限切れタスク', `${stats.overdueTodos}個のタスクが期限切れです。優先的に対応しましょう。`, 'todo', 'high'));
    }
    
    // 生産性スコア
    if (stats.productivityScore > 80) {
      insights.push(createInsight('achievement', '高い生産性', '生産性スコアが高いです！効率的にタスクをこなせています。', 'todo', 'low'));
    }
    
    saveInsights(insights);
  } catch (error) {
    console.error('Error generating todo insights:', error);
  }
}

/**
 * インサイトを作成
 */
function createInsight(
  type: 'tip' | 'warning' | 'achievement' | 'trend',
  title: string,
  message: string,
  category: 'weight' | 'sleep' | 'todo' | 'general',
  priority: 'low' | 'medium' | 'high'
): InsightRecord {
  return {
    id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    category,
    priority,
    createdAt: new Date(),
    isRead: false
  };
}

/**
 * インサイトを保存
 */
function saveInsights(newInsights: InsightRecord[]): void {
  try {
    const existingInsights = getStoredInsights();
    const allInsights = [...newInsights, ...existingInsights];
    
    // 最新50件のみ保持、同じメッセージの重複を削除
    const uniqueInsights = allInsights
      .filter((insight, index, array) => 
        array.findIndex(i => i.message === insight.message) === index
      )
      .slice(0, 50);
    
    localStorage.setItem(INSIGHTS_STORAGE_KEY, JSON.stringify(uniqueInsights));
  } catch (error) {
    console.error('Error saving insights:', error);
  }
}

/**
 * アクティブなインサイトを取得
 */
function getActiveInsights(): InsightRecord[] {
  try {
    const insights = getStoredInsights();
    return insights.filter(insight => !insight.isRead).slice(0, 10);
  } catch (error) {
    console.error('Error getting active insights:', error);
    return [];
  }
}

/**
 * 保存されたインサイトを取得
 */
function getStoredInsights(): InsightRecord[] {
  try {
    const stored = localStorage.getItem(INSIGHTS_STORAGE_KEY);
    if (!stored) return [];
    
    const insights = JSON.parse(stored);
    return insights.map((insight: any) => ({
      ...insight,
      createdAt: new Date(insight.createdAt)
    }));
  } catch (error) {
    console.error('Error loading insights:', error);
    return [];
  }
}

/**
 * インサイトを既読にする
 */
export function markInsightAsRead(insightId: string): boolean {
  try {
    const insights = getStoredInsights();
    const insightIndex = insights.findIndex(insight => insight.id === insightId);
    
    if (insightIndex === -1) return false;
    
    insights[insightIndex].isRead = true;
    localStorage.setItem(INSIGHTS_STORAGE_KEY, JSON.stringify(insights));
    
    return true;
  } catch (error) {
    console.error('Error marking insight as read:', error);
    return false;
  }
}

// ===== データエクスポート/インポート（将来実装） =====

/**
 * 全データをエクスポート
 */
export function exportAllData(): any {
  try {
    return {
      weightRecords: WeightService.getWeightRecords(USER_ID, 1, 1000),
      sleepRecords: SleepService.getSleepRecords(USER_ID, 1, 1000),
      todos: TodoService.getTodos(undefined, 1, 1000),
      activities: getStoredActivities(),
      insights: getStoredInsights(),
      appState: getAppState(),
      exportedAt: new Date()
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('データのエクスポートに失敗しました');
  }
}

/**
 * データを一括クリア（開発用）
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem('integrated_life_app_weight_records');
    localStorage.removeItem('integrated_life_app_sleep_records');
    localStorage.removeItem('integrated_life_app_todos');
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    localStorage.removeItem(INSIGHTS_STORAGE_KEY);
    localStorage.removeItem(APP_STATE_STORAGE_KEY);
    
    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw new Error('データのクリアに失敗しました');
  }
}