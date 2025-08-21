# 統合ライフ管理アプリ - 技術仕様書

## 概要

統合ライフ管理アプリは、体重管理、睡眠管理、ToDo管理を一つのアプリケーションで統合的に管理できるWebアプリケーションです。

## アーキテクチャ

### 全体構成
```
integrated-life-app/
├── core/              # コア機能・型定義
├── shared/            # 共有ユーティリティ
├── app/
│   ├── web/          # Webアプリケーション
│   ├── mobile/       # モバイルアプリ（将来対応）
│   └── desktop/      # デスクトップアプリ（将来対応）
└── docs/             # ドキュメント
```

### 技術スタック
- **フロントエンド**: React 18+ with TypeScript
- **状態管理**: React Hooks (useState, useContext)
- **スタイリング**: CSS-in-JS または Tailwind CSS
- **バックエンド**: Node.js + Express（将来実装）
- **データベース**: IndexedDB（ローカル）+ PostgreSQL（クラウド、将来実装）
- **バンドラー**: Vite

## 型定義仕様

### 1. 体重管理インターフェース

#### Weight型
```typescript
interface Weight {
  id: string;              // 一意識別子
  value: number;           // 体重値（kg単位）
  unit: 'kg' | 'lb';      // 単位
  measuredAt: Date;        // 測定日時
  note?: string;           // メモ（オプション）
}
```

#### WeightRecord型
```typescript
interface WeightRecord {
  id: string;                    // 記録ID
  userId: string;                // ユーザーID
  weight: Weight;                // 体重データ
  bmi?: number;                  // BMI値（オプション）
  bodyFatPercentage?: number;    // 体脂肪率（オプション）
  muscleMass?: number;           // 筋肉量（オプション）
  createdAt: Date;               // 作成日時
  updatedAt: Date;               // 更新日時
}
```

#### 関連型
- `WeightGoal`: 体重目標設定
- `WeightStats`: 体重統計データ
- `WeightFormData`: 体重入力フォーム用データ

### 2. 睡眠管理インターフェース

#### Sleep型
```typescript
interface Sleep {
  id: string;                    // 一意識別子
  bedTime: Date;                 // 就寝時刻
  wakeTime: Date;                // 起床時刻
  sleepDuration: number;         // 睡眠時間（分単位）
  sleepQuality: 1 | 2 | 3 | 4 | 5; // 睡眠品質（5段階評価）
  note?: string;                 // メモ（オプション）
}
```

#### SleepRecord型
```typescript
interface SleepRecord {
  id: string;               // 記録ID
  userId: string;           // ユーザーID
  sleep: Sleep;             // 睡眠データ
  deepSleep?: number;       // 深い睡眠時間（分）
  lightSleep?: number;      // 浅い睡眠時間（分）
  remSleep?: number;        // REM睡眠時間（分）
  awakeTime?: number;       // 覚醒時間（分）
  createdAt: Date;          // 作成日時
  updatedAt: Date;          // 更新日時
}
```

#### 関連型
- `SleepGoal`: 睡眠目標設定
- `SleepStats`: 睡眠統計データ
- `SleepFormData`: 睡眠入力フォーム用データ

### 3. ToDo管理インターフェース

#### Todo型
```typescript
interface Todo {
  id: string;                    // 一意識別子
  title: string;                 // タイトル
  description?: string;          // 詳細説明（オプション）
  priority: TodoPriority;        // 優先度
  status: TodoStatus;            // ステータス
  category: TodoCategory;        // カテゴリ
  dueDate?: Date;               // 期限（オプション）
  estimatedDuration?: number;    // 推定所要時間（分）
  tags: string[];               // タグ配列
  createdAt: Date;              // 作成日時
  updatedAt: Date;              // 更新日時
  completedAt?: Date;           // 完了日時（オプション）
}
```

#### TodoFilter型
```typescript
interface TodoFilter {
  status?: TodoStatus[];         // ステータスフィルター
  priority?: TodoPriority[];     // 優先度フィルター
  category?: TodoCategory[];     // カテゴリフィルター
  dateRange?: {                 // 日付範囲フィルター
    start: Date;
    end: Date;
  };
  tags?: string[];              // タグフィルター
  searchText?: string;          // テキスト検索
}
```

#### 関連型
- `TodoPriority`: 'low' | 'medium' | 'high' | 'urgent'
- `TodoStatus`: 'pending' | 'in_progress' | 'completed' | 'cancelled'
- `TodoCategory`: 'work' | 'personal' | 'health' | 'finance' | 'learning' | 'other'
- `TodoStats`: ToDo統計データ
- `TodoFormData`: ToDo入力フォーム用データ

### 4. タブ管理インターフェース

