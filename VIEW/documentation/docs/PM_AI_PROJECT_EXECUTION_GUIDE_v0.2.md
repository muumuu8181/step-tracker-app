# 🎯 PM AI向け統合アプリ開発プロジェクト実行手順書 v0.2

## 📋 プロジェクト概要

**目標**: タブ切り替え式統合アプリの開発
- **機能**: 体重管理 / 睡眠管理 / ToDoリスト
- **アーキテクチャ**: v2テンプレートをフル活用
- **開発体制**: AI チーム（PM + 5サブエージェント）

---

## 🎖️ **PM AI（あなた）の責任と具体的作業**

### **あなたが必ず実行すること**
1. **ファイル・フォルダの存在確認** - Read/LS toolで実際に確認
2. **サブエージェント成果物の検証** - 指示した内容が正しく実装されているかチェック
3. **ワークヒストリー記録** - 全ての作業開始・完了時に記録
4. **品質ゲート判定** - 各フェーズで次に進むかの判断

### **サブエージェント指示の原則**
- **具体的なファイルパス指定**
- **参照すべきファイルの明示**
- **期待する成果物の詳細記述**
- **作業完了後の確認方法指示**

---

## 📁 **作業環境の事前確定** 

### **STEP 0: PM AI - 作業環境準備（必須）**

#### **0-1. 作業ディレクトリ決定**
```bash
# 今日の日付フォルダ確認
ls "C:\Users\user\Desktop\work\90_cc\20250820\"

# プロジェクト専用フォルダ作成
mkdir "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app"
cd "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app"
```

#### **0-2. v2テンプレートコピー**
```bash
# v2テンプレート元の確認
ls "C:\Users\user\Desktop\work\90_cc\20250817\0000-00-00-project-template"

# プロジェクトにコピー
cp -r "C:\Users\user\Desktop\work\90_cc\20250817\0000-00-00-project-template\*" "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\"
```

#### **0-3. v2テンプレート構造確認（PM AIが必ず実行）**
```bash
# 重要ディレクトリの存在確認
ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core"
ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\types"
ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src"

# パッケージファイル確認
cat "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\package.json"
```

#### **0-4. ワークヒストリー初期化**
```bash
cd "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [環境準備] [プロジェクト環境準備完了] [作業ディレクトリ・v2テンプレート準備完了]" > work_history.log
```

#### **0-5. PM AI確認チェックリスト**
- ✅ 作業ディレクトリ存在確認
- ✅ v2テンプレートファイル存在確認  
- ✅ core/types/ ディレクトリ存在確認
- ✅ app/web/src/ ディレクトリ存在確認
- ✅ package.json 内容確認
- ✅ ワークヒストリー初期化完了

**⚠️ 重要**: この確認完了まで次のフェーズに進んではいけません

---

## 👥 チーム構成と役割定義

### 🎖️ **PM AI（あなた）**
- **責任**: プロジェクト全体の進行管理・品質保証・最終判定
- **作業**: サブエージェントへの指示・進捗確認・課題解決・ワークヒストリー記録・**成果物の実際確認**

### 🏗️ **アーキテクト AI**
- **責任**: システム設計・技術選定・構造決定
- **作業**: ディレクトリ構成決定・型定義・アーキテクチャ設計・技術仕様書作成
- **成果物配置場所**: `core/types/`, `docs/`

### 🎨 **フロントエンド開発者 AI**
- **責任**: UI/UX実装・コンポーネント開発
- **作業**: React コンポーネント作成・スタイリング・タブ切り替え機能・レスポンシブ対応
- **成果物配置場所**: `app/web/src/components/`, `app/web/src/pages/`

### ⚙️ **バックエンド開発者 AI**
- **責任**: ビジネスロジック・データ処理・状態管理
- **作業**: ドメインロジック実装・ユースケース開発・データ永続化・API設計
- **成果物配置場所**: `core/domain/`, `core/usecases/`

### 🧪 **テスター AI**
- **責任**: テスト設計・実装・品質保証
- **作業**: 単体テスト・統合テスト・E2Eテスト・パフォーマンステスト
- **成果物配置場所**: `tests/unit/`, `tests/e2e/`

### 🔍 **レビューアー AI**
- **責任**: コード品質・セキュリティ・保守性チェック
- **作業**: コードレビュー・セキュリティ監査・パフォーマンス最適化・リファクタリング提案
- **成果物配置場所**: `docs/review/`

---

## 📝 ワークヒストリー記録ルール（強化版）

### **記録タイミング**
1. 各作業開始時
2. 各作業完了時
3. 問題発生時
4. マイルストーン達成時
5. **PM AI確認時**（重要追加）

### **記録フォーマット**
```
[日時] [担当AI] [作業種別] [作業内容] [結果/状況]
例: [2025-08-20 14:30:15] [アーキテクト AI] [設計] [型定義ファイル作成] [完了 - core/types/index.ts作成確認済み]
```

