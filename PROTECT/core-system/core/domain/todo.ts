// Todo管理ドメインロジック
import { Todo, TodoFilter, TodoStats, TodoFormData, TodoPriority, TodoStatus, TodoCategory } from '../types/app';

// ===== 定数定義 =====
const TODO_STORAGE_KEY = 'integrated_life_app_todos';

// ===== ユーティリティ関数 =====

/**
 * 一意IDの生成
 */
function generateId(): string {
  return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 優先度の数値変換（ソート用）
 * @param priority 優先度
 * @returns 数値（高いほど優先度が高い）
 */
export function getPriorityValue(priority: TodoPriority): number {
  const priorityMap = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1
  };
  return priorityMap[priority];
}

/**
 * 優先度のカラーコードを取得
 * @param priority 優先度
 * @returns カラーコード
 */
export function getPriorityColor(priority: TodoPriority): string {
  const colorMap = {
    urgent: '#ff4757',
    high: '#ff6b6b',
    medium: '#ffa726',
    low: '#66bb6a'
  };
  return colorMap[priority];
}

/**
 * ステータスの表示名を取得
 * @param status ステータス
 * @returns 表示名
 */
export function getStatusDisplayName(status: TodoStatus): string {
  const statusMap = {
    pending: '未着手',
    in_progress: '進行中',
    completed: '完了',
    cancelled: 'キャンセル'
  };
  return statusMap[status];
}

/**
 * カテゴリの表示名を取得
 * @param category カテゴリ
 * @returns 表示名
 */
export function getCategoryDisplayName(category: TodoCategory): string {
  const categoryMap = {
    work: '仕事',
    personal: '個人',
    health: '健康',
    finance: '金融',
    learning: '学習',
    other: 'その他'
  };
  return categoryMap[category];
}

/**
 * 期限までの日数を計算
 * @param dueDate 期限日
 * @returns 期限までの日数（負の値は過去）
 */
export function getDaysUntilDue(dueDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Todoが期限切れかどうかを判定
 * @param todo Todo項目
 * @returns 期限切れの場合true
 */
export function isOverdue(todo: Todo): boolean {
  if (!todo.dueDate || todo.status === 'completed' || todo.status === 'cancelled') {
    return false;
  }
  return getDaysUntilDue(todo.dueDate) < 0;
}

/**
 * 完了までの時間を計算（日単位）
 * @param createdAt 作成日時
 * @param completedAt 完了日時
 * @returns 完了までの日数
 */
export function getCompletionTime(createdAt: Date, completedAt: Date): number {
  const diffTime = completedAt.getTime() - createdAt.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ===== データ永続化関数 =====

/**
 * ローカルストレージからTodoを取得
 */
function getStoredTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(TODO_STORAGE_KEY);
    if (!stored) return [];
    
    const todos = JSON.parse(stored);
    return todos.map((todo: any) => ({
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt),
      completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined
    }));
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
}

/**
 * ローカルストレージにTodoを保存
 */
function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos:', error);
    throw new Error('Todoの保存に失敗しました');
  }
}

// ===== CRUD操作関数 =====

/**
 * 新しいTodoを作成
 */
