// 睡眠管理ドメインロジック
import { Sleep, SleepRecord, SleepGoal, SleepStats, SleepFormData } from '../types/app';

// ===== 定数定義 =====
const SLEEP_STORAGE_KEY = 'integrated_life_app_sleep_records';
const SLEEP_GOALS_STORAGE_KEY = 'integrated_life_app_sleep_goals';

// ===== ユーティリティ関数 =====

/**
 * 睡眠時間を計算（分単位）
 * @param bedTime 就寝時刻
 * @param wakeTime 起床時刻
 * @returns 睡眠時間（分）
 */
export function calculateSleepDuration(bedTime: Date, wakeTime: Date): number {
  let duration = wakeTime.getTime() - bedTime.getTime();
  
  // 日をまたいだ場合の調整
  if (duration < 0) {
    duration += 24 * 60 * 60 * 1000; // 24時間を加算
  }
  
  return Math.floor(duration / (1000 * 60)); // ミリ秒を分に変換
}

/**
 * 時間を分に変換
 * @param hours 時間
 * @param minutes 分
 * @returns 総分数
 */
export function convertToMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

/**
 * 分を時間:分形式に変換
 * @param totalMinutes 総分数
 * @returns HH:mm形式の文字列
 */
export function formatMinutesToHoursMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * 時刻をHH:mm形式で取得
 * @param date Date オブジェクト
 * @returns HH:mm形式の文字列
 */
