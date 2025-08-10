# 🚀 Universal App Template v0.2.4 - クイックスタートガイド

## 📚 ドキュメント案内（初めての方はここから！）

### 🔰 初心者の方へ
1. **まずはこのREADMEを最後まで読んでください**
2. **詳細ドキュメントは [`docs/README.md`](docs/README.md) を確認** ← すべてのドキュメント一覧
3. **セットアップ手順は [`docs/setup/`](docs/setup/) フォルダ内**
4. **使い方ガイドは [`docs/guides/`](docs/guides/) フォルダ内**

### 🔍 困ったときは
- **既知の問題** → [`docs/issues/`](docs/issues/) フォルダを確認
- **修正履歴** → [`docs/fixes/`](docs/fixes/) フォルダを確認
- **ドキュメント作成ルール** → [`docs/DOCUMENTATION_RULES.md`](docs/DOCUMENTATION_RULES.md)

## 📌 はじめに
このテンプレートを使って、**Git干渉なし**で新しいプロジェクトを始められます。

---

## 🎯 最小手順（3ステップ）

### ステップ1: プロジェクトフォルダの作成

```bash
# Windowsの場合
1. C:\Users\user\Desktop\work\90_cc\0000-00-00-project-template をコピー
2. C:\Users\user\Desktop\work\90_cc\[本日の日付]\ に貼り付け
   例: C:\Users\user\Desktop\work\90_cc\20250807\
3. フォルダ名を変更（例: automation-management-system）
```

**重要**: このテンプレートは`.git`フォルダを削除済みなので、**Git干渉は発生しません**

### ステップ2: GitHubへアップロード

```bash
# プロジェクトフォルダ内で実行
git init
git add .
git commit -m "Initial commit"

# GitHubで新規リポジトリを作成後
git remote add origin https://github.com/[あなたのユーザー名]/[リポジトリ名].git
git push -u origin main
```

### ステップ3: 公開設定の選択

#### 🌐 **パブリック（Web公開する場合）**
1. GitHubリポジトリを**Public**で作成
2. Settings → Pages → Source を `main` ブランチに設定
3. Actions タブで自動デプロイを確認
4. 公開URL: `https://[ユーザー名].github.io/[リポジトリ名]/`

#### 🔒 **プライベート（Web公開しない場合）**
1. GitHubリポジトリを**Private**で作成
2. GitHub Pagesは設定しない
3. チーム内のみでコード共有

---

## ⚠️ アップロード前の確認事項

**Claudeに確認してもらう項目:**
- [ ] パブリック or プライベート？
- [ ] Web公開する？（GitHub Pages使用）
- [ ] 機密情報は含まれていない？

---

## 🌟 主要機能

### 📊 基本機能
- **データ記録**: 日付・時刻・値・タイミング・メモを記録
- **🔐 Google認証**: 安全なGoogle OAuth認証システム
- **🔄 リアルタイム同期**: Firebase Realtime Databaseによるデバイス間同期
- **⌨️ キーボード操作**: ↑↓キーで0.1単位の調整
- **📈 履歴表示**: 時系列でのデータ履歴確認

### 🎨 Core/Custom分離構造
- **🚫 Services フォルダ**: 触ってはいけない安全領域（認証・データベース・ログ機能）
- **✅ Custom フォルダ**: 自由にカスタマイズ可能（app-config.js・styles.css・templates/）
- **🔧 簡単変更**: TODOアプリ、メモアプリ等への転用が容易
- **🛡️ 安全性**: 誤った変更による動作不良を防止

### 🎯 汎用テンプレート機能
- 📝 任意のデータコレクション対応
- 🔄 リアルタイム同期
- 🔐 ユーザー別データ分離
- 📊 CRUD操作の標準化

## 🚀 使用方法

### ライブデモ
**https://muumuu8181.github.io/0000-00-00-project-template/**

### ローカル実行
1. HTTPサーバーを起動：
   ```bash
   python -m http.server 8000
   ```
   または
   ```bash
   npx http-server -p 8000
   ```

2. ブラウザで `http://localhost:8000` にアクセス

3. Googleアカウントでログイン

4. データを入力して保存

## 🔧 技術仕様

- **フロントエンド**: Vanilla HTML/CSS/JavaScript
- **認証**: Firebase Authentication (Google OAuth)
- **データベース**: Firebase Realtime Database
- **デプロイ**: GitHub Pages
- **対応ブラウザ**: Chrome, Firefox, Safari, Edge

## 📱 データ構造

### 汎用データ構造（v0.2.2新機能）
```json
{
  "users": {
    "userId": {
      "[collection]": {
        "recordId": {
          "timestamp": 1722944530000,
          "createdAt": "2025-01-10T10:30:00.000Z",
          "updatedAt": "2025-01-10T11:00:00.000Z",
          "...customData": "アプリ固有のデータ"
        }
      }
    }
  }
}
```

### 新しいデータサービス（v0.2.2）
- **CRUDService** (`src/services/crud.js`) - 汎用CRUD操作
  - `create(userId, collection, data)` - データ作成
  - `read(userId, collection, id)` - データ読み取り
  - `update(userId, collection, id, data)` - データ更新
  - `delete(userId, collection, id)` - データ削除
  - `list(userId, collection, limit)` - リスト取得

- **DataManager** (`src/services/data-manager.js`) - アプリ非依存のデータ管理
  - `saveAppData(userId, appType, data)` - アプリデータ保存
  - `getAppData(userId, appType)` - アプリデータ取得

