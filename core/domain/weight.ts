// 体重管理ドメインロジック
import { Weight, WeightRecord, WeightGoal, WeightStats, WeightFormData } from '../types/app';

// ===== 定数定義 =====
const WEIGHT_STORAGE_KEY = 'integrated_life_app_weight_records';
const WEIGHT_GOALS_STORAGE_KEY = 'integrated_life_app_weight_goals';

// ===== ユーティリティ関数 =====

/**
 * BMI計算関数
 * @param weightKg 体重（kg）
 * @param heightCm 身長（cm）
 * @returns BMI値
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * BMIカテゴリ判定
 * @param bmi BMI値
 * @returns BMIカテゴリ
 */
export function getBMICategory(bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25.0) return 'normal';
  if (bmi < 30.0) return 'overweight';
  return 'obese';
}

/**
 * 体重単位変換
 * @param value 体重値
 * @param fromUnit 変換前単位
 * @param toUnit 変換後単位
 * @returns 変換後の体重値
 */
export function convertWeightUnit(value: number, fromUnit: 'kg' | 'lb', toUnit: 'kg' | 'lb'): number {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === 'kg' && toUnit === 'lb') {
    return parseFloat((value * 2.20462).toFixed(1));
  }
  
  if (fromUnit === 'lb' && toUnit === 'kg') {
    return parseFloat((value / 2.20462).toFixed(1));
  }
  
  return value;
}

/**
 * 一意IDの生成
 */