export function formatTimeToHHMM(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * 睡眠の質の評価テキストを取得
 * @param quality 睡眠の質（1-5）
 * @returns 評価テキスト
 */
export function getSleepQualityText(quality: 1 | 2 | 3 | 4 | 5): string {
  const qualityTexts = {
    1: '悪い',
    2: 'やや悪い',
    3: '普通',
    4: '良い',
    5: 'とても良い'
  };
  return qualityTexts[quality];
}

/**
 * 睡眠時間の目安を判定
 * @param durationMinutes 睡眠時間（分）
 * @returns 睡眠時間の評価
 */
export function evaluateSleepDuration(durationMinutes: number): 'short' | 'optimal' | 'long' {
  const hours = durationMinutes / 60;
  if (hours < 6) return 'short';
  if (hours <= 9) return 'optimal';
  return 'long';
}

/**
 * 一意IDの生成
 */
function generateId(): string {
  return `sleep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ===== データ永続化関数 =====

/**
 * ローカルストレージから睡眠記録を取得
 */
function getStoredSleepRecords(): SleepRecord[] {
  try {
    const stored = localStorage.getItem(SLEEP_STORAGE_KEY);
    if (!stored) return [];
    
    const records = JSON.parse(stored);
    return records.map((record: any) => ({
      ...record,
      sleep: {
        ...record.sleep,
        bedTime: new Date(record.sleep.bedTime),
        wakeTime: new Date(record.sleep.wakeTime)
      },
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading sleep records:', error);
    return [];
  }
}

/**
 * ローカルストレージに睡眠記録を保存
 */
function saveSleepRecords(records: SleepRecord[]): void {
  try {
    localStorage.setItem(SLEEP_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving sleep records:', error);
    throw new Error('睡眠記録の保存に失敗しました');
  }
}

/**
 * ローカルストレージから睡眠目標を取得
 */
function getStoredSleepGoals(): SleepGoal[] {
  try {
    const stored = localStorage.getItem(SLEEP_GOALS_STORAGE_KEY);
    if (!stored) return [];
    
    const goals = JSON.parse(stored);
    return goals.map((goal: any) => ({
      ...goal,
      createdAt: new Date(goal.createdAt)
    }));
  } catch (error) {
    console.error('Error loading sleep goals:', error);
    return [];
  }
}

/**
 * ローカルストレージに睡眠目標を保存
 */
function saveSleepGoals(goals: SleepGoal[]): void {
  try {
    localStorage.setItem(SLEEP_GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving sleep goals:', error);
    throw new Error('睡眠目標の保存に失敗しました');
  }
}

// ===== CRUD操作関数 =====

/**
 * 新しい睡眠記録を作成
 */
export function createSleepRecord(userId: string, formData: SleepFormData): SleepRecord {
  try {
    const records = getStoredSleepRecords();
    
    const sleepDuration = calculateSleepDuration(formData.bedTime, formData.wakeTime);
    
    const newSleep: Sleep = {
      id: generateId(),
      bedTime: formData.bedTime,
      wakeTime: formData.wakeTime,
      sleepDuration,
      sleepQuality: formData.sleepQuality,
      note: formData.note
    };
    
    const newRecord: SleepRecord = {
      id: generateId(),
      userId,
      sleep: newSleep,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    records.unshift(newRecord); // 新しい記録を先頭に追加
    saveSleepRecords(records);
    
    return newRecord;
  } catch (error) {
    console.error('Error creating sleep record:', error);
    throw new Error('睡眠記録の作成に失敗しました');
  }
}

/**
 * 睡眠記録を取得（ページネーション対応）
 */
export function getSleepRecords(userId: string, page: number = 1, pageSize: number = 50): {
  records: SleepRecord[];
  totalCount: number;
  hasMore: boolean;
} {
  try {
    const allRecords = getStoredSleepRecords()
      .filter(record => record.userId === userId)
      .sort((a, b) => b.sleep.wakeTime.getTime() - a.sleep.wakeTime.getTime());
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const records = allRecords.slice(startIndex, endIndex);
    
    return {
      records,
      totalCount: allRecords.length,
      hasMore: endIndex < allRecords.length
    };
  } catch (error) {
    console.error('Error getting sleep records:', error);
    throw new Error('睡眠記録の取得に失敗しました');
  }
}

/**
 * 特定の睡眠記録を取得
 */
export function getSleepRecord(recordId: string): SleepRecord | null {
  try {
    const records = getStoredSleepRecords();
    return records.find(record => record.id === recordId) || null;
  } catch (error) {
    console.error('Error getting sleep record:', error);
    return null;
  }
}

/**
 * 睡眠記録を更新
 */
export function updateSleepRecord(recordId: string, formData: SleepFormData): SleepRecord {
  try {
    const records = getStoredSleepRecords();
    const recordIndex = records.findIndex(record => record.id === recordId);
    
    if (recordIndex === -1) {
      throw new Error('更新対象の睡眠記録が見つかりません');
    }
    
    const sleepDuration = calculateSleepDuration(formData.bedTime, formData.wakeTime);
    const existingRecord = records[recordIndex];
    
    const updatedRecord: SleepRecord = {
      ...existingRecord,
      sleep: {
        ...existingRecord.sleep,
        bedTime: formData.bedTime,
        wakeTime: formData.wakeTime,
        sleepDuration,
        sleepQuality: formData.sleepQuality,
        note: formData.note
      },
      updatedAt: new Date()
    };
    
    records[recordIndex] = updatedRecord;
    saveSleepRecords(records);
    
    return updatedRecord;
  } catch (error) {
    console.error('Error updating sleep record:', error);
    throw new Error('睡眠記録の更新に失敗しました');
  }
}

/**
 * 睡眠記録を削除
 */
export function deleteSleepRecord(recordId: string): boolean {
  try {
    const records = getStoredSleepRecords();
    const filteredRecords = records.filter(record => record.id !== recordId);
    
    if (records.length === filteredRecords.length) {
      throw new Error('削除対象の睡眠記録が見つかりません');
    }
    
    saveSleepRecords(filteredRecords);
    return true;
  } catch (error) {
    console.error('Error deleting sleep record:', error);
    throw new Error('睡眠記録の削除に失敗しました');
  }
}

// ===== 統計計算関数 =====

/**
 * 睡眠統計を計算
 */
export function calculateSleepStats(userId: string): SleepStats {
  try {
    const { records } = getSleepRecords(userId, 1, 1000); // 最新1000件を取得
    
    if (records.length === 0) {
      return {
        averageSleepDuration: 0,
        averageBedTime: '00:00',
        averageWakeTime: '00:00',
        averageSleepQuality: 0,
        sleepConsistency: 0,
        weeklyTrend: 'stable'
      };
    }
    
    // 平均睡眠時間
    const totalDuration = records.reduce((sum, record) => sum + record.sleep.sleepDuration, 0);
    const averageSleepDuration = Math.round(totalDuration / records.length);
    
    // 平均就寝時刻と起床時刻の計算
    const bedTimes = records.map(record => {
      const bedTime = record.sleep.bedTime;
      return bedTime.getHours() * 60 + bedTime.getMinutes();
    });
    
    const wakeTimes = records.map(record => {
      const wakeTime = record.sleep.wakeTime;
      return wakeTime.getHours() * 60 + wakeTime.getMinutes();
    });
    
    const avgBedTimeMinutes = Math.round(bedTimes.reduce((sum, time) => sum + time, 0) / bedTimes.length);
    const avgWakeTimeMinutes = Math.round(wakeTimes.reduce((sum, time) => sum + time, 0) / wakeTimes.length);
    
    const averageBedTime = formatMinutesToHoursMinutes(avgBedTimeMinutes);
    const averageWakeTime = formatMinutesToHoursMinutes(avgWakeTimeMinutes);
    
    // 平均睡眠の質
    const totalQuality = records.reduce((sum, record) => sum + record.sleep.sleepQuality, 0);
    const averageSleepQuality = parseFloat((totalQuality / records.length).toFixed(1));
    
    // 睡眠の一貫性（標準偏差ベース）
    const durationVariance = records.reduce((sum, record) => {
      const diff = record.sleep.sleepDuration - averageSleepDuration;
      return sum + (diff * diff);
    }, 0) / records.length;
    const durationStdDev = Math.sqrt(durationVariance);
    const sleepConsistency = Math.max(0, Math.min(100, 100 - (durationStdDev / 60) * 20)); // 標準偏差60分で20%減
    
    // 週間トレンド（直近7日と前の7日を比較）
    let weeklyTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (records.length >= 14) {
      const recent7Days = records.slice(0, 7);
      const previous7Days = records.slice(7, 14);
      
      const recentAvg = recent7Days.reduce((sum, record) => sum + record.sleep.sleepQuality, 0) / 7;
      const previousAvg = previous7Days.reduce((sum, record) => sum + record.sleep.sleepQuality, 0) / 7;
      
      const difference = recentAvg - previousAvg;
      if (difference > 0.3) weeklyTrend = 'improving';
      else if (difference < -0.3) weeklyTrend = 'declining';
    }
    
    return {
      averageSleepDuration,
      averageBedTime,
      averageWakeTime,
      averageSleepQuality,
      sleepConsistency: Math.round(sleepConsistency),
      weeklyTrend
    };
  } catch (error) {
    console.error('Error calculating sleep stats:', error);
    throw new Error('睡眠統計の計算に失敗しました');
  }
}

// ===== 目標管理関数 =====

/**
 * 睡眠目標を作成
 */
export function createSleepGoal(
  userId: string, 
  targetSleepDuration: number, 
  targetBedTime: string, 
  targetWakeTime: string
): SleepGoal {
  try {
    const goals = getStoredSleepGoals();
    
    const newGoal: SleepGoal = {
      id: generateId(),
      userId,
      targetSleepDuration,
      targetBedTime,
      targetWakeTime,
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
    saveSleepGoals(updatedGoals);
    
    return newGoal;
  } catch (error) {
    console.error('Error creating sleep goal:', error);
    throw new Error('睡眠目標の作成に失敗しました');
  }
}

/**
 * アクティブな睡眠目標を取得
 */
export function getActiveSleepGoal(userId: string): SleepGoal | null {
  try {
    const goals = getStoredSleepGoals();
    return goals.find(goal => goal.userId === userId && goal.isActive) || null;
  } catch (error) {
    console.error('Error getting active sleep goal:', error);
    return null;
  }
}

/**
 * 睡眠目標を更新
 */
export function updateSleepGoal(
  goalId: string, 
  targetSleepDuration: number, 
  targetBedTime: string, 
  targetWakeTime: string
): SleepGoal {
  try {
    const goals = getStoredSleepGoals();
    const goalIndex = goals.findIndex(goal => goal.id === goalId);
    
    if (goalIndex === -1) {
      throw new Error('更新対象の睡眠目標が見つかりません');
    }
    
    const updatedGoal = {
      ...goals[goalIndex],
      targetSleepDuration,
      targetBedTime,
      targetWakeTime
    };
    
    goals[goalIndex] = updatedGoal;
    saveSleepGoals(goals);
    
    return updatedGoal;
  } catch (error) {
    console.error('Error updating sleep goal:', error);
    throw new Error('睡眠目標の更新に失敗しました');
  }
}

/**
 * 睡眠目標を削除
 */
export function deleteSleepGoal(goalId: string): boolean {
  try {
    const goals = getStoredSleepGoals();
    const filteredGoals = goals.filter(goal => goal.id !== goalId);
    
    if (goals.length === filteredGoals.length) {
      throw new Error('削除対象の睡眠目標が見つかりません');
    }
    
    saveSleepGoals(filteredGoals);
    return true;
  } catch (error) {
    console.error('Error deleting sleep goal:', error);
    throw new Error('睡眠目標の削除に失敗しました');
  }
}

// ===== 睡眠分析関数 =====

/**
 * 日付範囲での睡眠記録を取得
 */
export function getSleepRecordsByDateRange(
  userId: string, 
  startDate: Date, 
  endDate: Date
): SleepRecord[] {
  try {
    const { records } = getSleepRecords(userId, 1, 1000);
    return records.filter(record => {
      const wakeDate = record.sleep.wakeTime;
      return wakeDate >= startDate && wakeDate <= endDate;
    });
  } catch (error) {
    console.error('Error getting sleep records by date range:', error);
    throw new Error('期間指定での睡眠記録取得に失敗しました');
  }
}