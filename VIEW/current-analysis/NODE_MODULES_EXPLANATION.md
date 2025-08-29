# node_modules フォルダがルート直下にある理由

## 🚨 重要：このフォルダは移動不可

`node_modules` フォルダはルート直下に配置されることが **技術的に必須** です。

## 📋 検証済み理由

### 1. 開発者の常識・慣例
- npm/yarn/pnpm等の標準的な配置場所
- 全世界のNode.jsプロジェクトで共通の慣例
- 開発者が迷わない標準的な場所

### 2. npm/yarn/pnpm等の標準動作
```bash
# これらのコマンドはルート直下のnode_modulesを前提とする
npm install
npm run lint
npm run build
yarn install
pnpm install
```

### 3. IDE（VS Code等）の自動認識
- TypeScript言語サーバーの自動認識
- インポート補完機能
- 依存関係の解析
- デバッグ機能

### 4. package.jsonスクリプトの実行環境
- `npm run` コマンドの実行時パス解決
- `.bin` フォルダ内の実行ファイル参照
- 依存関係の自動解決

## 🔬 実際の検証結果

**テスト実施日時:** 2025-08-29  
**検証方法:** `node_modules` を `_node_modules` にリネームしてテスト

### 失敗したコマンド例
```bash
$ npm ls --depth=0
npm error missing: @playwright/test@^1.54.2, required by universal-template-system@0.41
# ... (全18個の依存関係でUNMET DEPENDENCYエラー)

$ npm run lint
sh: 1: eslint: not found
```

## ❓ フォルダ名の一貫性について

### 現在の構造
```
├── VIEW/        (大文字・カテゴリ)
├── CHANGE/      (大文字・カテゴリ)  
├── CREATE/      (大文字・カテゴリ)
├── PROTECT/     (大文字・カテゴリ)
└── node_modules (小文字・技術制約) ← これだけ異色
```

### なぜ統一できないか
- `node_modules` は **Node.js生態系の標準仕様**
- リネームは技術的に不可能
- この名前でなければ機能しない

### リネーム不可能性の詳細調査

#### npm での制限
- **npm公式回答**: フォルダ名変更機能は提供されていない
- **Node.js Core統合**: モジュール解決システムがハードコード
- **歴史的経緯**: 10年以上この仕様で固定

#### 代替案検討結果
```
❌ NODE_MODULES    → Node.jsが認識しない
❌ DEPENDENCIES    → npmが作成しない  
❌ LIBRARIES       → 同上
❌ MODULES         → 同上
```

#### 他パッケージマネージャでの可能性
- **Yarn**: `--modules-folder` でカスタム可能（但し全体移行が必要）
- **pnpm**: 独自ストア方式（但し全体移行が必要）

## 💡 結論

`node_modules` フォルダは：
- ✅ ルート直下配置が **必須**
- ✅ 小文字名前が **必須** 
- ✅ 移動・リネーム **不可**
- ✅ テンプレートの他フォルダとは **性質が根本的に異なる**

**これは設計ミスではなく、Node.js技術制約による例外です。**

---

*この文書は node_modules の配置について混乱を防ぐために作成されました。*
*最終更新: 2025-08-29*