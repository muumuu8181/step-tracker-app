# 📁 **フォルダ構造大整理提案**

## 🚨 **現状の問題**

### **現在の散らかった状態**
```
現在/
├── 24個のルートファイル (散らかってる)
├── core/ (分かりにくい)
├── shared/ (分かりにくい) 
├── tools/ (分かりにくい)
├── docs/ (55個のファイル散在)
├── tests/ (構造不明)
├── template-improvement-analysis/ (設計書)
└── [V2設計で必須の app/, config/, public/ が不足]
```

## 🎯 **提案：超分かりやすい構造**

### **案1: 開発可否が一瞬で分かる名前**
```
template/
├── 📝 START-HERE.md
├── 
├── ✅ YOUR-APP-HERE/              # ←開発者はここだけ触る
│   ├── components/               # UIコンポーネント
│   ├── pages/                    # ページファイル
│   ├── features/                 # 新機能
│   └── styles/                   # スタイル
├── 
├── ✅ ASSETS/                     # ←画像・アイコン等
│   ├── images/
│   ├── icons/
│   └── data/
├── 
├── ⚠️ SYSTEM-CORE/               # ←システム中枢（注意）
│   ├── business-logic/           # ビジネスロジック
│   ├── database/                 # DB関連
│   └── types/                    # 型定義
├── 
├── ⚠️ SHARED-UTILS/              # ←共通機能（注意）
│   ├── utils/                    # ユーティリティ
│   ├── constants/                # 定数
│   └── helpers/                  # ヘルパー
├── 
├── 🚫 DO-NOT-TOUCH/              # ←触るな危険
│   ├── dev-tools/                # 開発ツール
│   ├── system-tests/             # システムテスト
│   ├── build-scripts/            # ビルドスクリプト
│   ├── internal-docs/            # 内部ドキュメント
│   └── template-analysis/        # 設計書
└── 
└── [設定ファイル群は適切に配置]
```

### **案2: 日本語併記版**
```
template/
├── 📝 README-まず読んで.md
├── 
├── ✅ DEVELOP-開発はここ/
├── ✅ ASSETS-素材/
├── ⚠️ SYSTEM-システム注意/
├── ⚠️ SHARED-共通注意/
├── 🚫 DANGER-危険触るな/
```

### **案3: V2設計準拠+分かりやすい名前**
```
template/
├── app-development/              # V2の app/
├── static-assets/                # V2の public/
├── system-config/                # V2の config/
├── business-core/                # V2の core/
├── shared-common/                # V2の shared/
├── system-tools/                 # V2の tools/
├── quality-tests/                # V2の tests/
├── project-docs/                 # V2の docs/
```

## 📊 **比較表**

| 項目 | 案1: 開発可否明示 | 案2: 日本語併記 | 案3: V2準拠+明確 |
|------|-----------------|---------------|----------------|
| **分かりやすさ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **開発可否明確性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **V2設計整合性** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **国際化対応** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |

## 🚀 **推奨アクション**

### **Step 1: 方針決定**
どの案でいくか決める

### **Step 2: 段階的移行**
1. 新しいフォルダ構造作成
2. 既存ファイルを適切な場所に移動
3. import/export パスを更新
4. README更新

### **Step 3: 検証**
- ビルドが通るか確認
- 機能が動作するか確認
- ドキュメントが正しいか確認

## 💭 **ディスカッション項目**

1. **どの案がお好み？**
2. **他のアイデアは？**
3. **移行時期は？**
4. **バックアップは必要？**

---
**作成日**: 2025-08-21  
**目的**: フォルダ構造の大整理  
**ステータス**: 提案・検討中