### **PM AI確認記録の例**
```bash
echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [確認] [アーキテクト AI成果物チェック] [core/types/index.ts存在・内容確認 - 3ドメイン型定義確認済み]" >> work_history.log
```

---

## 🚀 実行フェーズ

### **Phase 1: プロジェクト初期化（詳細版）** 

#### **Step 1-1: PM AI - アーキテクト AI 指示**
1. **作業開始記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [初期化] [アーキテクト AI 指示開始] [システム設計依頼]" >> work_history.log
   ```

2. **アーキテクト AI への具体的指示**
   ```
   【指示内容】
   以下のファイルを読み込んで、統合アプリの技術仕様を作成してください：
   
   参照ファイル:
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\types\index.ts
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\App.tsx
   
   作成ファイル:
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\types\app.ts
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\docs\technical-spec.md
   
   要件:
   1. 体重管理のインターフェース定義（Weight, WeightRecord型）
   2. 睡眠管理のインターフェース定義（Sleep, SleepRecord型）  
   3. ToDo管理のインターフェース定義（Todo, TodoFilter型）
   4. タブ管理のインターフェース定義（AppTab, AppState型）
   
   期限: 30分以内
   ```

#### **Step 1-2: PM AI - アーキテクト AI 成果物確認（必須）**
1. **成果物存在確認**
   ```bash
   # ファイル存在確認
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\types\app.ts"
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\docs\technical-spec.md"
   ```

2. **成果物内容確認**
   ```bash
   # 型定義内容確認
   cat "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\types\app.ts"
   
   # 技術仕様確認
   head -20 "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\docs\technical-spec.md"
   ```

3. **品質ゲート判定**
   - ✅ 4つのドメイン型が定義されているか
   - ✅ TypeScript型として正しく記述されているか
   - ✅ 技術仕様書が詳細に記述されているか

4. **確認完了記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [確認] [アーキテクト AI成果物確認完了] [型定義・技術仕様書確認済み - Phase2進行可能]" >> work_history.log
   ```

**⚠️ 重要**: 品質ゲートクリアまで次のフェーズに進んではいけません

---

### **Phase 2: コア実装（監督強化版）**

#### **Step 2-1: PM AI - バックエンド開発指示**
1. **指示開始記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [実装指示] [バックエンド開発者 AI指示開始] [ドメインロジック実装依頼]" >> work_history.log
   ```

2. **バックエンド開発者 AI への具体的指示**
   ```
   【指示内容】
   以下のファイルを参照して、ドメインロジックを実装してください：
   
   参照ファイル:
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\types\app.ts
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\docs\technical-spec.md
   
   作成ファイル:
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\domain\weight.ts
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\domain\sleep.ts
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\domain\todo.ts
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\usecases\appService.ts
   
   実装要件:
   1. 各ドメインのCRUD操作関数
   2. ビジネスロジック（BMI計算、睡眠時間計算、TodoFilter等）
   3. データ永続化（localStorage使用）
   4. エラーハンドリング
   
   期限: 2時間以内
   ```

#### **Step 2-2: PM AI - フロントエンド開発指示（並行）**
1. **指示開始記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [実装指示] [フロントエンド開発者 AI指示開始] [UI実装依頼]" >> work_history.log
   ```

2. **フロントエンド開発者 AI への具体的指示**
   ```
   【指示内容】
   以下のファイルを参照して、UIコンポーネントを実装してください：
   
   参照ファイル:
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\types\app.ts
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\App.tsx
   
   作成ファイル:
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\components\TabNavigation.tsx
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\components\WeightManager.tsx
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\components\SleepManager.tsx
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\components\TodoManager.tsx
   
   実装要件:
   1. タブ切り替え機能（3つのタブ）
   2. 各機能のUI（フォーム、リスト、グラフ）
   3. レスポンシブデザイン
   4. 基本的なスタイリング
   
   期限: 2時間以内
   ```