export function createTodo(formData: TodoFormData): Todo {
  try {
    const todos = getStoredTodos();
    
    const newTodo: Todo = {
      id: generateId(),
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: 'pending',
      category: formData.category,
      dueDate: formData.dueDate,
      estimatedDuration: formData.estimatedDuration,
      tags: formData.tags,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    todos.unshift(newTodo); // 新しいTodoを先頭に追加
    saveTodos(todos);
    
    return newTodo;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw new Error('Todoの作成に失敗しました');
  }
}

/**
 * Todoを取得（フィルター・ページネーション対応）
 */
export function getTodos(filter?: TodoFilter, page: number = 1, pageSize: number = 50): {
  todos: Todo[];
  totalCount: number;
  hasMore: boolean;
} {
  try {
    let allTodos = getStoredTodos();
    
    // フィルター適用
    if (filter) {
      allTodos = applyTodoFilter(allTodos, filter);
    }
    
    // ソート（優先度順、作成日順）
    allTodos.sort((a, b) => {
      // まず優先度でソート
      const priorityDiff = getPriorityValue(b.priority) - getPriorityValue(a.priority);
      if (priorityDiff !== 0) return priorityDiff;
      
      // 優先度が同じ場合は作成日でソート（新しい順）
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const todos = allTodos.slice(startIndex, endIndex);
    
    return {
      todos,
      totalCount: allTodos.length,
      hasMore: endIndex < allTodos.length
    };
  } catch (error) {
    console.error('Error getting todos:', error);
    throw new Error('Todoの取得に失敗しました');
  }
}

/**
 * 特定のTodoを取得
 */
export function getTodo(todoId: string): Todo | null {
  try {
    const todos = getStoredTodos();
    return todos.find(todo => todo.id === todoId) || null;
  } catch (error) {
    console.error('Error getting todo:', error);
    return null;
  }
}

/**
 * Todoを更新
 */
export function updateTodo(todoId: string, formData: TodoFormData): Todo {
  try {
    const todos = getStoredTodos();
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex === -1) {
      throw new Error('更新対象のTodoが見つかりません');
    }
    
    const existingTodo = todos[todoIndex];
    const updatedTodo: Todo = {
      ...existingTodo,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate,
      estimatedDuration: formData.estimatedDuration,
      tags: formData.tags,
      updatedAt: new Date()
    };
    
    todos[todoIndex] = updatedTodo;
    saveTodos(todos);
    
    return updatedTodo;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw new Error('Todoの更新に失敗しました');
  }
}

/**
 * Todoのステータスを更新
 */
export function updateTodoStatus(todoId: string, status: TodoStatus): Todo {
  try {
    const todos = getStoredTodos();
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex === -1) {
      throw new Error('更新対象のTodoが見つかりません');
    }
    
    const existingTodo = todos[todoIndex];
    const updatedTodo: Todo = {
      ...existingTodo,
      status,
      updatedAt: new Date(),
      completedAt: status === 'completed' ? new Date() : undefined
    };
    
    todos[todoIndex] = updatedTodo;
    saveTodos(todos);
    
    return updatedTodo;
  } catch (error) {
    console.error('Error updating todo status:', error);
    throw new Error('Todoステータスの更新に失敗しました');
  }
}

/**
 * Todoを削除
 */
export function deleteTodo(todoId: string): boolean {
  try {
    const todos = getStoredTodos();
    const filteredTodos = todos.filter(todo => todo.id !== todoId);
    
    if (todos.length === filteredTodos.length) {
      throw new Error('削除対象のTodoが見つかりません');
    }
    
    saveTodos(filteredTodos);
    return true;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw new Error('Todoの削除に失敗しました');
  }
}

// ===== フィルター関数 =====

/**
 * Todoにフィルターを適用
 */
function applyTodoFilter(todos: Todo[], filter: TodoFilter): Todo[] {
  return todos.filter(todo => {
    // ステータスフィルター
    if (filter.status && filter.status.length > 0) {
      if (!filter.status.includes(todo.status)) return false;
    }
    
    // 優先度フィルター
    if (filter.priority && filter.priority.length > 0) {
      if (!filter.priority.includes(todo.priority)) return false;
    }
    
    // カテゴリフィルター
    if (filter.category && filter.category.length > 0) {
      if (!filter.category.includes(todo.category)) return false;
    }
    
    // 日付範囲フィルター
    if (filter.dateRange) {
      if (todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const startDate = new Date(filter.dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(filter.dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        
        if (dueDate < startDate || dueDate > endDate) return false;
      }
    }
    
    // タグフィルター
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some(tag => 
        todo.tags.some(todoTag => 
          todoTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }
    
    // テキスト検索フィルター
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      const titleMatch = todo.title.toLowerCase().includes(searchLower);
      const descriptionMatch = todo.description?.toLowerCase().includes(searchLower);
      const tagMatch = todo.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!titleMatch && !descriptionMatch && !tagMatch) return false;
    }
    
    return true;
  });
}

// ===== 統計計算関数 =====

/**
 * Todo統計を計算
 */
export function calculateTodoStats(): TodoStats {
  try {
    const todos = getStoredTodos();
    
    if (todos.length === 0) {
      return {
        totalTodos: 0,
        completedTodos: 0,
        pendingTodos: 0,
        overdueTodos: 0,
        completionRate: 0,
        averageCompletionTime: 0,
        productivityScore: 0
      };
    }
    
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.status === 'completed').length;
    const pendingTodos = todos.filter(todo => 
      todo.status === 'pending' || todo.status === 'in_progress'
    ).length;
    const overdueTodos = todos.filter(isOverdue).length;
    
    // 完了率
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
    
    // 平均完了時間（完了したTodoのみ）
    const completedTodosWithTime = todos.filter(todo => 
      todo.status === 'completed' && todo.completedAt
    );
    
    let averageCompletionTime = 0;
    if (completedTodosWithTime.length > 0) {
      const totalCompletionTime = completedTodosWithTime.reduce((sum, todo) => {
        return sum + getCompletionTime(todo.createdAt, todo.completedAt!);
      }, 0);
      averageCompletionTime = Math.round(totalCompletionTime / completedTodosWithTime.length);
    }
    
    // 生産性スコア（複数要素を考慮）
    let productivityScore = 0;
    if (totalTodos > 0) {
      const completionRateScore = completionRate * 0.4; // 40%の重み
      const timelinessScore = (1 - (overdueTodos / totalTodos)) * 100 * 0.3; // 30%の重み
      const activityScore = Math.min(100, (totalTodos / 30) * 100) * 0.3; // 30%の重み（月30個を100%とする）
      
      productivityScore = Math.round(completionRateScore + timelinessScore + activityScore);
    }
    
    return {
      totalTodos,
      completedTodos,
      pendingTodos,
      overdueTodos,
      completionRate,
      averageCompletionTime,
      productivityScore: Math.max(0, Math.min(100, productivityScore))
    };
  } catch (error) {
    console.error('Error calculating todo stats:', error);
    throw new Error('Todo統計の計算に失敗しました');
  }
}

// ===== 検索・分析関数 =====

/**
 * 期限切れのTodoを取得
 */
export function getOverdueTodos(): Todo[] {
  try {
    const todos = getStoredTodos();
    return todos.filter(isOverdue);
  } catch (error) {
    console.error('Error getting overdue todos:', error);
    throw new Error('期限切れTodoの取得に失敗しました');
  }
}

/**
 * 今日が期限のTodoを取得
 */
export function getTodosDueToday(): Todo[] {
  try {
    const todos = getStoredTodos();
    return todos.filter(todo => {
      if (!todo.dueDate || todo.status === 'completed' || todo.status === 'cancelled') {
        return false;
      }
      return getDaysUntilDue(todo.dueDate) === 0;
    });
  } catch (error) {
    console.error('Error getting todos due today:', error);
    throw new Error('今日期限のTodo取得に失敗しました');
  }
}

/**
 * 指定期間内に完了したTodoを取得
 */
export function getCompletedTodosByDateRange(startDate: Date, endDate: Date): Todo[] {
  try {
    const todos = getStoredTodos();
    return todos.filter(todo => {
      if (todo.status !== 'completed' || !todo.completedAt) {
        return false;
      }
      
      const completedDate = new Date(todo.completedAt);
      return completedDate >= startDate && completedDate <= endDate;
    });
  } catch (error) {
    console.error('Error getting completed todos by date range:', error);
    throw new Error('期間指定でのTodo取得に失敗しました');
  }
}

/**
 * タグによるTodo検索
 */
export function getTodosByTag(tag: string): Todo[] {
  try {
    const todos = getStoredTodos();
    return todos.filter(todo => 
      todo.tags.some(todoTag => 
        todoTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  } catch (error) {
    console.error('Error getting todos by tag:', error);
    throw new Error('タグ検索に失敗しました');
  }
}

/**
 * 使用されているタグの一覧を取得
 */
export function getAllUsedTags(): string[] {
  try {
    const todos = getStoredTodos();
    const allTags = todos.flatMap(todo => todo.tags);
    return [...new Set(allTags)].sort();
  } catch (error) {
    console.error('Error getting all used tags:', error);
    return [];
  }
}