function generateId(): string {
  return `weight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ===== データ永続化関数 =====

/**
 * ローカルストレージから体重記録を取得
 */
function getStoredWeightRecords(): WeightRecord[] {
  try {
    const stored = localStorage.getItem(WEIGHT_STORAGE_KEY);
    if (!stored) return [];
    
    const records = JSON.parse(stored);
    return records.map((record: any) => ({
      ...record,
      weight: {
        ...record.weight,
        measuredAt: new Date(record.weight.measuredAt)
      },
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading weight records:', error);
    return [];
  }
}

/**
 * ローカルストレージに体重記録を保存
 */
function saveWeightRecords(records: WeightRecord[]): void {
  try {
    localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving weight records:', error);
    throw new Error('体重記録の保存に失敗しました');
  }
}

/**
 * ローカルストレージから体重目標を取得
 */
function getStoredWeightGoals(): WeightGoal[] {
  try {
    const stored = localStorage.getItem(WEIGHT_GOALS_STORAGE_KEY);
    if (!stored) return [];
    
    const goals = JSON.parse(stored);
    return goals.map((goal: any) => ({
      ...goal,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt)
    }));
  } catch (error) {
    console.error('Error loading weight goals:', error);
    return [];
  }
}

/**
 * ローカルストレージに体重目標を保存
 */
function saveWeightGoals(goals: WeightGoal[]): void {
  try {
    localStorage.setItem(WEIGHT_GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving weight goals:', error);
    throw new Error('体重目標の保存に失敗しました');
  }
}

// ===== CRUD操作関数 =====

/**
 * 新しい体重記録を作成
 */
export function createWeightRecord(userId: string, formData: WeightFormData): WeightRecord {
  try {
    const records = getStoredWeightRecords();
    
    const newWeight: Weight = {
      id: generateId(),
      value: formData.value,
      unit: formData.unit,
      measuredAt: formData.measuredAt,
      note: formData.note
    };
    
    const newRecord: WeightRecord = {
      id: generateId(),
      userId,
      weight: newWeight,
      bmi: formData.bodyFatPercentage ? undefined : undefined, // BMI計算は身長が必要
      bodyFatPercentage: formData.bodyFatPercentage,
      muscleMass: formData.muscleMass,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    records.unshift(newRecord); // 新しい記録を先頭に追加
    saveWeightRecords(records);
    
    return newRecord;
  } catch (error) {
    console.error('Error creating weight record:', error);
    throw new Error('体重記録の作成に失敗しました');
  }
}

/**
 * 体重記録を取得（ページネーション対応）
 */
export function getWeightRecords(userId: string, page: number = 1, pageSize: number = 50): {
  records: WeightRecord[];
  totalCount: number;
  hasMore: boolean;
} {
  try {
    const allRecords = getStoredWeightRecords()
      .filter(record => record.userId === userId)
      .sort((a, b) => b.weight.measuredAt.getTime() - a.weight.measuredAt.getTime());
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const records = allRecords.slice(startIndex, endIndex);
    
    return {
      records,
      totalCount: allRecords.length,
      hasMore: endIndex < allRecords.length
    };
  } catch (error) {
    console.error('Error getting weight records:', error);
    throw new Error('体重記録の取得に失敗しました');
  }
}

/**
 * 特定の体重記録を取得
 */
export function getWeightRecord(recordId: string): WeightRecord | null {
  try {
    const records = getStoredWeightRecords();
    return records.find(record => record.id === recordId) || null;
  } catch (error) {
    console.error('Error getting weight record:', error);
    return null;
  }
}

/**
 * 体重記録を更新
 */
export function updateWeightRecord(recordId: string, formData: WeightFormData): WeightRecord {
  try {
    const records = getStoredWeightRecords();
    const recordIndex = records.findIndex(record => record.id === recordId);
    
    if (recordIndex === -1) {
      throw new Error('更新対象の体重記録が見つかりません');
    }
    
    const existingRecord = records[recordIndex];
    const updatedRecord: WeightRecord = {
      ...existingRecord,
      weight: {
        ...existingRecord.weight,
        value: formData.value,
        unit: formData.unit,
        measuredAt: formData.measuredAt,
        note: formData.note
      },
      bodyFatPercentage: formData.bodyFatPercentage,
      muscleMass: formData.muscleMass,
      updatedAt: new Date()
    };
    
    records[recordIndex] = updatedRecord;
    saveWeightRecords(records);
    
    return updatedRecord;
  } catch (error) {
    console.error('Error updating weight record:', error);
    throw new Error('体重記録の更新に失敗しました');
  }
}

/**
 * 体重記録を削除
 */
export function deleteWeightRecord(recordId: string): boolean {
  try {
    const records = getStoredWeightRecords();
    const filteredRecords = records.filter(record => record.id !== recordId);
    
    if (records.length === filteredRecords.length) {
      throw new Error('削除対象の体重記録が見つかりません');
    }
    
    saveWeightRecords(filteredRecords);
    return true;
  } catch (error) {
    console.error('Error deleting weight record:', error);
    throw new Error('体重記録の削除に失敗しました');
  }
}

// ===== 統計計算関数 =====

/**
 * 体重統計を計算
 */
export function calculateWeightStats(userId: string): WeightStats {
  try {
    const { records } = getWeightRecords(userId, 1, 1000); // 最新1000件を取得
    
    if (records.length === 0) {
      return {
        currentWeight: 0,
        previousWeight: 0,
        weightChange: 0,
        averageWeekly: 0,
        averageMonthly: 0,
        bmiCategory: 'normal'
      };
    }
    
    const currentWeight = records[0].weight.value;
    const previousWeight = records.length > 1 ? records[1].weight.value : currentWeight;
    const weightChange = currentWeight - previousWeight;
    
    // 週間平均（過去7日間）
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyRecords = records.filter(record => 
      record.weight.measuredAt >= oneWeekAgo
    );
    const averageWeekly = weeklyRecords.length > 0 
      ? parseFloat((weeklyRecords.reduce((sum, record) => sum + record.weight.value, 0) / weeklyRecords.length).toFixed(1))
      : currentWeight;
    
    // 月間平均（過去30日間）
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const monthlyRecords = records.filter(record => 
      record.weight.measuredAt >= oneMonthAgo
    );
    const averageMonthly = monthlyRecords.length > 0
      ? parseFloat((monthlyRecords.reduce((sum, record) => sum + record.weight.value, 0) / monthlyRecords.length).toFixed(1))
      : currentWeight;
    
    // BMIカテゴリ（身長データがないので仮の値170cmで計算）
    const bmi = calculateBMI(currentWeight, 170);
    const bmiCategory = getBMICategory(bmi);
    
    return {
      currentWeight,
      previousWeight,
      weightChange: parseFloat(weightChange.toFixed(1)),
      averageWeekly,
      averageMonthly,
      bmiCategory
    };
  } catch (error) {
    console.error('Error calculating weight stats:', error);
    throw new Error('体重統計の計算に失敗しました');
  }
}

// ===== 目標管理関数 =====

/**
 * 体重目標を作成
 */
export function createWeightGoal(userId: string, targetWeight: number, targetDate: Date): WeightGoal {
  try {
    const goals = getStoredWeightGoals();
    const { records } = getWeightRecords(userId, 1, 1);
    const currentWeight = records.length > 0 ? records[0].weight.value : 0;
    
    const newGoal: WeightGoal = {
      id: generateId(),
      userId,
      targetWeight,
      targetDate,
      currentWeight,
      isActive: true,
      createdAt: new Date()
    };
    
    // 既存のアクティブな目標を無効化
    const updatedGoals = goals.map(goal => 
      goal.userId === userId && goal.isActive 
        ? { ...goal, isActive: false }
        : goal
    );
    
    updatedGoals.push(newGoal);
    saveWeightGoals(updatedGoals);
    
    return newGoal;
  } catch (error) {
    console.error('Error creating weight goal:', error);
    throw new Error('体重目標の作成に失敗しました');
  }
}

/**
 * アクティブな体重目標を取得
 */
export function getActiveWeightGoal(userId: string): WeightGoal | null {
  try {
    const goals = getStoredWeightGoals();
    return goals.find(goal => goal.userId === userId && goal.isActive) || null;
  } catch (error) {
    console.error('Error getting active weight goal:', error);
    return null;
  }
}

/**
 * 体重目標を更新
 */
export function updateWeightGoal(goalId: string, targetWeight: number, targetDate: Date): WeightGoal {
  try {
    const goals = getStoredWeightGoals();
    const goalIndex = goals.findIndex(goal => goal.id === goalId);
    
    if (goalIndex === -1) {
      throw new Error('更新対象の体重目標が見つかりません');
    }
    
    const updatedGoal = {
      ...goals[goalIndex],
      targetWeight,
      targetDate
    };
    
    goals[goalIndex] = updatedGoal;
    saveWeightGoals(goals);
    
    return updatedGoal;
  } catch (error) {
    console.error('Error updating weight goal:', error);
    throw new Error('体重目標の更新に失敗しました');
  }
}

/**
 * 体重目標を削除
 */
export function deleteWeightGoal(goalId: string): boolean {
  try {
    const goals = getStoredWeightGoals();
    const filteredGoals = goals.filter(goal => goal.id !== goalId);
    
    if (goals.length === filteredGoals.length) {
      throw new Error('削除対象の体重目標が見つかりません');
    }
    
    saveWeightGoals(filteredGoals);
    return true;
  } catch (error) {
    console.error('Error deleting weight goal:', error);
    throw new Error('体重目標の削除に失敗しました');
  }
}