#### **Step 2-3: PM AI - 並行作業監督（1時間後確認）**
1. **中間確認記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [中間確認] [バックエンド・フロントエンド進捗確認] [中間チェック実施]" >> work_history.log
   ```

2. **バックエンド進捗確認**
   ```bash
   # ファイル作成状況確認
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\domain\"
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\usecases\"
   
   # 内容の概要確認
   head -10 "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\domain\weight.ts"
   ```

3. **フロントエンド進捗確認**
   ```bash
   # ファイル作成状況確認
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\components\"
   
   # 内容の概要確認
   head -10 "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\components\TabNavigation.tsx"
   ```

#### **Step 2-4: PM AI - 実装完了確認（必須品質ゲート）**
1. **全ファイル存在確認**
   ```bash
   # バックエンドファイル確認
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\domain\weight.ts"
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\domain\sleep.ts"
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\domain\todo.ts"
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\usecases\appService.ts"
   
   # フロントエンドファイル確認
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\components\TabNavigation.tsx"
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\components\WeightManager.tsx"
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\components\SleepManager.tsx"
   ls "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\components\TodoManager.tsx"
   ```

2. **内容品質確認**
   ```bash
   # TypeScriptエラーチェック
   cd "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app"
   npx tsc --noEmit
   
   # インポート・エクスポート確認
   grep -r "import.*@core" app/web/src/components/
   ```

3. **品質ゲート判定**
   - ✅ 全指定ファイルが存在するか
   - ✅ TypeScriptエラーがないか
   - ✅ 適切にインポート・エクスポートされているか
   - ✅ 基本的な機能が実装されているか

4. **完了記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [確認] [Phase2実装完了確認] [バックエンド・フロントエンド実装確認済み - Phase3進行可能]" >> work_history.log
   ```

---

### **Phase 3: 統合・動作確認（実動作重視）**

#### **Step 3-1: PM AI - 統合・動作確認**
1. **統合開始記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [統合] [アプリ統合・動作確認開始] [実際の動作テスト実施]" >> work_history.log
   ```

2. **依存関係インストール・ビルド確認**
   ```bash
   cd "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app"
   npm install
   npm run build
   ```

3. **開発サーバー起動テスト**
   ```bash
   # 開発サーバー起動（バックグラウンド）
   npm run dev &
   
   # 5秒待機後、ブラウザで確認指示
   echo "ブラウザでhttp://localhost:3000 を開いて動作確認してください"
   ```

4. **基本動作確認チェックリスト**
   - ✅ アプリが正常に表示されるか
   - ✅ 3つのタブが表示されるか
   - ✅ タブ切り替えが正常に動作するか
   - ✅ 各機能で基本的な操作ができるか
   - ✅ データが保存・読み込みされるか

#### **Step 3-2: PM AI - テスター AI 指示**
1. **テスト指示開始記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [テスト指示] [テスター AI指示開始] [包括的テスト実装依頼]" >> work_history.log
   ```

2. **テスター AI への具体的指示**
   ```
   【指示内容】
   動作確認済みのアプリに対して包括的テストを実装してください：
   
   参照ディレクトリ:
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\
   
   作成ファイル:
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\tests\unit\domain.test.ts
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\tests\e2e\basic.spec.ts
   
   テスト要件:
   1. ドメインロジックの単体テスト
   2. UIコンポーネントの統合テスト
   3. E2Eのユーザーシナリオテスト
   4. データ永続化テスト
   
   期限: 1時間以内
   ```

#### **Step 3-3: PM AI - テスト実行確認**
1. **テスト実行**
   ```bash
   cd "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app"
   npm test
   npm run test:e2e
   ```

2. **テスト結果確認**
   - ✅ 全単体テストが成功するか
   - ✅ E2Eテストが成功するか
   - ✅ カバレッジが十分か

3. **テスト完了記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [テスト確認] [テスト実行完了] [テスト結果: 成功/失敗 - Phase4進行判定]" >> work_history.log
   ```

---

### **Phase 4: 品質保証・最適化（実践的レビュー）**

#### **Step 4-1: PM AI - レビューアー AI 指示**
1. **レビュー指示記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [品質管理] [レビューアー AI指示開始] [最終品質監査依頼]" >> work_history.log
   ```

2. **レビューアー AI への具体的指示**
   ```
   【指示内容】
   動作確認・テスト済みのアプリの最終品質監査を実施してください：
   
   監査対象:
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\core\
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\app\web\src\
   
   作成ファイル:
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\docs\quality-report.md
   - C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\docs\improvement-plan.md
   
   監査項目:
   1. コード品質（可読性・保守性・拡張性）
   2. セキュリティ（XSS対策・データ検証）
   3. パフォーマンス（バンドルサイズ・レンダリング）
   4. アーキテクチャ（v2テンプレート活用度）
   
   期限: 45分以内
   ```

#### **Step 4-2: PM AI - 改善実装監督**
1. **品質レポート確認**
   ```bash
   cat "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\docs\quality-report.md"
   cat "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app\docs\improvement-plan.md"
   ```

2. **重要度高の問題修正指示**
   - 高優先度問題は即座に修正指示
   - 軽微な改善は将来計画に記録

3. **品質確認完了記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [品質確認] [最終品質監査完了] [品質基準達成確認 - 最終フェーズ進行可能]" >> work_history.log
   ```

---

### **Phase 5: 最終確認・デプロイ準備（実運用準備）**

#### **Step 5-1: PM AI - 最終統合確認**
1. **最終確認記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [最終確認] [プロダクション準備最終確認開始] [全機能最終テスト]" >> work_history.log
   ```

