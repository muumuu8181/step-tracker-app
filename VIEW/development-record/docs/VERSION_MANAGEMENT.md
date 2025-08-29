# 📊 一元化バージョン管理システム

## 🎯 概要

このテンプレートでは、**一箇所変更すれば全体に反映される**バージョン管理システムを採用しています。

## 📁 管理ファイル

### **version.json** (マスターファイル)
```json
{
  "template": {
    "version": "0.41",
    "name": "Universal App Template",
    "description": "よっぽどの馬鹿でも使える万能アプリテンプレート"
  }
}
```

## 🔧 使用方法

### **バージョン更新手順**
1. `version.json` の `template.version` を編集
2. 自動更新スクリプトを実行:
   ```bash
   npm run version:update
   ```

### **自動更新される箇所**
- ✅ `package.json` の `version`
- ✅ `project-settings.json` の `project.version` 
- ✅ `index.html` のタイトル表示
- ✅ 各設定ファイルの説明文

## 📋 バージョンルール

### **0.01ずつ増加**
- `0.4` → `0.41` → `0.42` → `0.43` ...
- 小さな変更でも必ず0.01増加

### **変更すべきもの vs 変更不要なもの**

| 項目 | 変更要否 | 理由 |
|------|---------|------|
| `version.json` | ✅ **必須** | マスター管理ファイル |
| `package.json` | ❌ **自動** | スクリプトが更新 |
| `project-settings.json` | ❌ **自動** | スクリプトが更新 |
| `index.html` | ❌ **自動** | スクリプトが更新 |
| ドキュメント内の例示 | ❌ **不要** | 参考例なのでそのまま |

## 🛠️ 管理スクリプト

### **version:update**
```bash
npm run version:update
```
- `version.json` を読み込み
- 全ての関連ファイルを一括更新

### **cleanup:paint**
```bash
npm run cleanup:paint
```
- ペイント関連の残骸を除去
- 汎用的なテンプレートに変換

## ✅ 整理完了項目

### **バージョン統一**
- ❌ **Before**: 複数箇所にバラバラなバージョン
- ✅ **After**: `version.json` 一箇所管理

### **ペイント残骸除去**
- ❌ **Before**: `Awesome Paint Studio` 固有要素
- ✅ **After**: `Universal App Template` 汎用要素

### **命名統一**
- ❌ **Before**: `brush`, `paint`, `canvas` 等
- ✅ **After**: `tool`, `app`, `canvas` 等

## 🎉 メリット

1. **一箇所変更で全体更新** - バージョン管理が簡単
2. **ヒューマンエラー防止** - 更新し忘れがない
3. **汎用性確保** - どんなアプリにも適用可能
4. **保守性向上** - 構造が明確で管理しやすい

---

**更新日**: 2025-08-21  
**バージョン**: v0.41  
**管理方式**: 一元化システム