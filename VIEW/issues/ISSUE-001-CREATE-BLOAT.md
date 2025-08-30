# ISSUE-001: CREATE フォルダ肥大化問題

**作成日**: 2025-08-30  
**優先度**: High  
**ステータス**: Open

## 📋 問題の概要

CREATE フォルダ（新人が触ってOKの領域）に1598行の巨大なHTMLファイルが配置されており、テンプレートとしての設計思想に反している。

## 🚨 具体的な問題

### ファイル構成の問題
- `CREATE/web/app/index.html`: **1598行** ← 巨大すぎる
- `CREATE/app/web/index.html`: **11行** ← 不完全なReact構成（不要）

### 設計思想との乖離
- **理想**: CREATE = 30行以内のシンプルなテンプレート
- **現実**: 1598行の全部入りファイル
- **影響**: 新人が触るには複雑すぎる、事故の原因となる

## 🎯 解決方針

### Phase 1: 不要ファイル削除
- [ ] `CREATE/app/web/` フォルダ全体削除（React構成は不要）

### Phase 2: アーキテクチャ分離
- [ ] 1598行のHTMLファイルを分割
  - [ ] ロジック → `PROTECT/core-system/` に移動
  - [ ] Firebase設定 → `CHANGE/configs/` に移動  
  - [ ] デバッグツール → `PROTECT/` に移動
  - [ ] CSS → 外部ファイルに分離

### Phase 3: CREATE最適化
- [ ] CREATE/index.html を30行以内のシンプル構成に
- [ ] 基本機能は動作するが拡張可能な構造
- [ ] 新人が理解しやすいテンプレート形式

## 📊 期待される成果

**修正前:**
- CREATE/web/app/index.html: 1598行（危険）
- 新人には複雑すぎる

**修正後:**
- CREATE/index.html: ~30行（安全）
- ロジックは適切に分離
- テンプレートとして理想的

## ⚠️ リスク管理

- **段階的実施**: 一気に分割せず、動作確認しながら進める
- **バックアップ**: 各段階でGitコミット
- **動作確認**: Firebase認証・基本機能が維持されること

## 🔗 関連ファイル

- `CREATE/web/app/index.html` (1598行 - 要分割)
- `CREATE/app/web/index.html` (11行 - 要削除)  
- `PROTECT/core-system/` (分離先)
- `CHANGE/configs/` (設定移動先)