2. **最終動作確認**
   ```bash
   cd "C:\Users\user\Desktop\work\90_cc\20250820\integrated-life-app"
   
   # プロダクションビルド
   npm run build
   
   # ビルド成果物確認
   ls dist/
   
   # プレビューサーバー起動
   npm run preview
   ```

3. **最終確認チェックリスト**
   - ✅ プロダクションビルド成功
   - ✅ 全機能正常動作（タブ切り替え・データ保存）
   - ✅ モバイル・デスクトップ表示確認
   - ✅ パフォーマンス基準達成
   - ✅ 全テスト成功
   - ✅ 品質レポート基準クリア

#### **Step 5-2: PM AI - プロジェクト完了**
1. **最終成果確認記録**
   ```bash
   echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PM AI] [完了] [プロジェクト正常完了] [全要件達成・品質基準クリア・デプロイ準備完了]" >> work_history.log
   
   # 最終ワークヒストリー表示
   cat work_history.log
   ```

2. **成果物最終確認**
   ```bash
   # 全成果物の存在確認
   find . -name "*.ts" -o -name "*.tsx" -o -name "*.md" | head -20
   
   # プロジェクト構造確認
   tree -L 3
   ```

---

## 🔧 PM AI 運用ガイドライン（強化版）

### **監督の具体的方法**
1. **ファイル確認必須**: 指示後は必ずLS/Readで成果物確認
2. **内容検証必須**: ファイル存在だけでなく、内容も確認
3. **品質ゲート厳守**: 基準未達成なら次フェーズ進行禁止
4. **記録の徹底**: 全確認作業をワークヒストリーに記録

### **サブエージェント指示のベストプラクティス**
1. **具体的ファイルパス指定**: 曖昧な指示を避ける
2. **参照ファイル明示**: 既存ファイルを読み込ませる
3. **期待成果物詳細記述**: 何をどう作るかを具体的に
4. **期限明示**: 作業時間の目安を提示

### **問題発生時の対応**
1. **即座にワークヒストリー記録**: 問題内容・対応策を記録
2. **根本原因分析**: なぜ問題が発生したかを分析
3. **適切な修正指示**: 具体的な修正内容を指示
4. **再確認の徹底**: 修正後の品質確認を必ず実施

---

## 📊 品質基準・完了判定（強化版）

### **機能要件**
- ✅ 3つのタブ（体重・睡眠・ToDo）が正常に切り替わる
- ✅ 各機能でデータの追加・編集・削除が可能
- ✅ ブラウザ再読み込み後もデータが保持される
- ✅ モバイル・デスクトップで適切に表示される
- ✅ **実際にブラウザで動作確認済み**

### **技術要件**
- ✅ v2テンプレートのアーキテクチャを適切に活用
- ✅ 型安全性が担保されている（TypeScriptエラーなし）
- ✅ 単体・統合・E2Eテストが全て成功
- ✅ パフォーマンス基準（初期表示3秒以内）を満たす
- ✅ **npm run build が成功**

### **品質要件**
- ✅ コードレビューで重大な問題が発見されない
- ✅ セキュリティ監査で脆弱性が発見されない
- ✅ ユーザビリティテストで重大な問題が発見されない
- ✅ 保守性・拡張性が十分に確保されている
- ✅ **PM AIが全フェーズで実際確認済み**

### **ワークヒストリー要件**
- ✅ 全作業が時系列で記録されている
- ✅ 各担当AI、作業内容、結果が明記されている
- ✅ PM AI確認作業が全て記録されている
- ✅ 問題発生・解決過程が記録されている

---

## ⚠️ **PM AI へのクリティカルな注意事項**

### **絶対に守ること**
1. **成果物は必ず実際に確認** - 指示を出しただけで次に進まない
2. **品質ゲートは厳守** - 基準未達成なら次フェーズ進行禁止  
3. **ワークヒストリーは詳細記録** - 何をいつ誰が実施したか全記録
4. **動作確認は必須** - 実際にブラウザで動作することを確認

### **よくある失敗パターン**
- ❌ サブエージェントに指示を出しただけで次に進む
- ❌ ファイル存在確認なしに作業完了と判断  
- ❌ 動作確認なしにテストフェーズに進む
- ❌ エラー発生時の対応策検討なし

### **成功のポイント**
- ✅ 各フェーズで実際のファイル・動作を確認
- ✅ 問題発生時は立ち止まって原因分析・対策検討
- ✅ サブエージェントへの指示は具体的・詳細に
- ✅ 品質基準に妥協しない

---

**作成日**: 2025-08-20  
**バージョン**: v0.2  
**対象**: PM AI（統合アプリ開発プロジェクト）  
**想定期間**: 1日（8時間程度）  
**改善点**: 作業環境準備・監督方法具体化・品質ゲート強化・実動作確認重視