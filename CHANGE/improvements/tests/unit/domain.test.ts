import { describe, it, expect, beforeEach, vi } from 'vitest';

// Weight domain functions
import {
  calculateBMI,
  getBMICategory,
  convertWeightUnit,
  createWeightRecord,
  getWeightRecords,
  updateWeightRecord,
  deleteWeightRecord,
  calculateWeightStats,
  createWeightGoal,
  getActiveWeightGoal
} from '@core/domain/weight';

// Todo domain functions
import {
  getPriorityValue,
  getPriorityColor,
  getStatusDisplayName,
  getCategoryDisplayName,
  getDaysUntilDue,
  isOverdue,
  getCompletionTime,
  createTodo,
  getTodos,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
  calculateTodoStats,
  getOverdueTodos,
  getTodosDueToday,
  getAllUsedTags
} from '@core/domain/todo';

// Sleep domain functions
import {
  calculateSleepDuration,
  convertToMinutes,
  formatMinutesToHoursMinutes,
  formatTimeToHHMM,
  getSleepQualityText,
  evaluateSleepDuration,
  createSleepRecord,
  getSleepRecords,
  updateSleepRecord,
  deleteSleepRecord,
  calculateSleepStats,
  createSleepGoal,
  getActiveSleepGoal
} from '@core/domain/sleep';

import type { WeightFormData, TodoFormData, SleepFormData, TodoPriority, TodoStatus, TodoCategory } from '@core/types/app';

// Mock localStorage
const mockStorage = new Map<string, string>();
const localStorageMock = {
  getItem: vi.fn((key: string) => mockStorage.get(key) || null),
  setItem: vi.fn((key: string, value: string) => mockStorage.set(key, value)),
  removeItem: vi.fn((key: string) => mockStorage.delete(key)),
  clear: vi.fn(() => mockStorage.clear())
};

// Setup
beforeEach(() => {
  mockStorage.clear();
  vi.clearAllMocks();
  Object.defineProperty(global, 'localStorage', { value: localStorageMock });
});