- **DatabaseService** (`src/services/database.js`) - 汎用化済み
  - `saveData(userId, collection, data)` - 汎用保存
  - `deleteData(userId, collection, entryId)` - 汎用削除
  - `watchUserData(userId, collection, callback)` - リアルタイム監視

## 🛡️ プライバシー

- データはユーザー別に完全分離
- Firebase認証による安全なアクセス制御
- 個人情報はFirebaseサーバー側で保護
- アプリコードに個人データは含まれません

## 📁 プロジェクト構造（v0.2.4）

### 🔧 最小限のフォルダ構成

```
プロジェクト/
├── index.html         # メインアプリファイル
├── README.md          # このファイル
├── package.json       # npm設定（必須）
├── .gitignore         # Git設定（必須）
├── _archive/          # 古いバックアップ（無視してOK）
├── docs/              # すべてのドキュメント
├── src/               # すべてのソースコード
└── tests/             # テストファイル
```

### 📂 src/ フォルダ内の構成と編集可否

| フォルダ | 役割 | 編集可否 | 説明 |
|---------|------|---------|------|
| **components/** | UIコンポーネント | ❌ **触るな** | 共通UIパーツ（common/にButton, Card, Modal等） |
| **services/** | データサービス | ❌ **触るな** | auth.js, database.js, crud.js, data-manager.js, logger.js |
| **features/** | 機能モジュール | ⚠️ **要相談** | アプリ固有の機能（main.js） |
| **custom/** | カスタム設定 | ✅ **自由編集OK** | app-config.js, styles.css, loader.js, templates/ |
| **scripts/** | 起動スクリプト | ⚠️ **要相談** | setup.sh, start-server.bat等 |
| **examples/** | サンプルコード | ✅ **参考用** | simple-button-app.html, data-storage-usage.js |
| **core-legacy/** | 旧コア | ❌ **触るな** | 旧バージョンの参照用（編集不要） |

### 🚫 絶対に触ってはいけないファイル

```
src/
├── components/        # ❌ UIコンポーネント群
│   ├── common/       # 汎用UIコンポーネント
│   └── ui.js         # UI基本機能
├── services/         # ❌ コアサービス群
│   ├── auth.js       # 認証サービス
│   ├── database.js   # DBサービス（汎用化済み）
│   ├── crud.js       # 汎用CRUD操作
│   ├── data-manager.js # データ管理
│   └── logger.js     # ログサービス
```

### ✅ 自由に編集できるファイル

```
src/
├── custom/           # ✅ カスタマイズ領域
│   ├── app-config.js # アプリ設定
│   └── styles.css    # デザイン
├── examples/         # ✅ サンプル（参考用）
```

## 🔄 他のアプリに変更する方法

### ✅ 変更してOKなファイル
- `custom/app-config.js` → アプリの動作・設定
- `custom/styles.css` → 見た目・デザイン
- `index.html` の表示部分のみ → UI構造

### 🚫 変更NGなファイル
- `core/` 内のすべて
- `index.html` のFirebase設定部分

### 🎯 カスタマイズ例

#### TODOアプリに変更
1. `custom/app-config.js` で：アプリ名・ボタンをTODO関連に変更
2. `custom/styles.css` で：カラーテーマをタスク管理系に変更
3. `index.html` で：入力フィールドをタスク入力に変更

#### メモアプリに変更
1. `custom/app-config.js` で：アプリ名・ボタンをメモ関連に変更
2. `custom/styles.css` で：シンプルなカラーテーマに変更

## ⚡ 開発ワークフロー

1. **カスタマイズ** → `custom/` フォルダのみ編集
2. **テスト** → ローカルでHTTPサーバー起動
3. **デプロイ** → `git push` で自動デプロイ
4. **確認** → https://muumuu8181.github.io/0000-00-00-project-template/

## 🛡️ 保護メカニズム

- **Core分離** - 誤った変更を物理的に防止
- **明確な境界** - 触ってOK/NGが一目瞭然
- **独立カスタマイズ** - 他への影響なし
- **バックアップ保護** - Core部分は常に安全

## 🎯 開発情報

- **バージョン**: v0.2.4
- **作成日**: 2025-08-07
- **更新日**: 2025-01-10
- **言語**: JavaScript (ES6)
- **ライセンス**: MIT

## 📋 更新履歴

### v0.2.4 (2025-01-10)
- グリッド表示をシンプル化（最外側のみ）
- Excel風の列ラベル（A-Z, AA-AZ...）実装
- 行番号を100まで拡張
- 不要なCSSスタイルを削除

### v0.2.3 (2025-01-10)
- グリッドの二重問題を修正
- 内側の細かいdata-grid属性を削除
- パネルレベルのみグリッドを保持

### v0.2.2 (2025-01-10)
- 汎用データサービス実装（crud.js, data-manager.js）
- DatabaseServiceの汎用化完了
- コレクションベースのデータ管理対応
- ドキュメント整備と構造改善

### v0.2.0 (2025-08-07)
- 汎用アプリテンプレートとしてリリース
- Firebase + Google認証実装済み
- データ記録・履歴表示機能
- キーボード操作対応
- Core/Custom分離構造
- GitHub Pages デプロイ対応

## 🤝 貢献

Issue・Pull Request歓迎です。改善提案やバグ報告をお待ちしています。

---

**🚀 GitHub Pages**: https://muumuu8181.github.io/0000-00-00-project-template/