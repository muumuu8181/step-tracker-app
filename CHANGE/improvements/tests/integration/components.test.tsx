import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Components
import { WeightManager } from '@web/components/WeightManager';
import { TodoManager } from '@web/components/TodoManager';
import { SleepManager } from '@web/components/SleepManager';

// Mock domain functions
vi.mock('@core/domain/weight', () => ({
  createWeightRecord: vi.fn(),
  getWeightRecords: vi.fn(),
  deleteWeightRecord: vi.fn(),
  calculateWeightStats: vi.fn(),
  createWeightGoal: vi.fn(),
  getActiveWeightGoal: vi.fn(),
  updateWeightGoal: vi.fn(),
}));

vi.mock('@core/domain/todo', () => ({
  createTodo: vi.fn(),
  getTodos: vi.fn(),
  deleteTodo: vi.fn(),
  updateTodoStatus: vi.fn(),
  calculateTodoStats: vi.fn(),
  getPriorityColor: vi.fn((priority: string) => {
    const colors = { urgent: '#ff4757', high: '#ff6b6b', medium: '#ffa726', low: '#66bb6a' };
    return colors[priority as keyof typeof colors] || '#666';
  }),
  getStatusDisplayName: vi.fn((status: string) => {
    const names = { pending: '未着手', in_progress: '進行中', completed: '完了', cancelled: 'キャンセル' };
    return names[status as keyof typeof names] || status;
  }),
  getCategoryDisplayName: vi.fn((category: string) => {
    const names = { work: '仕事', personal: '個人', health: '健康', finance: '金融', learning: '学習', other: 'その他' };
    return names[category as keyof typeof names] || category;
  }),
  isOverdue: vi.fn(),
  getDaysUntilDue: vi.fn(),
}));

vi.mock('@core/domain/sleep', () => ({
  createSleepRecord: vi.fn(),
  getSleepRecords: vi.fn(),
  deleteSleepRecord: vi.fn(),
  calculateSleepStats: vi.fn(),
  createSleepGoal: vi.fn(),
  getActiveSleepGoal: vi.fn(),
  updateSleepGoal: vi.fn(),
  formatTimeToHHMM: vi.fn((date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }),
  getSleepQualityText: vi.fn((quality: number) => {
    const texts = { 1: '悪い', 2: 'やや悪い', 3: '普通', 4: '良い', 5: 'とても良い' };
    return texts[quality as keyof typeof texts] || '普通';
  })
}));

// Import mocked functions for type safety
import * as weightDomain from '@core/domain/weight';
import * as todoDomain from '@core/domain/todo';
import * as sleepDomain from '@core/domain/sleep';