describe('Weight Domain Logic', () => {
  describe('BMI Calculations', () => {
    it('should calculate BMI correctly', () => {
      expect(calculateBMI(70, 175)).toBe(22.9);
      expect(calculateBMI(60, 160)).toBe(23.4);
      expect(calculateBMI(80, 180)).toBe(24.7);
    });

    it('should categorize BMI correctly', () => {
      expect(getBMICategory(17)).toBe('underweight');
      expect(getBMICategory(20)).toBe('normal');
      expect(getBMICategory(26)).toBe('overweight');
      expect(getBMICategory(35)).toBe('obese');
    });
  });

  describe('Weight Unit Conversion', () => {
    it('should convert kg to lb correctly', () => {
      expect(convertWeightUnit(70, 'kg', 'lb')).toBe(154.3);
      expect(convertWeightUnit(60, 'kg', 'lb')).toBe(132.3);
    });

    it('should convert lb to kg correctly', () => {
      expect(convertWeightUnit(154.3, 'lb', 'kg')).toBe(70);
      expect(convertWeightUnit(220.5, 'lb', 'kg')).toBe(100);
    });

    it('should return same value for same units', () => {
      expect(convertWeightUnit(70, 'kg', 'kg')).toBe(70);
      expect(convertWeightUnit(154, 'lb', 'lb')).toBe(154);
    });
  });

  describe('Weight Record Management', () => {
    const testUserId = 'user123';
    const weightFormData: WeightFormData = {
      value: 70,
      unit: 'kg',
      measuredAt: new Date('2025-01-15T08:00:00Z'),
      note: 'Morning weight',
      bodyFatPercentage: 15,
      muscleMass: 45
    };

    it('should create weight record', () => {
      const record = createWeightRecord(testUserId, weightFormData);
      
      expect(record.userId).toBe(testUserId);
      expect(record.weight.value).toBe(70);
      expect(record.weight.unit).toBe('kg');
      expect(record.weight.note).toBe('Morning weight');
      expect(record.bodyFatPercentage).toBe(15);
      expect(record.muscleMass).toBe(45);
      expect(record.id).toMatch(/^weight_/);
    });

    it('should retrieve weight records with pagination', () => {
      // Create multiple records
      for (let i = 0; i < 5; i++) {
        createWeightRecord(testUserId, {
          ...weightFormData,
          value: 70 + i,
          measuredAt: new Date(Date.now() + i * 86400000)
        });
      }

      const result = getWeightRecords(testUserId, 1, 3);
      expect(result.records).toHaveLength(3);
      expect(result.totalCount).toBe(5);
      expect(result.hasMore).toBe(true);
    });

    it('should update weight record', () => {
      const record = createWeightRecord(testUserId, weightFormData);
      const updatedFormData: WeightFormData = {
        ...weightFormData,
        value: 72,
        note: 'Updated weight'
      };

      const updatedRecord = updateWeightRecord(record.id, updatedFormData);
      expect(updatedRecord.weight.value).toBe(72);
      expect(updatedRecord.weight.note).toBe('Updated weight');
      expect(updatedRecord.updatedAt).toBeInstanceOf(Date);
    });

    it('should delete weight record', () => {
      const record = createWeightRecord(testUserId, weightFormData);
      const deleted = deleteWeightRecord(record.id);
      
      expect(deleted).toBe(true);
      
      const records = getWeightRecords(testUserId);
      expect(records.totalCount).toBe(0);
    });

    it('should calculate weight stats', () => {
      // Create multiple records with different weights
      const weights = [68, 69, 70, 71, 72];
      weights.forEach((weight, index) => {
        createWeightRecord(testUserId, {
          ...weightFormData,
          value: weight,
          measuredAt: new Date(Date.now() - (weights.length - index - 1) * 86400000)
        });
      });

      const stats = calculateWeightStats(testUserId);
      expect(stats.currentWeight).toBe(72);
      expect(stats.previousWeight).toBe(71);
      expect(stats.weightChange).toBe(1);
      expect(stats.bmiCategory).toBe('normal');
    });
  });

  describe('Weight Goal Management', () => {
    const testUserId = 'user123';

    it('should create weight goal', () => {
      const targetWeight = 65;
      const targetDate = new Date('2025-06-01T00:00:00Z');
      
      const goal = createWeightGoal(testUserId, targetWeight, targetDate);
      
      expect(goal.userId).toBe(testUserId);
      expect(goal.targetWeight).toBe(targetWeight);
      expect(goal.targetDate).toEqual(targetDate);
      expect(goal.isActive).toBe(true);
    });

    it('should retrieve active weight goal', () => {
      const targetWeight = 65;
      const targetDate = new Date('2025-06-01T00:00:00Z');
      
      const goal = createWeightGoal(testUserId, targetWeight, targetDate);
      const activeGoal = getActiveWeightGoal(testUserId);
      
      expect(activeGoal).toEqual(goal);
    });
  });
});

