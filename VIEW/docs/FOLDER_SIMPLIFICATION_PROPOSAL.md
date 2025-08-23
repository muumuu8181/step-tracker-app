# フォルダ構造簡潔化提案

## 現在の問題

**深すぎる階層例:**
```
❌ VIEW/reports/template-improvement-analysis/20250821-folder-naming-decision/EVALUATION_agents-manager_20250821.md
❌ VIEW/documentation/docs/ai-conversations/20250810_180244_claude-code-opus_to_gpt_initial_assessment.md
❌ CHANGE/improvements/tests/unit/core/greeting.test.ts
```

## 🎯 簡潔化提案

### VIEW/ の整理
```
現在: VIEW/reports/template-improvement-analysis/20250821-folder-naming-decision/
提案: VIEW/reports/folder-analysis/

現在: VIEW/documentation/docs/ai-conversations/
提案: VIEW/docs/conversations/

現在: VIEW/docs/guides/FILE_CLASSIFICATION_FLOWCHART.md
提案: VIEW/guides/file-classification.md
```

### CHANGE/ の整理
```
現在: CHANGE/improvements/tests/unit/core/
提案: CHANGE/tests/unit/

現在: CHANGE/configs/typescript/tsconfig.base.json  
提案: CHANGE/configs/ts-config.json
```

## 📝 3階層ルール

**最大3階層まで:**
- ✅ `VIEW/docs/memo.md` (2階層)
- ✅ `CHANGE/tools/build.bat` (2階層)  
- ✅ `CREATE/pages/home.html` (2階層)
- ⚠️ `VIEW/docs/guides/advanced.md` (3階層 - 限界)
- ❌ `VIEW/reports/analysis/2024/summary.md` (4階層 - NG)

## 🚀 移行計画

### Phase 1: 緊急整理
1. 深い階層ファイルを浅い場所に移動
2. 長いフォルダ名を短縮
3. 重複フォルダを統合

### Phase 2: 新規ファイル防止  
1. 3階層チェック機能追加
2. ファイル作成時警告
3. 自動提案機能

## 💡 実用的なフォルダ名

**長い名前 → 短い名前:**
- `template-improvement-analysis` → `analysis`
- `20250821-folder-naming-decision` → `folder-decision`
- `ai-conversations` → `conversations`
- `claude-code-opus_to_gpt` → `claude-gpt`

**日付フォルダ廃止:**
- ❌ `20250821-project/`
- ✅ ファイル名に日付: `project-20250821.md`