describe('Component Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    (weightDomain.getWeightRecords as any).mockReturnValue({
      records: [],
      totalCount: 0,
      hasMore: false
    });
    (weightDomain.calculateWeightStats as any).mockReturnValue({
      currentWeight: 0,
      previousWeight: 0,
      weightChange: 0,
      averageWeekly: 0,
      averageMonthly: 0,
      bmiCategory: 'normal'
    });
    (weightDomain.getActiveWeightGoal as any).mockReturnValue(null);

    (todoDomain.getTodos as any).mockReturnValue({
      todos: [],
      totalCount: 0,
      hasMore: false
    });
    (todoDomain.calculateTodoStats as any).mockReturnValue({
      totalTodos: 0,
      completedTodos: 0,
      pendingTodos: 0,
      overdueTodos: 0,
      completionRate: 0,
      averageCompletionTime: 0,
      productivityScore: 0
    });

    (sleepDomain.getSleepRecords as any).mockReturnValue({
      records: [],
      totalCount: 0,
      hasMore: false
    });
    (sleepDomain.calculateSleepStats as any).mockReturnValue({
      averageSleepDuration: 0,
      averageBedTime: '00:00',
      averageWakeTime: '00:00',
      averageSleepQuality: 0,
      sleepConsistency: 0,
      weeklyTrend: 'stable'
    });
    (sleepDomain.getActiveSleepGoal as any).mockReturnValue(null);
  });

  describe('WeightManager Component', () => {
    it('should render weight manager with default state', () => {
      render(<WeightManager />);
      
      expect(screen.getByText('体重管理')).toBeInTheDocument();
      expect(screen.getByText('記録追加')).toBeInTheDocument();
      expect(screen.getByText('目標設定')).toBeInTheDocument();
      expect(screen.getByText('まだ記録がありません')).toBeInTheDocument();
    });

    it('should display weight statistics when data exists', () => {
      (weightDomain.calculateWeightStats as any).mockReturnValue({
        currentWeight: 70,
        previousWeight: 72,
        weightChange: -2,
        averageWeekly: 71,
        averageMonthly: 72.5,
        bmiCategory: 'normal'
      });

      render(<WeightManager />);
      
      expect(screen.getByText('70 kg')).toBeInTheDocument();
      expect(screen.getByText('-2 kg')).toBeInTheDocument();
      expect(screen.getByText('71 kg')).toBeInTheDocument();
      expect(screen.getByText('標準')).toBeInTheDocument();
    });

    it('should display weight records', () => {
      const mockRecords = [{
        id: 'weight_1',
        userId: 'demo_user_001',
        weight: {
          id: 'w1',
          value: 70,
          unit: 'kg' as const,
          measuredAt: new Date('2025-01-15T08:00:00Z'),
          note: 'Morning weight'
        },
        bodyFatPercentage: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      (weightDomain.getWeightRecords as any).mockReturnValue({
        records: mockRecords,
        totalCount: 1,
        hasMore: false
      });

      render(<WeightManager />);
      
      expect(screen.getByText('70 kg')).toBeInTheDocument();
      expect(screen.getByText('体脂肪率: 15%')).toBeInTheDocument();
      expect(screen.getByText('Morning weight')).toBeInTheDocument();
      expect(screen.getByText('削除')).toBeInTheDocument();
    });

    it('should open weight record form when add button clicked', async () => {
      render(<WeightManager />);
      
      await user.click(screen.getByText('記録追加'));
      
      expect(screen.getByText('体重記録を追加')).toBeInTheDocument();
      expect(screen.getByLabelText('体重 (kg)')).toBeInTheDocument();
      expect(screen.getByLabelText('測定日時')).toBeInTheDocument();
      expect(screen.getByText('追加')).toBeInTheDocument();
      expect(screen.getByText('キャンセル')).toBeInTheDocument();
    });

    it('should submit weight record form', async () => {
      (weightDomain.createWeightRecord as any).mockReturnValue({
        id: 'weight_new',
        userId: 'demo_user_001',
        weight: { id: 'w1', value: 75, unit: 'kg', measuredAt: new Date(), note: '' },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      render(<WeightManager />);
      
      // Open form
      await user.click(screen.getByText('記録追加'));
      
      // Fill form
      const weightInput = screen.getByLabelText('体重 (kg)');
      await user.clear(weightInput);
      await user.type(weightInput, '75');
      
      const noteInput = screen.getByLabelText('メモ');
      await user.type(noteInput, 'Test weight record');
      
      // Submit form
      await user.click(screen.getByRole('button', { name: '追加' }));
      
      expect(weightDomain.createWeightRecord).toHaveBeenCalledWith(
        'demo_user_001',
        expect.objectContaining({
          value: 75,
          unit: 'kg',
          note: 'Test weight record'
        })
      );
    });

    it('should open goal setting form', async () => {
      render(<WeightManager />);
      
      await user.click(screen.getByText('目標設定'));
      
      expect(screen.getByText('目標設定')).toBeInTheDocument();
      expect(screen.getByLabelText('目標体重 (kg)')).toBeInTheDocument();
      expect(screen.getByLabelText('目標日')).toBeInTheDocument();
    });

    it('should handle delete weight record', async () => {
      const mockRecords = [{
        id: 'weight_1',
        userId: 'demo_user_001',
        weight: {
          id: 'w1',
          value: 70,
          unit: 'kg' as const,
          measuredAt: new Date('2025-01-15T08:00:00Z'),
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      (weightDomain.getWeightRecords as any).mockReturnValue({
        records: mockRecords,
        totalCount: 1,
        hasMore: false
      });

      render(<WeightManager />);
      
      await user.click(screen.getByText('削除'));
      
      expect(weightDomain.deleteWeightRecord).toHaveBeenCalledWith('weight_1');
    });

    it('should display error messages', () => {
      (weightDomain.getWeightRecords as any).mockImplementation(() => {
        throw new Error('Test error message');
      });

      render(<WeightManager />);
      
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
  });

  describe('TodoManager Component', () => {
    it('should render todo manager with default state', () => {
      render(<TodoManager />);
      
      expect(screen.getByText('Todo管理')).toBeInTheDocument();
      expect(screen.getByText('Todo追加')).toBeInTheDocument();
      expect(screen.getByText('フィルター')).toBeInTheDocument();
      expect(screen.getByText('条件に一致するTodoがありません')).toBeInTheDocument();
    });

    it('should display todo statistics', () => {
      (todoDomain.calculateTodoStats as any).mockReturnValue({
        totalTodos: 10,
        completedTodos: 7,
        pendingTodos: 3,
        overdueTodos: 1,
        completionRate: 70,
        averageCompletionTime: 2,
        productivityScore: 85
      });

      render(<TodoManager />);
      
      expect(screen.getByText('10')).toBeInTheDocument(); // totalTodos
      expect(screen.getByText('7')).toBeInTheDocument();  // completedTodos
      expect(screen.getByText('3')).toBeInTheDocument();  // pendingTodos
      expect(screen.getByText('1')).toBeInTheDocument();  // overdueTodos
      expect(screen.getByText('70%')).toBeInTheDocument(); // completionRate
      expect(screen.getByText('85')).toBeInTheDocument(); // productivityScore
    });

    it('should display todo list', () => {
      const mockTodos = [{
        id: 'todo_1',
        title: 'Test Todo',
        description: 'Test description',
        priority: 'high' as const,
        status: 'pending' as const,
        category: 'work' as const,
        dueDate: new Date('2025-02-01T10:00:00Z'),
        tags: ['test', 'important'],
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      (todoDomain.getTodos as any).mockReturnValue({
        todos: mockTodos,
        totalCount: 1,
        hasMore: false
      });
      (todoDomain.isOverdue as any).mockReturnValue(false);

      render(<TodoManager />);
      
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('important')).toBeInTheDocument();
    });

    it('should open todo form when add button clicked', async () => {
      render(<TodoManager />);
      
      await user.click(screen.getByText('Todo追加'));
      
      expect(screen.getByText('Todo追加')).toBeInTheDocument();
      expect(screen.getByLabelText('タイトル *')).toBeInTheDocument();
      expect(screen.getByLabelText('説明')).toBeInTheDocument();
      expect(screen.getByLabelText('優先度')).toBeInTheDocument();
      expect(screen.getByLabelText('カテゴリ')).toBeInTheDocument();
    });

    it('should submit todo form', async () => {
      (todoDomain.createTodo as any).mockReturnValue({
        id: 'todo_new',
        title: 'New Todo',
        priority: 'high',
        category: 'work',
        status: 'pending',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      render(<TodoManager />);
      
      // Open form
      await user.click(screen.getByText('Todo追加'));
      
      // Fill form
      await user.type(screen.getByLabelText('タイトル *'), 'New Todo');
      await user.type(screen.getByLabelText('説明'), 'New todo description');
      await user.selectOptions(screen.getByLabelText('優先度'), 'high');
      await user.selectOptions(screen.getByLabelText('カテゴリ'), 'work');
      
      // Submit form
      await user.click(screen.getByRole('button', { name: '追加' }));
      
      expect(todoDomain.createTodo).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Todo',
          description: 'New todo description',
          priority: 'high',
          category: 'work'
        })
      );
    });

    it('should handle todo status changes', async () => {
      const mockTodos = [{
        id: 'todo_1',
        title: 'Test Todo',
        priority: 'medium' as const,
        status: 'pending' as const,
        category: 'work' as const,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }];

      (todoDomain.getTodos as any).mockReturnValue({
        todos: mockTodos,
        totalCount: 1,
        hasMore: false
      });

      render(<TodoManager />);
      
      // Click complete button
      await user.click(screen.getByText('完了'));
      
      expect(todoDomain.updateTodoStatus).toHaveBeenCalledWith('todo_1', 'completed');
    });

    it('should handle todo filtering', async () => {
      render(<TodoManager />);
      
      // Change status filter
      const statusSelect = screen.getByLabelText('ステータス');
      await user.selectOptions(statusSelect, 'completed');
      
      expect(todoDomain.getTodos).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ['completed']
        }),
        1,
        100
      );
    });

    it('should handle tag input', async () => {
      render(<TodoManager />);
      
      // Open form
      await user.click(screen.getByText('Todo追加'));
      
      // Add tags
      const tagInput = screen.getByPlaceholderText('タグを入力してEnter');
      await user.type(tagInput, 'test-tag');
      await user.click(screen.getByText('追加'));
      
      expect(screen.getByText('test-tag')).toBeInTheDocument();
      
      // Remove tag
      await user.click(screen.getByText('×'));
      
      expect(screen.queryByText('test-tag')).not.toBeInTheDocument();
    });
  });

  describe('Cross-Component Integration', () => {
    it('should handle localStorage integration consistently', () => {
      // Both components should interact with the same storage keys
      render(<WeightManager />);
      render(<TodoManager />);
      
      // Verify domain functions are called with consistent patterns
      expect(weightDomain.getWeightRecords).toHaveBeenCalledWith('demo_user_001', 1, 20);
      expect(todoDomain.getTodos).toHaveBeenCalledWith({}, 1, 100);
    });

    it('should maintain consistent error handling patterns', () => {
      (weightDomain.getWeightRecords as any).mockImplementation(() => {
        throw new Error('Storage error');
      });
      (todoDomain.getTodos as any).mockImplementation(() => {
        throw new Error('Storage error');
      });

      render(<WeightManager />);
      render(<TodoManager />);
      
      // Both should display error messages
      const errorMessages = screen.getAllByText('Storage error');
      expect(errorMessages).toHaveLength(2);
    });

    it('should handle form validation consistently', async () => {
      render(<WeightManager />);
      render(<TodoManager />);
      
      // Weight form validation
      await user.click(screen.getByText('記録追加'));
      const weightSubmit = screen.getByRole('button', { name: '追加' });
      
      // Clear required field
      const weightInput = screen.getByLabelText('体重 (kg)');
      await user.clear(weightInput);
      
      await user.click(weightSubmit);
      
      // Should not call domain function with invalid data
      expect(weightDomain.createWeightRecord).not.toHaveBeenCalled();
      
      // Todo form validation
      await user.click(screen.getByText('Todo追加'));
      const todoSubmit = screen.getAllByRole('button', { name: '追加' })[1];
      
      await user.click(todoSubmit);
      
      // Should not call domain function without required title
      expect(todoDomain.createTodo).not.toHaveBeenCalled();
    });

    it('should handle date inputs consistently', async () => {
      render(<WeightManager />);
      render(<TodoManager />);
      
      // Weight form date input
      await user.click(screen.getByText('記録追加'));
      const weightDateInput = screen.getByLabelText('測定日時');
      expect(weightDateInput).toHaveAttribute('type', 'datetime-local');
      
      // Todo form date input
      await user.click(screen.getByText('Todo追加'));
      const todoDateInput = screen.getByLabelText('期限');
      expect(todoDateInput).toHaveAttribute('type', 'date');
    });

    it('should handle modal interactions consistently', async () => {
      render(<WeightManager />);
      render(<TodoManager />);
      
      // Open weight form modal
      await user.click(screen.getByText('記録追加'));
      expect(screen.getByText('体重記録を追加')).toBeInTheDocument();
      
      // Close with cancel button
      await user.click(screen.getByRole('button', { name: 'キャンセル' }));
      expect(screen.queryByText('体重記録を追加')).not.toBeInTheDocument();
      
      // Open todo form modal
      await user.click(screen.getByText('Todo追加'));
      expect(screen.getByText('Todo追加')).toBeInTheDocument();
      
      // Close with cancel button
      await user.click(screen.getByRole('button', { name: 'キャンセル' }));
      expect(screen.queryByText('Todo追加')).not.toBeInTheDocument();
    });
  });

  describe('Performance and Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<WeightManager />);
      render(<TodoManager />);
      
      // Check for proper button roles
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Check for form inputs
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should handle rapid user interactions', async () => {
      render(<TodoManager />);
      
      // Rapid filter changes
      const statusSelect = screen.getByLabelText('ステータス');
      
      await user.selectOptions(statusSelect, 'pending');
      await user.selectOptions(statusSelect, 'completed');
      await user.selectOptions(statusSelect, 'in_progress');
      
      // Should handle all changes without error
      expect(todoDomain.getTodos).toHaveBeenCalledTimes(4); // Initial + 3 filter changes
    });

    it('should clean up resources on unmount', () => {
      const { unmount: unmountWeight } = render(<WeightManager />);
      const { unmount: unmountTodo } = render(<TodoManager />);
      
      unmountWeight();
      unmountTodo();
      
      // Components should unmount without errors
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data gracefully', () => {
      render(<WeightManager />);
      render(<TodoManager />);
      
      expect(screen.getByText('まだ記録がありません')).toBeInTheDocument();
      expect(screen.getByText('条件に一致するTodoがありません')).toBeInTheDocument();
    });

    it('should handle malformed date inputs', async () => {
      render(<WeightManager />);
      
      await user.click(screen.getByText('記録追加'));
      
      const dateInput = screen.getByLabelText('測定日時');
      
      // Try to input invalid date (browser should handle this)
      await user.type(dateInput, 'invalid-date');
      
      // Component should not crash
      expect(screen.getByText('体重記録を追加')).toBeInTheDocument();
    });

    it('should handle large datasets efficiently', () => {
      // Mock large dataset
      const largeTodoList = Array.from({ length: 100 }, (_, i) => ({
        id: `todo_${i}`,
        title: `Todo ${i}`,
        priority: 'medium' as const,
        status: 'pending' as const,
        category: 'work' as const,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      (todoDomain.getTodos as any).mockReturnValue({
        todos: largeTodoList,
        totalCount: 100,
        hasMore: false
      });

      const startTime = performance.now();
      render(<TodoManager />);
      const endTime = performance.now();
      
      // Should render within reasonable time (less than 1000ms)
      expect(endTime - startTime).toBeLessThan(1000);
      
      // Should display all todos
      expect(screen.getByText('Todo 0')).toBeInTheDocument();
      expect(screen.getByText('Todo 99')).toBeInTheDocument();
    });

    it('should handle network-like errors from domain layer', async () => {
      (todoDomain.createTodo as any).mockImplementation(() => {
        throw new Error('Network timeout');
      });

      render(<TodoManager />);
      
      await user.click(screen.getByText('Todo追加'));
      await user.type(screen.getByLabelText('タイトル *'), 'Test Todo');
      await user.click(screen.getByRole('button', { name: '追加' }));
      
      await waitFor(() => {
        expect(screen.getByText('Network timeout')).toBeInTheDocument();
      });
    });
  });
});