describe('Todo Domain Logic', () => {
  describe('Priority and Status Utilities', () => {
    it('should return correct priority values', () => {
      expect(getPriorityValue('urgent')).toBe(4);
      expect(getPriorityValue('high')).toBe(3);
      expect(getPriorityValue('medium')).toBe(2);
      expect(getPriorityValue('low')).toBe(1);
    });

    it('should return correct priority colors', () => {
      expect(getPriorityColor('urgent')).toBe('#ff4757');
      expect(getPriorityColor('high')).toBe('#ff6b6b');
      expect(getPriorityColor('medium')).toBe('#ffa726');
      expect(getPriorityColor('low')).toBe('#66bb6a');
    });

    it('should return correct status display names', () => {
      expect(getStatusDisplayName('pending')).toBe('未着手');
      expect(getStatusDisplayName('in_progress')).toBe('進行中');
      expect(getStatusDisplayName('completed')).toBe('完了');
      expect(getStatusDisplayName('cancelled')).toBe('キャンセル');
    });

    it('should return correct category display names', () => {
      expect(getCategoryDisplayName('work')).toBe('仕事');
      expect(getCategoryDisplayName('personal')).toBe('個人');
      expect(getCategoryDisplayName('health')).toBe('健康');
      expect(getCategoryDisplayName('finance')).toBe('金融');
      expect(getCategoryDisplayName('learning')).toBe('学習');
      expect(getCategoryDisplayName('other')).toBe('その他');
    });
  });

  describe('Date Utilities', () => {
    it('should calculate days until due correctly', () => {
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 86400000);
      const yesterday = new Date(today.getTime() - 86400000);
      
      expect(getDaysUntilDue(tomorrow)).toBe(1);
      expect(getDaysUntilDue(yesterday)).toBe(-1);
    });

    it('should detect overdue todos', () => {
      const overdueTodo = {
        id: '1',
        title: 'Overdue task',
        priority: 'medium' as TodoPriority,
        status: 'pending' as TodoStatus,
        category: 'work' as TodoCategory,
        dueDate: new Date(Date.now() - 86400000), // Yesterday
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(isOverdue(overdueTodo)).toBe(true);

      // Completed todos are not overdue
      const completedTodo = {
        ...overdueTodo,
        status: 'completed' as TodoStatus
      };
      expect(isOverdue(completedTodo)).toBe(false);
    });

    it('should calculate completion time', () => {
      const createdAt = new Date('2025-01-10T09:00:00Z');
      const completedAt = new Date('2025-01-12T15:00:00Z');
      
      const days = getCompletionTime(createdAt, completedAt);
      expect(days).toBe(3); // Should be 3 days (rounded up)
    });
  });

  describe('Todo CRUD Operations', () => {
    const todoFormData: TodoFormData = {
      title: 'Test Todo',
      description: 'This is a test todo',
      priority: 'high',
      category: 'work',
      dueDate: new Date('2025-02-01T10:00:00Z'),
      estimatedDuration: 120,
      tags: ['test', 'important']
    };

    it('should create todo', () => {
      const todo = createTodo(todoFormData);
      
      expect(todo.title).toBe('Test Todo');
      expect(todo.description).toBe('This is a test todo');
      expect(todo.priority).toBe('high');
      expect(todo.category).toBe('work');
      expect(todo.status).toBe('pending');
      expect(todo.tags).toEqual(['test', 'important']);
      expect(todo.id).toMatch(/^todo_/);
    });

    it('should retrieve todos with sorting', () => {
      // Create todos with different priorities
      createTodo({ ...todoFormData, priority: 'low', title: 'Low priority' });
      createTodo({ ...todoFormData, priority: 'urgent', title: 'Urgent task' });
      createTodo({ ...todoFormData, priority: 'medium', title: 'Medium task' });

      const result = getTodos();
      expect(result.todos).toHaveLength(3);
      
      // Should be sorted by priority (urgent first)
      expect(result.todos[0].priority).toBe('urgent');
      expect(result.todos[1].priority).toBe('medium');
      expect(result.todos[2].priority).toBe('low');
    });

    it('should update todo', () => {
      const todo = createTodo(todoFormData);
      const updatedFormData: TodoFormData = {
        ...todoFormData,
        title: 'Updated Todo',
        priority: 'urgent'
      };

      const updatedTodo = updateTodo(todo.id, updatedFormData);
      expect(updatedTodo.title).toBe('Updated Todo');
      expect(updatedTodo.priority).toBe('urgent');
    });

    it('should update todo status', () => {
      const todo = createTodo(todoFormData);
      const completedTodo = updateTodoStatus(todo.id, 'completed');
      
      expect(completedTodo.status).toBe('completed');
      expect(completedTodo.completedAt).toBeInstanceOf(Date);
    });

    it('should delete todo', () => {
      const todo = createTodo(todoFormData);
      const deleted = deleteTodo(todo.id);
      
      expect(deleted).toBe(true);
      
      const result = getTodos();
      expect(result.totalCount).toBe(0);
    });
  });

  describe('Todo Statistics', () => {
    beforeEach(() => {
      // Create test todos
      createTodo({
        title: 'Completed Task 1',
        priority: 'high',
        category: 'work',
        tags: []
      });
      
      const completedTodo = createTodo({
        title: 'Completed Task 2',
        priority: 'medium',
        category: 'personal',
        tags: []
      });
      
      updateTodoStatus(completedTodo.id, 'completed');

      createTodo({
        title: 'Overdue Task',
        priority: 'urgent',
        category: 'work',
        dueDate: new Date(Date.now() - 86400000), // Yesterday
        tags: []
      });
    });

    it('should calculate todo statistics', () => {
      const stats = calculateTodoStats();
      
      expect(stats.totalTodos).toBe(3);
      expect(stats.completedTodos).toBe(1);
      expect(stats.pendingTodos).toBe(2);
      expect(stats.overdueTodos).toBe(1);
      expect(stats.completionRate).toBe(33); // 1/3 * 100, rounded
    });

    it('should get overdue todos', () => {
      const overdueTodos = getOverdueTodos();
      expect(overdueTodos).toHaveLength(1);
      expect(overdueTodos[0].title).toBe('Overdue Task');
    });

    it('should get todos due today', () => {
      // Create a todo due today
      createTodo({
        title: 'Due Today',
        priority: 'high',
        category: 'work',
        dueDate: new Date(), // Today
        tags: []
      });

      const todayTodos = getTodosDueToday();
      expect(todayTodos).toHaveLength(1);
      expect(todayTodos[0].title).toBe('Due Today');
    });

    it('should get all used tags', () => {
      createTodo({
        title: 'Tagged Task',
        priority: 'medium',
        category: 'work',
        tags: ['react', 'typescript', 'testing']
      });

      const tags = getAllUsedTags();
      expect(tags).toContain('react');
      expect(tags).toContain('typescript');
      expect(tags).toContain('testing');
    });
  });
});

