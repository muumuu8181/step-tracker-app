# 🚀 プロジェクト開始ガイド - 実用版

## 🎯 最重要: よく使うフォルダだけ覚えよう

**90%のファイルはここに入る:**
```
🆕 CREATE/          ← アプリのページ・UI
🔧 CHANGE/tools/    ← 便利スクリプト
👀 VIEW/docs/       ← メモ・説明書
🔒 PROTECT/         ← 触ると危険（基本触らない）
```

## ⚡ 3秒判断フロー（実用版）

```
新しいファイルができた？
↓
❓ ユーザーが見る画面？ → YES → 🆕 CREATE/
❓ 作業効率化ツール？   → YES → 🔧 CHANGE/tools/
❓ メモ・説明・資料？   → YES → 👀 VIEW/docs/
❓ わからない？        → YES → 👀 VIEW/docs/ (安全)
```

## 📁 実際の配置例

| ファイル種類 | 具体例 | 置く場所 |
|-------------|--------|----------|
| HTMLページ | index.html | `CREATE/` |
| 設定ファイル | config.json | `CHANGE/configs/` |
| スクリプト | build.bat | `CHANGE/tools/` |
| 説明書 | README.md | `VIEW/docs/` |
| メモ | memo.txt | `VIEW/docs/` |

## 🚨 避けるべき深い階層

❌ **やめて:** `VIEW/reports/template-improvement-analysis/20250821-folder-naming-decision/`  
✅ **これで:** `VIEW/docs/analysis-reports/`

**ルール: 3階層以内に収める**

## 💡 迷った時の鉄則

1. **迷ったら** → `VIEW/docs/` に入れる（安全）
2. **深い階層** → 作らない（2-3階層まで）
3. **複雑な名前** → シンプルに変える

## 🔧 設定ファイル早見表

- Claude Code設定: `CHANGE/configs/claude-code/`
- TypeScript設定: `CHANGE/configs/typescript/`
- 便利ツール: `CHANGE/tools/`

**質問・相談 → 👀 VIEW/docs/ にメモファイル作ってください**