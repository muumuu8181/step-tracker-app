import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createWeightRecord, getWeightRecords } from '@core/domain/weight';
import { createTodo, getTodos } from '@core/domain/todo';
import { createSleepRecord, getSleepRecords } from '@core/domain/sleep';
import type { WeightFormData, TodoFormData, SleepFormData } from '@core/types/app';

// Mock localStorage with detailed tracking
class MockStorage {
  private storage = new Map<string, string>();
  private listeners: Array<(key: string, newValue: string | null, oldValue: string | null) => void> = [];

  getItem = vi.fn((key: string): string | null => {
    const value = this.storage.get(key) || null;
    return value;
  });

  setItem = vi.fn((key: string, value: string): void => {
    const oldValue = this.storage.get(key) || null;
    this.storage.set(key, value);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(key, value, oldValue));
  });

  removeItem = vi.fn((key: string): void => {
    const oldValue = this.storage.get(key) || null;
    this.storage.delete(key);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(key, null, oldValue));
  });

  clear = vi.fn((): void => {
    const oldEntries = new Map(this.storage);
    this.storage.clear();
    
    // Notify listeners for each cleared item
    oldEntries.forEach((value, key) => {
      this.listeners.forEach(listener => listener(key, null, value));
    });
  });

  key = vi.fn((index: number): string | null => {
    const keys = Array.from(this.storage.keys());
    return keys[index] || null;
  });

  get length(): number {
    return this.storage.size;
  }

  // Test utility methods
  getRawData(): Map<string, string> {
    return new Map(this.storage);
  }

  addListener(listener: (key: string, newValue: string | null, oldValue: string | null) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (key: string, newValue: string | null, oldValue: string | null) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Simulate storage errors
  simulateError(method: 'getItem' | 'setItem' | 'removeItem' | 'clear', shouldThrow = true): void {
    if (shouldThrow) {
      this[method] = vi.fn(() => {
        throw new Error(`Simulated localStorage ${method} error`);
      });
    } else {
      // Reset to normal behavior
      this.resetMethod(method);
    }
  }

  resetMethod(method: 'getItem' | 'setItem' | 'removeItem' | 'clear'): void {
    switch (method) {
      case 'getItem':
        this.getItem = vi.fn((key: string) => this.storage.get(key) || null);
        break;
      case 'setItem':
        this.setItem = vi.fn((key: string, value: string) => {
          const oldValue = this.storage.get(key) || null;
          this.storage.set(key, value);
          this.listeners.forEach(listener => listener(key, value, oldValue));
        });
        break;
      case 'removeItem':
        this.removeItem = vi.fn((key: string) => {
          const oldValue = this.storage.get(key) || null;
          this.storage.delete(key);
          this.listeners.forEach(listener => listener(key, null, oldValue));
        });
        break;
      case 'clear':
        this.clear = vi.fn(() => {
          const oldEntries = new Map(this.storage);
          this.storage.clear();
          oldEntries.forEach((value, key) => {
            this.listeners.forEach(listener => listener(key, null, value));
          });
        });
        break;
    }
  }

  // Simulate storage quota exceeded
  simulateQuotaExceeded(): void {
    this.setItem = vi.fn(() => {
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      throw error;
    });
  }
}

