# 📂 **CREATE/CHANGE/VIEW/PROTECT 分類基準**

**作成日**: 2025-08-21  
**目的**: ルートファイル整理のための明確な分類ルール策定

## 🎯 **基本分類思想**

### **CREATE-新しく作る/**
- **用途**: 新機能・新ページ・アプリケーション開発
- **特徴**: 頻繁に編集・拡張されるファイル
- **例**: HTMLファイル、アプリコード、新規開発物

### **CHANGE-変更する/**  
- **用途**: 既存システムの設定・調整・改善
- **特徴**: 定期的に変更される設定・構成ファイル
- **例**: 設定ファイル、構成情報、プロファイル

### **VIEW-見るだけ/**
- **用途**: 参照・閲覧専用ドキュメント
- **特徴**: 読み取り中心、頻繁な編集は不要
- **例**: README、ライセンス、ドキュメント類

### **PROTECT-保護された/**
- **用途**: 重要・危険・セキュリティ関連
- **特徴**: 慎重な取り扱いが必要、影響範囲大
- **例**: コア設定、セキュリティ情報、システム設定

---

## 📋 **具体的分類ルール**

### **📄 CREATE-新しく作る/ 配置対象**

#### **✅ 配置するファイル**
- `index.html` → `CREATE/app/web/` 
  - 理由: アプリのメインファイル、機能拡張対象
- `icon-*.png` → `CREATE/assets/icons/`
  - 理由: アプリ用アセット、デザイン変更対象
- `manifest.json` → `CREATE/app/web/`
  - 理由: アプリ設定、機能追加で変更

#### **🎯 判定基準**
- アプリケーション機能に直結するか？
- 新機能開発で頻繁に変更するか？
- ユーザー向け機能・UI に関連するか？

---

### **🔧 CHANGE-変更する/ 配置対象**

#### **✅ 配置するファイル**
- `package.json` / `package-lock.json` → `CHANGE/dependencies/`
- `tsconfig.json` / `tsconfig.base.json` → `CHANGE/build-config/`
- `vite.config.ts` / `vitest.config.ts` → `CHANGE/build-config/`
- `playwright.config.ts` → `CHANGE/test-config/`
- `knip.json` → `CHANGE/tools-config/`
- `project-settings.json` → `CHANGE/project-config/`
- `profiles.json` → `CHANGE/project-config/`

#### **🎯 判定基準**
- システムの動作・設定を制御するか？
- 開発環境・ビルド設定に関連するか？
- プロジェクトの構成・依存関係を管理するか？

---

### **👀 VIEW-見るだけ/ 配置対象**

#### **✅ 配置するファイル**
- `README.md` → `VIEW/documentation/`
- `LICENSE` → `VIEW/documentation/legal/`
- `E2E_TEST_AUTOMATION_MANUAL.md` → `VIEW/documentation/guides/`
- `UNIVERSAL_FOLDER_STRUCTURE_GUIDE.md` → `VIEW/documentation/guides/`
- `version.json` → `VIEW/reference/`

#### **🎯 判定基準**
- 主に参照・閲覧目的か？
- ドキュメント・説明・手順書か？
- 開発者・ユーザーへの情報提供か？

---

### **🔒 PROTECT-保護された/ 配置対象**

#### **✅ 配置するファイル**
- `work_history_*.log` → 除外（.gitignore対象）
- `local-notes.txt` → 除外（.gitignore対象）
- `playwright-report.json` → 除外（.gitignore対象）

#### **🎯 判定基準**
- システムに重大な影響を与えるか？
- セキュリティ・認証情報を含むか？
- 破損すると復旧困難か？

---

## ⚠️ **特殊ケース・除外対象**

### **🚫 ルートに残すファイル**
**なし** - 全てのファイルを4フォルダに分類

### **🚫 gitignore対象**
- `work_history_*.log` - デバイス固有ログ
- `local-notes.txt` - デバイス固有メモ  
- `playwright-report.json` - テスト結果（一時ファイル）

---

## 🤔 **迷いやすいファイルの判定**

### **❓ package.json**
- **候補**: CREATE（アプリ依存） vs CHANGE（設定）
- **結論**: CHANGE - 依存関係管理は設定業務

### **❓ index.html**
- **候補**: CREATE（アプリ） vs VIEW（静的）
- **結論**: CREATE - アプリ開発で頻繁に変更

### **❓ manifest.json** 
- **候補**: CREATE（アプリ機能） vs CHANGE（設定）
- **結論**: CREATE - アプリ機能定義、UI密結合

### **❓ version.json**
- **候補**: CHANGE（管理） vs VIEW（参照）
- **結論**: VIEW - 主に参照目的、更新は稀

---

## 🎯 **成功判定基準**

### **✅ ルール適用後の期待状態**
1. **ルート空化**: 設定ファイル以外のファイルなし
2. **直感性**: フォルダ名で用途が即座に理解可能
3. **保守性**: 新ファイル追加時の配置判断が1秒で完了
4. **効率性**: 目的のファイルを3クリック以内でアクセス

### **✅ 各フォルダの期待ファイル数**
- **CREATE**: 5-8ファイル（アプリ関連）
- **CHANGE**: 8-12ファイル（設定群）
- **VIEW**: 4-6ファイル（ドキュメント）
- **PROTECT**: 0ファイル（今回は該当なし）

---

**次のステップ**: 個別ファイル判定フローの作成