#### AppTab型
```typescript
type AppTab = 'weight' | 'sleep' | 'todo' | 'dashboard';
```

#### AppState型
```typescript
interface AppState {
  currentTab: AppTab;     // 現在のアクティブタブ
  isLoading: boolean;     // ローディング状態
  error: string | null;   // エラーメッセージ
}
```

## データフロー

### 1. 状態管理
- Reactの `useState` と `useContext` を使用
- 各機能（体重、睡眠、ToDo）は独立したコンテキストで管理
- グローバル状態（ユーザー情報、設定など）は共通コンテキストで管理

### 2. データ永続化
- **Phase 1**: ブラウザのIndexedDBを使用してローカルストレージ
- **Phase 2**: REST API経由でクラウドデータベースと同期

### 3. コンポーネント構成
```
App
├── Header (タブナビゲーション)
├── WeightModule
│   ├── WeightForm
│   ├── WeightChart
│   └── WeightStats
├── SleepModule
│   ├── SleepForm
│   ├── SleepChart
│   └── SleepStats
├── TodoModule
│   ├── TodoForm
│   ├── TodoList
│   ├── TodoFilter
│   └── TodoStats
└── Dashboard
    ├── OverviewCards
    ├── RecentActivities
    └── Insights
```

## API設計（将来実装）

### エンドポイント設計
```
GET    /api/weight/records      # 体重記録一覧取得
POST   /api/weight/records      # 体重記録作成
PUT    /api/weight/records/:id  # 体重記録更新
DELETE /api/weight/records/:id  # 体重記録削除

GET    /api/sleep/records       # 睡眠記録一覧取得
POST   /api/sleep/records       # 睡眠記録作成
PUT    /api/sleep/records/:id   # 睡眠記録更新
DELETE /api/sleep/records/:id   # 睡眠記録削除

GET    /api/todos               # ToDo一覧取得
POST   /api/todos               # ToDo作成
PUT    /api/todos/:id           # ToDo更新
DELETE /api/todos/:id           # ToDo削除

GET    /api/dashboard           # ダッシュボードデータ取得
GET    /api/users/profile       # ユーザープロフィール取得
PUT    /api/users/settings      # ユーザー設定更新
```

### レスポンス形式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: Date;
}
```

## セキュリティ要件

### データ保護
- ローカルデータの暗号化
- 機密情報のセキュアな保存
- データ漏洩防止対策

### プライバシー
- ユーザーデータの匿名化オプション
- データ削除権の実装
- 第三者との情報共有制御

## パフォーマンス要件

### 応答時間
- 画面切り替え: 200ms以内
- データ保存: 500ms以内
- グラフ描画: 1s以内

### メモリ使用量
- ブラウザメモリ使用量: 100MB以下
- ローカルストレージ: 50MB以下

## ユーザビリティ要件

### アクセシビリティ
- WCAG 2.1 AA準拠
- キーボードナビゲーション対応
- スクリーンリーダー対応

### レスポンシブデザイン
- モバイル対応（320px〜）
- タブレット対応（768px〜）
- デスクトップ対応（1024px〜）

## 開発ガイドライン

### コーディング規約
- TypeScript strict mode使用
- ESLint + Prettier設定
- 関数型プログラミングを優先
- テストカバレッジ80%以上

### ファイル命名規約
- コンポーネント: PascalCase (例: `WeightForm.tsx`)
- ユーティリティ: camelCase (例: `formatDate.ts`)
- 型定義: PascalCase (例: `Weight`, `TodoFilter`)
- 定数: UPPER_SNAKE_CASE (例: `API_BASE_URL`)

### Git規約
- ブランチ命名: `feature/機能名`, `fix/修正内容`
- コミットメッセージ: Conventional Commits形式
- プルリクエスト必須（コードレビュー実施）

## テスト戦略

### 単体テスト
- Jest + React Testing Library
- カスタムフック単体テスト
- ユーティリティ関数テスト

### 統合テスト
- コンポーネント間の連携テスト
- データフロー検証

### E2Eテスト
- Playwright使用
- 主要ユーザーフロー検証

## デプロイメント

### 開発環境
- Vite開発サーバー
- ホットリロード対応

### 本番環境
- Vercel または Netlify
- 自動デプロイ（CI/CD）
- パフォーマンスモニタリング

## 今後の拡張計画

### Phase 1（現在）
- 基本的な体重・睡眠・ToDo管理機能
- ローカルデータ保存

### Phase 2
- クラウド同期機能
- データエクスポート/インポート
- 詳細な統計・分析機能

### Phase 3
- モバイルアプリ化
- AI による インサイト生成
- 他のヘルスケアアプリとの連携

---

**作成日**: 2025-08-20  
**バージョン**: 1.0  
**更新者**: Architecture AI