describe('Sleep Domain Logic', () => {
  describe('Sleep Duration Calculations', () => {
    it('should calculate sleep duration correctly', () => {
      const bedTime = new Date('2025-01-15T23:00:00Z');
      const wakeTime = new Date('2025-01-16T07:00:00Z');
      
      const duration = calculateSleepDuration(bedTime, wakeTime);
      expect(duration).toBe(480); // 8 hours = 480 minutes
    });

    it('should handle cross-midnight sleep duration', () => {
      const bedTime = new Date('2025-01-15T23:30:00Z');
      const wakeTime = new Date('2025-01-16T06:30:00Z');
      
      const duration = calculateSleepDuration(bedTime, wakeTime);
      expect(duration).toBe(420); // 7 hours = 420 minutes
    });

    it('should convert hours and minutes to total minutes', () => {
      expect(convertToMinutes(8, 30)).toBe(510);
      expect(convertToMinutes(7, 0)).toBe(420);
      expect(convertToMinutes(0, 45)).toBe(45);
    });

    it('should format minutes to hours:minutes', () => {
      expect(formatMinutesToHoursMinutes(480)).toBe('08:00');
      expect(formatMinutesToHoursMinutes(510)).toBe('08:30');
      expect(formatMinutesToHoursMinutes(90)).toBe('01:30');
    });

    it('should format time to HH:MM', () => {
      const time = new Date('2025-01-15T07:30:00Z');
      expect(formatTimeToHHMM(time)).toBe('07:30');
    });
  });

  describe('Sleep Quality and Evaluation', () => {
    it('should return correct sleep quality text', () => {
      expect(getSleepQualityText(1)).toBe('悪い');
      expect(getSleepQualityText(2)).toBe('やや悪い');
      expect(getSleepQualityText(3)).toBe('普通');
      expect(getSleepQualityText(4)).toBe('良い');
      expect(getSleepQualityText(5)).toBe('とても良い');
    });

    it('should evaluate sleep duration correctly', () => {
      expect(evaluateSleepDuration(300)).toBe('short'); // 5 hours
      expect(evaluateSleepDuration(480)).toBe('optimal'); // 8 hours
      expect(evaluateSleepDuration(600)).toBe('long'); // 10 hours
    });
  });

  describe('Sleep Record Management', () => {
    const testUserId = 'user123';
    const sleepFormData: SleepFormData = {
      bedTime: new Date('2025-01-15T23:00:00Z'),
      wakeTime: new Date('2025-01-16T07:00:00Z'),
      sleepQuality: 4,
      note: 'Good sleep'
    };

    it('should create sleep record', () => {
      const record = createSleepRecord(testUserId, sleepFormData);
      
      expect(record.userId).toBe(testUserId);
      expect(record.sleep.bedTime).toEqual(sleepFormData.bedTime);
      expect(record.sleep.wakeTime).toEqual(sleepFormData.wakeTime);
      expect(record.sleep.sleepQuality).toBe(4);
      expect(record.sleep.sleepDuration).toBe(480); // 8 hours
      expect(record.sleep.note).toBe('Good sleep');
      expect(record.id).toMatch(/^sleep_/);
    });

    it('should retrieve sleep records with pagination', () => {
      // Create multiple records
      for (let i = 0; i < 5; i++) {
        const bedTime = new Date(Date.now() - i * 86400000 - 8 * 3600000); // i days ago at 8pm
        const wakeTime = new Date(Date.now() - i * 86400000 + 8 * 3600000); // next day at 8am
        
        createSleepRecord(testUserId, {
          ...sleepFormData,
          bedTime,
          wakeTime,
          sleepQuality: (i % 5 + 1) as (1 | 2 | 3 | 4 | 5)
        });
      }

      const result = getSleepRecords(testUserId, 1, 3);
      expect(result.records).toHaveLength(3);
      expect(result.totalCount).toBe(5);
      expect(result.hasMore).toBe(true);
    });

    it('should update sleep record', () => {
      const record = createSleepRecord(testUserId, sleepFormData);
      const updatedFormData: SleepFormData = {
        ...sleepFormData,
        sleepQuality: 5,
        note: 'Excellent sleep'
      };

      const updatedRecord = updateSleepRecord(record.id, updatedFormData);
      expect(updatedRecord.sleep.sleepQuality).toBe(5);
      expect(updatedRecord.sleep.note).toBe('Excellent sleep');
    });

    it('should delete sleep record', () => {
      const record = createSleepRecord(testUserId, sleepFormData);
      const deleted = deleteSleepRecord(record.id);
      
      expect(deleted).toBe(true);
      
      const records = getSleepRecords(testUserId);
      expect(records.totalCount).toBe(0);
    });

    it('should calculate sleep statistics', () => {
      // Create multiple records with varying quality
      const qualities: (1 | 2 | 3 | 4 | 5)[] = [3, 4, 5, 4, 3];
      qualities.forEach((quality, index) => {
        const bedTime = new Date(Date.now() - index * 86400000 - 8 * 3600000);
        const wakeTime = new Date(Date.now() - index * 86400000 + 8 * 3600000);
        
        createSleepRecord(testUserId, {
          bedTime,
          wakeTime,
          sleepQuality: quality,
          note: `Sleep ${index + 1}`
        });
      });

      const stats = calculateSleepStats(testUserId);
      expect(stats.averageSleepDuration).toBe(960); // 16 hours (due to test calculation)
      expect(stats.averageSleepQuality).toBe(3.8); // Average of qualities
      expect(stats.weeklyTrend).toBe('stable');
    });
  });

  describe('Sleep Goal Management', () => {
    const testUserId = 'user123';

    it('should create sleep goal', () => {
      const targetSleepDuration = 480; // 8 hours in minutes
      const targetBedTime = '23:00';
      const targetWakeTime = '07:00';
      
      const goal = createSleepGoal(testUserId, targetSleepDuration, targetBedTime, targetWakeTime);
      
      expect(goal.userId).toBe(testUserId);
      expect(goal.targetSleepDuration).toBe(targetSleepDuration);
      expect(goal.targetBedTime).toBe(targetBedTime);
      expect(goal.targetWakeTime).toBe(targetWakeTime);
      expect(goal.isActive).toBe(true);
    });

    it('should retrieve active sleep goal', () => {
      const targetSleepDuration = 480;
      const targetBedTime = '23:00';
      const targetWakeTime = '07:00';
      
      const goal = createSleepGoal(testUserId, targetSleepDuration, targetBedTime, targetWakeTime);
      const activeGoal = getActiveSleepGoal(testUserId);
      
      expect(activeGoal).toEqual(goal);
    });
  });
});

describe('Cross-Domain Integration', () => {
  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    // Functions should handle errors and return empty arrays or default values
    expect(() => getWeightRecords('test-user')).not.toThrow();
    expect(() => getTodos()).not.toThrow();
    expect(() => getSleepRecords('test-user')).not.toThrow();
  });

  it('should handle malformed data gracefully', () => {
    // Store malformed JSON
    localStorageMock.getItem.mockReturnValue('invalid json');

    expect(() => getWeightRecords('test-user')).not.toThrow();
    expect(() => getTodos()).not.toThrow();
    expect(() => getSleepRecords('test-user')).not.toThrow();
  });

  it('should generate unique IDs', () => {
    const todo1 = createTodo({
      title: 'Task 1',
      priority: 'medium',
      category: 'work',
      tags: []
    });

    const todo2 = createTodo({
      title: 'Task 2', 
      priority: 'high',
      category: 'personal',
      tags: []
    });

    expect(todo1.id).not.toBe(todo2.id);
    expect(todo1.id).toMatch(/^todo_/);
    expect(todo2.id).toMatch(/^todo_/);
  });
});