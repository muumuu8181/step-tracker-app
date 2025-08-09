# 🤖 RPAツール開発のためのテンプレート活用ガイド

## 📌 テンプレート概要と活用方針

このテンプレート（0000-00-00-project-template）は、Firebase認証とリアルタイムデータベースが組み込まれた汎用アプリテンプレートです。
RPAツール開発において、以下の方針で活用することで効率的な開発が可能です。

## 🎯 RPAツールへの転用戦略

### 1. 既存機能の活用（流用率: 約65%）

#### ✅ そのまま使える機能
- **Firebase認証システム**: ユーザー管理とアクセス制御
- **リアルタイムデータベース**: タスク状態の同期と履歴管理
- **レスポンシブUI基盤**: デバイス間での操作性確保
- **データストレージ機能**: タスク結果の保存と出力
- **エラーハンドリング**: 安定した実行環境

#### 🔄 カスタマイズが必要な部分
- 入力フォーム → タスク定義インターフェース
- タイミングボタン → タスク実行トリガー
- 履歴表示 → 実行ログビューア

### 2. Core/Custom分離の活用方法

```
RPA-Tool/
├── core/                      # 🚫 変更禁止（安定性確保）
│   ├── firebase-config.js     # 認証・DB接続
│   ├── error-collector.js     # エラー処理
│   └── universal-system/      # 基盤システム
├── custom/                    # ✅ RPA固有カスタマイズ
│   ├── rpa-config.js         # RPAタスク設定
│   ├── task-definitions.js   # タスク定義
│   └── rpa-styles.css        # RPA用UI
└── tools/                     # 🔧 RPA機能拡張
    ├── automation/           # 新規追加
    │   ├── task-executor.js  # タスク実行エンジン
    │   ├── scheduler.js      # スケジューラー
    │   └── api-connector.js  # 外部API連携
    └── data-storage/         # 既存活用
```

## 🚀 段階的開発アプローチ

### Phase 1: MVP（最小実装）- 1週間
1. **基本UI構築**
   - index.htmlの体重管理部分をタスク管理UIに変更
   - タスク定義フォーム作成
   - 実行ボタンとステータス表示

2. **簡単なタスク実装**
   - URLオープン
   - アラート表示
   - ローカルファイル操作

3. **実行ログ機能**
   - Firebaseにタスク実行履歴を保存
   - リアルタイム更新表示

### Phase 2: 基本機能実装 - 2週間
1. **タスクビルダー**
   - ドラッグ&ドロップでタスク作成
   - 条件分岐とループ処理

2. **スケジューラー**
   - 定期実行設定
   - Firebase Functionsとの連携

3. **エラーハンドリング強化**
   - リトライ機能
   - エラー通知

### Phase 3: 拡張機能 - 3週間
1. **外部連携**
   - Web API連携
   - Webhooks対応
   - ブラウザ拡張機能

2. **高度な機能**
   - OCR機能
   - AI判定機能
   - マクロレコーダー

## 💡 実装のベストプラクティス

### 1. Firebase活用パターン

```javascript
// タスク定義の保存
const taskDefinition = {
    id: generateId(),
    name: 'データ収集タスク',
    steps: [
        { type: 'navigate', url: 'https://example.com' },
        { type: 'extract', selector: '.data-class' },
        { type: 'save', format: 'csv' }
    ],
    schedule: 'daily',
    lastRun: null,
    status: 'active'
};

// Firebaseに保存（既存の構造を活用）
firebase.database().ref(`users/${userId}/tasks/${taskDefinition.id}`)
    .set(taskDefinition);
```

### 2. UI実装例

```html
<!-- index.htmlの改修例 -->
<div class="task-builder">
    <h3>🤖 RPAタスク作成</h3>
    <div class="task-steps">
        <!-- ドラッグ可能なステップ -->
        <div class="step-item" draggable="true">
            <span>🌐 URLを開く</span>
            <input type="url" placeholder="https://...">
        </div>
        <div class="step-item" draggable="true">
            <span>📝 データ抽出</span>
            <input type="text" placeholder="CSSセレクタ">
        </div>
    </div>
    <button onclick="saveTask()">タスクを保存</button>
</div>
```

### 3. カスタム設定の実装

```javascript
// custom/rpa-config.js
export const RPA_CONFIG = {
    appName: 'シンプルRPAツール',
    version: '1.0.0',
    
    // タスクタイプ定義
    taskTypes: {
        web: { icon: '🌐', label: 'Web操作' },
        file: { icon: '📁', label: 'ファイル操作' },
        api: { icon: '🔌', label: 'API連携' },
        data: { icon: '📊', label: 'データ処理' }
    },
    
    // 実行設定
    execution: {
        maxRetries: 3,
        timeout: 30000,
        logLevel: 'info'
    }
};
```

## 📋 開発チェックリスト

### 初期セットアップ
- [ ] テンプレートをコピーして新規プロジェクト作成
- [ ] .gitフォルダを削除して新規Git初期化
- [ ] プロジェクト名をRPAツール名に変更
- [ ] README.mdを更新

### UI改修
- [ ] index.htmlの体重管理部分を削除
- [ ] タスク管理UIに置き換え
- [ ] RPAツール用のスタイル適用
- [ ] アイコンとテーマカラー変更

### 機能実装
- [ ] タスク実行エンジン作成
- [ ] Firebase連携の調整
- [ ] スケジューラー実装
- [ ] ログビューア作成

### テスト・デプロイ
- [ ] ローカルテスト実施
- [ ] Firebase設定確認
- [ ] GitHub Pagesデプロイ
- [ ] 動作確認とバグ修正

## 🎨 カスタマイズ例

### タスク実行画面のイメージ
```
┌─────────────────────────────────┐
│ 🤖 シンプルRPAツール            │
├─────────────────────────────────┤
│ ▶ 実行中のタスク               │
│ ├─ データ収集 [■■■□□] 60%    │
│ └─ レポート生成 [待機中]       │
│                                 │
│ 📋 タスク一覧                  │
│ ├─ 毎日実行: 売上データ収集    │
│ ├─ 週次: レポート自動生成      │
│ └─ 月次: バックアップ処理      │
│                                 │
│ [新規タスク作成] [スケジュール] │
└─────────────────────────────────┘
```

## 🔧 トラブルシューティング

### よくある問題と解決方法

1. **Firebase認証エラー**
   - Googleログインのポップアップブロックを解除
   - HTTPSまたはlocalhostで実行

2. **タスク実行エラー**
   - ブラウザのCORS設定を確認
   - 必要に応じてプロキシサーバー設定

3. **データ保存失敗**
   - Firebase Databaseルールを確認
   - ユーザー認証状態を確認

## 📚 参考リソース

- [Firebase公式ドキュメント](https://firebase.google.com/docs)
- [GitHub Pages設定ガイド](./GITHUB_PAGES_MANUAL.md)
- [テンプレート使用方法](./HOW_TO_USE_TEMPLATE.md)

## 🚀 開発開始コマンド

```bash
# プロジェクトセットアップ
cd /mnt/c/Users/user/Desktop/work/90_cc/20250809
cp -r 0000-00-00-project-template simple-rpa-tool
cd simple-rpa-tool
rm -rf .git
git init

# 開発サーバー起動
python -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

---

**このガイドに従って開発を進めることで、既存テンプレートの利点を最大限活用しながら、効率的にRPAツールを構築できます。**