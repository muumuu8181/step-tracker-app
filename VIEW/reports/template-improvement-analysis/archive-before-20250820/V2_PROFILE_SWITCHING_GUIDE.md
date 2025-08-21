# 🔄 **v2案プロファイル切り替えガイド**

## 🎯 **プロファイル切り替えの簡単さ**

v2案の最大の魅力は**いつでも安全にプロファイル切り替えが可能**なことです。

---

## ⚡ **切り替えコマンド（1行で完了）**

```bash
# 現在：minimal → 変更：edge
npm run init:profile -- edge
```

**これだけ！** 必要なフォルダが自動追加され、既存資産は保護されます。

---

## 🛡️ **なぜ事故が起きないのか？**

### **1. 追加型の変更**
```
変更前: core/, app/web/, shared/, tests/, tools/
変更後: core/, app/web/, shared/, tests/, tools/, functions/ ← 追加のみ
```

### **2. 核心資産の保護**
- **core/**: ビジネスロジック（どのプロファイルでも共通）
- **shared/**: 共通ユーティリティ（プロファイル非依存）
- **tests/**: テストコード（資産として蓄積）

### **3. 自動境界監視**
```javascript
// dependency-cruiser が依存関係違反を自動検知
{ name: 'no-core-to-app', from: { path: '^core' }, to: { path: '^app' } }
```

---

## 📋 **実際の切り替えパターン**

### **パターン1: minimal → ssr**
```bash
npm run init:profile -- ssr
```
**変更内容**:
- ✅ 既存フォルダ: そのまま保持
- ✅ app/web/: Next/Nuxtプロジェクトに置換（手動）
- ❌ 削除: なし

**用途**: SPA → SSR移行時

### **パターン2: minimal → edge**
```bash
npm run init:profile -- edge
```
**変更内容**:
- ✅ 追加: functions/ （Serverless用）
- ✅ 既存: core/, shared/, tests/は保持
- ⚠️ app/web/: 不要になる可能性（手動判断）

**用途**: SPA → Serverless移行時

### **パターン3: ssr → edge**
```bash
npm run init:profile -- edge
```
**変更内容**:
- ✅ 追加: functions/
- ✅ 既存: すべて保持
- 💡 SSRとServerlessの共存も可能

**用途**: SSR + API部分のみServerless化

### **パターン4: any → lib**
```bash
npm run init:profile -- lib
```
**変更内容**:
- ✅ 保持: core/, shared/, tests/, tools/
- ⚠️ app/*: ライブラリなら不要（手動判断）

**用途**: アプリ → ライブラリ/CLI化

---

## 🚀 **段階的成長の例**

### **典型的な成長パターン**
```
Phase 1: minimal
├── core/ (ビジネスロジック構築)
├── app/web/ (SPA作成)
├── shared/ (ユーティリティ蓄積)
└── tests/ (テスト資産蓄積)

↓ BFFが必要になった

Phase 2: minimal + app/server/
├── core/ (既存資産保持)
├── app/web/ (既存SPA保持)
├── app/server/ (BFF追加)
├── shared/ (既存ユーティリティ活用)
└── tests/ (既存テスト保持)

↓ Serverless化が必要になった

Phase 3: edge
├── core/ (既存ビジネスロジック活用)
├── functions/ (Serverless関数)
├── shared/ (既存ユーティリティ活用)
└── tests/ (既存テスト資産活用)
```

---

## 💡 **切り替え時のベストプラクティス**

### **事前確認**
1. **現在のプロファイル確認**: `package.json`の依存関係確認
2. **バックアップ**: `git commit`で現状保存
3. **テスト実行**: `npm test`で既存機能確認

### **切り替え実行**
```bash
# 1. 現状保存
git add . && git commit -m "Before profile switch"

# 2. プロファイル切り替え
npm run init:profile -- [新しいプロファイル]

# 3. 依存関係更新
npm install

# 4. テスト確認
npm test
```

### **事後確認**
1. **未使用検知**: `npm run check:unused`
2. **境界違反確認**: dependency-cruiserでチェック
3. **動作確認**: 主要機能のスモークテスト

---

## ⚠️ **唯一の注意点**

### **UI層の置き換えが発生する場合**
```
minimal (app/web/) → edge (functions/)
```

この場合のみ、**UIアーキテクチャの変更**が必要です。

**対処法**:
- **core/**: ビジネスロジックは100%再利用可能
- **shared/**: ユーティリティも100%再利用可能
- **app/web/**: 必要に応じて保持（ハイブリッド構成も可能）

---

## 🎯 **まとめ**

v2案のプロファイル切り替えは：

1. **1コマンドで完了**: `npm run init:profile -- [profile]`
2. **既存資産保護**: core/shared/tests/は常に保持
3. **段階的成長**: 必要な時に必要な機能を追加
4. **リスク最小**: 追加型変更で事故防止
5. **柔軟性最大**: いつでも方向転換可能

**「最初の選択に縛られない自由度」**こそが、v2案の最大の価値です。

---
**作成日**: 2025-08-19  
**用途**: v2案プロファイル切り替えの安全性説明  
**更新**: プロファイル追加時