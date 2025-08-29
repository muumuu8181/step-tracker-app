# 🚀 プロジェクト開始ガイド - 実用版

## 🎯 最重要: よく使うフォルダだけ覚えよう

**90%のファイルはここに入る:**
```
CREATE/          ← アプリのページ・UI
CHANGE/tools/    ← 便利スクリプト
VIEW/current-analysis/ ← 最新の分析・調査
PROTECT/         ← 触ると危険（基本触らない）
```

## ⚠️ 技術制約フォルダ（絶対に移動・削除禁止）

**これらは絶対に触らないでください:**
```
node_modules/     ← Node.js用ライブラリ（触ると全て壊れる）
package.json      ← プロジェクト設定ファイル
.eslintrc.cjs     ← コード品質設定
.gitignore        ← Git除外設定
.git/             ← Git履歴データ（開発用隠しフォルダ）
.github/          ← GitHub Actions設定（開発用隠しフォルダ）
```

**理由:** これらは開発環境・ビルドシステムの根幹部分です。移動や削除すると修復不可能な破損が発生します。

## ⚡ 3秒判断フロー（実用版）

```
新しいファイルができた？
↓
ユーザーが見る画面？ → YES → CREATE/
作業効率化ツール？   → YES → CHANGE/tools/
メモ・説明・資料？   → YES → VIEW/current-analysis/
わからない？        → YES → VIEW/current-analysis/ (安全)
```

## 📁 実際の配置例

| ファイル種類 | 具体例 | 置く場所 |
|-------------|--------|----------|
| HTMLページ | index.html | `CREATE/` |
| 設定ファイル | config.json | `CHANGE/configs/` |
| スクリプト | build.bat | `CHANGE/tools/` |
| 説明書 | README.md | `VIEW/current-analysis/` |
| メモ | memo.txt | `VIEW/current-analysis/` |

## 避けるべき深い階層

❌ **やめて:** `VIEW/reports/template-improvement-analysis/20250821-folder-naming-decision/`  
✅ **これで:** `VIEW/current-analysis/reports/`

**ルール: 5階層以内に収める**

## 迷った時の鉄則

1. **迷ったら** → `VIEW/current-analysis/` に入れる（安全）
2. **深い階層** → 作らない（2-3階層まで）
3. **複雑な名前** → シンプルに変える

## 設定ファイル早見表

- Claude Code設定: `CHANGE/configs/claude-code/`
- TypeScript設定: `CHANGE/configs/typescript/`
- 便利ツール: `CHANGE/tools/`

**質問・相談 → VIEW/current-analysis/ にメモファイル作ってください**

## 🚨 重要: ドキュメント変更ルール

**AI作業者向けルール（厳守）:**

### 変更・削除時の確認ルール
- **文章の修正・削除**: 必ず事前確認を求める
- **ファイル・フォルダの変更・削除**: 必ず事前確認を求める
- **追加のみ**: 確認不要（自由に追加可能）

### 階層作成ルール
- **1階層目・2階層目**: ファイル・フォルダ追加時は必ず確認を求める
- **3階層目以下**: 自由に作成可能
- **理由**: ルートフォルダ（作業フォルダトップ）を汚さないため