describe('Data Persistence Tests', () => {
  let mockStorage: MockStorage;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    mockStorage = new MockStorage();
    vi.clearAllMocks();
    Object.defineProperty(global, 'localStorage', { 
      value: mockStorage,
      configurable: true
    });
  });

  describe('Weight Data Persistence', () => {
    const weightFormData: WeightFormData = {
      value: 70,
      unit: 'kg',
      measuredAt: new Date('2025-01-15T08:00:00Z'),
      note: 'Morning weight',
      bodyFatPercentage: 15,
      muscleMass: 45
    };

    it('should persist weight records to localStorage', () => {
      const record = createWeightRecord(testUserId, weightFormData);
      
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'integrated_life_app_weight_records',
        expect.stringContaining(record.id)
      );
      
      // Verify the data structure
      const storedData = mockStorage.getRawData().get('integrated_life_app_weight_records');
      expect(storedData).toBeDefined();
      
      const parsedData = JSON.parse(storedData!);
      expect(parsedData).toHaveLength(1);
      expect(parsedData[0].id).toBe(record.id);
      expect(parsedData[0].userId).toBe(testUserId);
    });

    it('should retrieve weight records from localStorage', () => {
      // Create multiple records
      const record1 = createWeightRecord(testUserId, weightFormData);
      const record2 = createWeightRecord(testUserId, { ...weightFormData, value: 72 });
      
      // Clear method calls and retrieve
      vi.clearAllMocks();
      const { records } = getWeightRecords(testUserId);
      
      expect(mockStorage.getItem).toHaveBeenCalledWith('integrated_life_app_weight_records');
      expect(records).toHaveLength(2);
      expect(records.map(r => r.id)).toContain(record1.id);
      expect(records.map(r => r.id)).toContain(record2.id);
    });

    it('should handle localStorage getItem errors gracefully', () => {
      mockStorage.simulateError('getItem');
      
      const { records } = getWeightRecords(testUserId);
      expect(records).toEqual([]);
      expect(mockStorage.getItem).toHaveBeenCalled();
    });

    it('should handle localStorage setItem errors', () => {
      mockStorage.simulateError('setItem');
      
      expect(() => createWeightRecord(testUserId, weightFormData)).toThrow('体重記録の保存に失敗しました');
      expect(mockStorage.setItem).toHaveBeenCalled();
    });

    it('should handle corrupted localStorage data', () => {
      // Manually set corrupted data
      mockStorage.resetMethod('setItem');
      mockStorage.setItem('integrated_life_app_weight_records', 'invalid json data');
      
      const { records } = getWeightRecords(testUserId);
      expect(records).toEqual([]);
    });

    it('should handle localStorage quota exceeded', () => {
      mockStorage.simulateQuotaExceeded();
      
      expect(() => createWeightRecord(testUserId, weightFormData)).toThrow();
    });

    it('should handle date serialization/deserialization correctly', () => {
      const record = createWeightRecord(testUserId, weightFormData);
      const { records } = getWeightRecords(testUserId);
      
      expect(records[0].weight.measuredAt).toBeInstanceOf(Date);
      expect(records[0].createdAt).toBeInstanceOf(Date);
      expect(records[0].updatedAt).toBeInstanceOf(Date);
      expect(records[0].weight.measuredAt.toISOString()).toBe(weightFormData.measuredAt.toISOString());
    });
  });

  describe('Todo Data Persistence', () => {
    const todoFormData: TodoFormData = {
      title: 'Test Todo',
      description: 'Test description',
      priority: 'high',
      category: 'work',
      dueDate: new Date('2025-02-01T10:00:00Z'),
      estimatedDuration: 120,
      tags: ['test', 'important']
    };

    it('should persist todo records to localStorage', () => {
      const todo = createTodo(todoFormData);
      
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'integrated_life_app_todos',
        expect.stringContaining(todo.id)
      );
      
      // Verify the data structure
      const storedData = mockStorage.getRawData().get('integrated_life_app_todos');
      expect(storedData).toBeDefined();
      
      const parsedData = JSON.parse(storedData!);
      expect(parsedData).toHaveLength(1);
      expect(parsedData[0].id).toBe(todo.id);
      expect(parsedData[0].title).toBe(todoFormData.title);
    });

    it('should retrieve todo records from localStorage', () => {
      const todo1 = createTodo(todoFormData);
      const todo2 = createTodo({ ...todoFormData, title: 'Second Todo' });
      
      vi.clearAllMocks();
      const { todos } = getTodos();
      
      expect(mockStorage.getItem).toHaveBeenCalledWith('integrated_life_app_todos');
      expect(todos).toHaveLength(2);
      expect(todos.map(t => t.id)).toContain(todo1.id);
      expect(todos.map(t => t.id)).toContain(todo2.id);
    });

    it('should handle optional date fields correctly', () => {
      // Todo without due date
      const todoWithoutDate = createTodo({
        title: 'No Due Date',
        priority: 'medium',
        category: 'personal',
        tags: []
      });
      
      const { todos } = getTodos();
      const retrievedTodo = todos.find(t => t.id === todoWithoutDate.id);
      
      expect(retrievedTodo?.dueDate).toBeUndefined();
      expect(retrievedTodo?.completedAt).toBeUndefined();
    });

    it('should handle todo status updates and completedAt timestamps', () => {
      const todo = createTodo(todoFormData);
      
      // Simulate updating status to completed
      const updatedData = mockStorage.getRawData().get('integrated_life_app_todos');
      const todos = JSON.parse(updatedData!);
      todos[0].status = 'completed';
      todos[0].completedAt = new Date().toISOString();
      mockStorage.setItem('integrated_life_app_todos', JSON.stringify(todos));
      
      const { todos: retrievedTodos } = getTodos();
      const completedTodo = retrievedTodos.find(t => t.id === todo.id);
      
      expect(completedTodo?.status).toBe('completed');
      expect(completedTodo?.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('Sleep Data Persistence', () => {
    const sleepFormData: SleepFormData = {
      bedTime: new Date('2025-01-15T23:00:00Z'),
      wakeTime: new Date('2025-01-16T07:00:00Z'),
      sleepQuality: 4,
      note: 'Good sleep'
    };

    it('should persist sleep records to localStorage', () => {
      const record = createSleepRecord(testUserId, sleepFormData);
      
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'integrated_life_app_sleep_records',
        expect.stringContaining(record.id)
      );
      
      // Verify the data structure
      const storedData = mockStorage.getRawData().get('integrated_life_app_sleep_records');
      expect(storedData).toBeDefined();
      
      const parsedData = JSON.parse(storedData!);
      expect(parsedData).toHaveLength(1);
      expect(parsedData[0].id).toBe(record.id);
      expect(parsedData[0].userId).toBe(testUserId);
    });

    it('should calculate and persist sleep duration correctly', () => {
      const record = createSleepRecord(testUserId, sleepFormData);
      const { records } = getSleepRecords(testUserId);
      
      expect(records[0].sleep.sleepDuration).toBe(480); // 8 hours in minutes
      
      // Verify it's stored correctly
      const storedData = mockStorage.getRawData().get('integrated_life_app_sleep_records');
      const parsedData = JSON.parse(storedData!);
      expect(parsedData[0].sleep.sleepDuration).toBe(480);
    });

    it('should handle cross-midnight sleep times', () => {
      const crossMidnightData: SleepFormData = {
        bedTime: new Date('2025-01-15T23:30:00Z'),
        wakeTime: new Date('2025-01-16T06:30:00Z'),
        sleepQuality: 3,
        note: 'Cross midnight sleep'
      };
      
      const record = createSleepRecord(testUserId, crossMidnightData);
      const { records } = getSleepRecords(testUserId);
      
      expect(records[0].sleep.sleepDuration).toBe(420); // 7 hours
    });
  });

  describe('Cross-Domain Data Integrity', () => {
    it('should maintain data isolation between different data types', () => {
      // Create data for all domains
      createWeightRecord(testUserId, {
        value: 70,
        unit: 'kg',
        measuredAt: new Date(),
        note: 'Weight record'
      });
      
      createTodo({
        title: 'Test Todo',
        priority: 'medium',
        category: 'work',
        tags: []
      });
      
      createSleepRecord(testUserId, {
        bedTime: new Date('2025-01-15T23:00:00Z'),
        wakeTime: new Date('2025-01-16T07:00:00Z'),
        sleepQuality: 4
      });
      
      // Verify each domain has its own storage key
      const storageKeys = Array.from(mockStorage.getRawData().keys());
      expect(storageKeys).toContain('integrated_life_app_weight_records');
      expect(storageKeys).toContain('integrated_life_app_todos');
      expect(storageKeys).toContain('integrated_life_app_sleep_records');
      expect(storageKeys).toHaveLength(3);
    });

    it('should handle concurrent access to localStorage', () => {
      const storageEvents: Array<{ key: string, newValue: string | null, oldValue: string | null }> = [];
      
      mockStorage.addListener((key, newValue, oldValue) => {
        storageEvents.push({ key, newValue, oldValue });
      });
      
      // Simulate concurrent writes
      createWeightRecord(testUserId, {
        value: 70,
        unit: 'kg',
        measuredAt: new Date(),
      });
      
      createTodo({
        title: 'Concurrent Todo',
        priority: 'high',
        category: 'work',
        tags: []
      });
      
      expect(storageEvents).toHaveLength(2);
      expect(storageEvents[0].key).toBe('integrated_life_app_weight_records');
      expect(storageEvents[1].key).toBe('integrated_life_app_todos');
    });

    it('should handle storage cleanup on data deletion', () => {
      // This test would be more relevant if there was a cleanup mechanism
      // For now, we test that deleted items don't appear in retrieval
      const todo = createTodo({
        title: 'To be deleted',
        priority: 'low',
        category: 'other',
        tags: []
      });
      
      // Manually remove the todo from storage
      const storedData = mockStorage.getRawData().get('integrated_life_app_todos');
      const todos = JSON.parse(storedData!);
      const filteredTodos = todos.filter((t: any) => t.id !== todo.id);
      mockStorage.setItem('integrated_life_app_todos', JSON.stringify(filteredTodos));
      
      const { todos: retrievedTodos } = getTodos();
      expect(retrievedTodos.find(t => t.id === todo.id)).toBeUndefined();
    });

    it('should handle large datasets efficiently', () => {
      // Create a large number of records
      const recordCount = 100;
      
      for (let i = 0; i < recordCount; i++) {
        createWeightRecord(testUserId, {
          value: 70 + i * 0.1,
          unit: 'kg',
          measuredAt: new Date(Date.now() + i * 86400000),
          note: `Weight record ${i}`
        });
      }
      
      const { records, totalCount } = getWeightRecords(testUserId, 1, 50);
      expect(records).toHaveLength(50);
      expect(totalCount).toBe(recordCount);
      
      // Verify storage size is reasonable
      const storedData = mockStorage.getRawData().get('integrated_life_app_weight_records');
      expect(storedData!.length).toBeGreaterThan(1000); // Should contain substantial data
      expect(storedData!.length).toBeLessThan(1000000); // But not excessive
    });
  });

  describe('Storage Event Handling', () => {
    it('should handle storage events from other tabs/windows', () => {
      // Simulate external storage change
      const externalData = [{
        id: 'external_todo_123',
        title: 'External Todo',
        priority: 'high',
        category: 'work',
        status: 'pending',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
      
      mockStorage.setItem('integrated_life_app_todos', JSON.stringify(externalData));
      
      const { todos } = getTodos();
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('External Todo');
    });

    it('should handle partial data corruption', () => {
      // Create valid data first
      createTodo({
        title: 'Valid Todo',
        priority: 'medium',
        category: 'work',
        tags: []
      });
      
      // Corrupt only part of the data
      const storedData = mockStorage.getRawData().get('integrated_life_app_todos');
      const corruptedData = storedData!.substring(0, storedData!.length - 10) + 'corrupted';
      mockStorage.setItem('integrated_life_app_todos', corruptedData);
      
      // Should handle corruption gracefully
      const { todos } = getTodos();
      expect(todos).toEqual([]); // Falls back to empty array
    });

    it('should handle missing storage keys', () => {
      // Don't create any data, just try to retrieve
      const { records } = getWeightRecords(testUserId);
      const { todos } = getTodos();
      const { records: sleepRecords } = getSleepRecords(testUserId);
      
      expect(records).toEqual([]);
      expect(todos).toEqual([]);
      expect(sleepRecords).toEqual([]);
      
      expect(mockStorage.getItem).toHaveBeenCalledWith('integrated_life_app_weight_records');
      expect(mockStorage.getItem).toHaveBeenCalledWith('integrated_life_app_todos');
      expect(mockStorage.getItem).toHaveBeenCalledWith('integrated_life_app_sleep_records');
    });
  });
});