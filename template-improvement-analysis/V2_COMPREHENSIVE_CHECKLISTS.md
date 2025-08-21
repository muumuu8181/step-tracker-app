# v2案 包括的チェックリスト

## 1. 共通環境準備チェックリスト

### 基本環境設定
- [ ] Node.js 20以上がインストールされている（`node --version`で確認）
- [ ] npm または yarn が利用可能（`npm --version`で確認）
- [ ] Git リポジトリが初期化されている（`git status`で確認）
- [ ] TypeScript がグローバルまたはローカルにインストールされている

### プロジェクト初期化
- [ ] `npm init -y`でpackage.json作成
- [ ] TypeScript設定: `npm i -D typescript`でインストール
- [ ] 必要最小限の依存関係をインストール: `npm i -D vitest playwright`
- [ ] `.gitignore`ファイル作成（node_modules, dist, .envなど）

### 設定ファイル作成
- [ ] `tsconfig.base.json`作成（baseUrl: ".", paths設定含む）
- [ ] `.eslintrc.cjs`作成（基本ルール設定）
- [ ] `.dependency-cruiser.cjs`作成（境界違反検知ルール）
- [ ] `profiles.json`作成（4つのプロファイル定義）

### ベースディレクトリ作成
- [ ] `core/`ディレクトリ作成
- [ ] `shared/`ディレクトリ作成  
- [ ] `tests/`ディレクトリ作成
- [ ] `tools/`ディレクトリ作成
- [ ] `tools/profile/`ディレクトリ作成

### プロファイル管理システム
- [ ] `tools/profile/apply.js`作成（プロファイル適用スクリプト）
- [ ] package.jsonにスクリプト追加: `"init:profile": "node tools/profile/apply.js"`
- [ ] package.jsonに品質チェックスクリプト追加: `"check:unused": "knip && ts-prune && depcruise -v .dependency-cruiser.cjs"`

### 品質管理ツールインストール
- [ ] 未使用検知ツール: `npm i -D knip ts-prune @typescript-eslint/parser`
- [ ] 依存関係監視: `npm i -D dependency-cruiser`
- [ ] テストツール: `npm i -D vitest @vitest/ui`
- [ ] E2Eテストツール: `npm i -D @playwright/test`

## 2. minimalプロファイル チェックリスト

### プロファイル適用
- [ ] `npm run init:profile -- minimal`実行
- [ ] `app/web/`ディレクトリが作成されている
- [ ] 不要ディレクトリ（app/server/, functions/）が作成されていない
- [ ] profiles.jsonのminimal設定が正しく適用されている

### SPA/MPA基本構造
- [ ] `app/web/index.html`作成（基本HTMLテンプレート）
- [ ] `app/web/src/app.tsx`作成（メインアプリケーション）
- [ ] `app/web/src/components/`ディレクトリ作成
- [ ] `app/web/src/pages/`ディレクトリ作成

### フロントエンド設定
- [ ] React/Vue等のフレームワークインストール
- [ ] バンドラー設定（Vite/Webpack等）: `npm i -D vite @vitejs/plugin-react`
- [ ] 基本CSS設定またはTailwind CSS導入
- [ ] ルーティング設定（React Router等）

### 開発環境設定
- [ ] `package.json`に開発スクリプト追加: `"dev": "vite"`
- [ ] `package.json`にビルドスクリプト追加: `"build": "vite build"`
- [ ] Hot Reload動作確認
- [ ] 基本的なコンポーネント作成とレンダリング確認

### core連携設定
- [ ] `@core/*`パスエイリアス設定確認
- [ ] `@shared/*`パスエイリアス設定確認
- [ ] core/からのビジネスロジック呼び出しテスト
- [ ] shared/utilsからのユーティリティ関数呼び出しテスト

### API通信設定
- [ ] HTTP クライアント設定（fetch/axios等）
- [ ] 環境変数設定（.env, .env.local）
- [ ] CORS設定（必要に応じて）
- [ ] エラーハンドリング実装

## 3. ssrプロファイル チェックリスト

### Next.js/Nuxt.js環境設定
- [ ] `npm run init:profile -- ssr`実行
- [ ] Next.js/Nuxt.jsのインストール: `npm i next react react-dom`
- [ ] 既存`app/web/`をNext.js構造に置換検討
- [ ] `next.config.js`または`nuxt.config.js`作成

### SSR固有設定
- [ ] API Routes設定（app/api/またはpages/api/）
- [ ] Server Components設定（Next.js 13+の場合）
- [ ] getServerSideProps/getStaticProps実装（Next.js）
- [ ] Nuxt用プラグイン設定（Nuxt.jsの場合）

### パス設定とビルド
- [ ] `tsconfig.json`でNext.js/Nuxt.js用パス設定
- [ ] `@core/*`, `@shared/*`エイリアス動作確認
- [ ] SSRビルド動作確認: `npm run build`
- [ ] 本番デプロイ設定（Vercel/Netlify等）

### 既存資産活用
- [ ] core/ビジネスロジックのSSR環境での動作確認
- [ ] shared/ユーティリティのSSR/Client両対応確認
- [ ] 既存テストのSSR環境での実行確認
- [ ] SEO設定（meta tags, sitemap等）

### SSR特有の考慮事項
- [ ] Hydration警告の解決
- [ ] Client-Serverデータ同期確認
- [ ] 環境変数の適切な分離（NEXT_PUBLIC_等）
- [ ] Server Actions実装（必要に応じて）

### BFF判定回避確認
- [ ] 外部API集約が3つ未満である
- [ ] API Routesで認可/データ整形が十分
- [ ] app/server/が不要であることを確認
- [ ] 将来のモバイル対応予定なし、またはAPI Routes使用予定

## 4. edgeプロファイル チェックリスト

### Serverless環境設定
- [ ] `npm run init:profile -- edge`実行
- [ ] `functions/`ディレクトリが作成されている
- [ ] Express依存関係が含まれていない
- [ ] Edge Runtime対応の依存関係のみインストール

### Fetch APIハンドラー実装
- [ ] `functions/handler.ts`作成（基本Fetchハンドラー）
- [ ] Request/Response型使用
- [ ] URLルーティング実装（pathname判定）
- [ ] JSONレスポンス実装

### Edge制約対応
- [ ] Node.js APIの使用回避確認
- [ ] ファイルシステムアクセス回避
- [ ] 重い計算処理の最適化
- [ ] メモリ使用量の最適化

### デプロイ設定
- [ ] Cloudflare Workers設定（`wrangler.toml`）
- [ ] Vercel Edge Functions設定
- [ ] AWS Lambda@Edge設定（該当する場合）
- [ ] 環境変数設定（各プラットフォーム対応）

### core/shared連携
- [ ] core/ビジネスロジックのEdge環境動作確認
- [ ] shared/utilsのEdge制約チェック
- [ ] 非対応Node.js APIの置換確認
- [ ] cold start時間の最適化

### API設計
- [ ] RESTful API設計（GET/POST/PUT/DELETE）
- [ ] エラーレスポンス標準化
- [ ] CORS ヘッダー設定
- [ ] レスポンス圧縮設定

### パフォーマンス最適化
- [ ] バンドルサイズ最小化
- [ ] 起動時間最適化
- [ ] メモリ使用量監視
- [ ] Cold start対策実装

## 5. libプロファイル チェックリスト

### ライブラリ構成設定
- [ ] `npm run init:profile -- lib`実行
- [ ] `app/*`ディレクトリが不要であることを確認
- [ ] packages構造への変更検討
- [ ] エントリーポイント設定（index.ts）

### パッケージ設定
- [ ] package.jsonに`main`, `types`, `exports`フィールド設定
- [ ] peerDependencies設定（必要に応じて）
- [ ] package.jsonにライブラリメタデータ追加
- [ ] npmignore/.gitignore設定

### ビルド設定
- [ ] TypeScript宣言ファイル生成設定
- [ ] 複数フォーマット出力設定（ESM/CJS）
- [ ] Tree shaking対応設定
- [ ] ライブラリビルドコマンド: `"build": "tsc && vite build"`

### 配布準備
- [ ] README作成（使用方法、API仕様）
- [ ] CHANGELOG作成
- [ ] LICENSE追加
- [ ] セマンティックバージョニング設定

### CLI対応（必要な場合）
- [ ] bin フィールド設定
- [ ] CLI エントリーポイント作成
- [ ] コマンドライン引数パース実装
- [ ] ヘルプメッセージ実装

### 品質保証
- [ ] 型定義ファイルの妥当性確認
- [ ] APIドキュメント生成（TSDoc等）
- [ ] サンプルコード作成
- [ ] バージョン管理戦略設定

### 公開準備
- [ ] npm publish設定
- [ ] npmjs.com アカウント設定
- [ ] 公開前テスト（npm pack確認）
- [ ] CI/CD設定（自動公開）

## 6. プロファイル切り替えチェックリスト

### 事前準備
- [ ] 現在のプロファイル確認（package.json依存関係）
- [ ] 変更内容のバックアップ: `git add . && git commit -m "Before profile switch"`
- [ ] 現在のテスト通過確認: `npm test`

### 切り替え実行
- [ ] プロファイル切り替えコマンド実行: `npm run init:profile -- [新プロファイル]`
- [ ] 新規ディレクトリ作成確認
- [ ] 既存ディレクトリ保持確認
- [ ] 依存関係更新: `npm install`

### 事後確認
- [ ] 新プロファイル動作確認
- [ ] 既存機能継続動作確認: `npm test`
- [ ] 未使用検知確認: `npm run check:unused`
- [ ] 境界違反チェック確認

### 特別ケース対応
- [ ] UI層変更時の手動対応（minimal→edge等）
- [ ] 設定ファイル更新（必要に応じて）
- [ ] 新プロファイル固有の追加設定

## 7. 品質管理チェックリスト

### 自動品質検知
- [ ] 未使用ファイル検知: `knip`実行
- [ ] 未使用exports検知: `ts-prune`実行  
- [ ] 依存関係境界違反チェック: `depcruise -v .dependency-cruiser.cjs`
- [ ] TypeScript型チェック: `tsc --noEmit`

### テスト実行
- [ ] 単体テスト実行: `npm run test`
- [ ] 統合テスト実行（該当する場合）
- [ ] E2Eテスト実行: `npm run test:e2e`
- [ ] テストカバレッジ確認

### コード品質
- [ ] ESLint実行: `npm run lint`
- [ ] Prettier実行: `npm run format`
- [ ] 型安全性確認（any使用の最小化）
- [ ] セキュリティ脆弱性スキャン: `npm audit`

### パフォーマンス
- [ ] バンドルサイズ確認
- [ ] 起動時間測定
- [ ] メモリ使用量確認（大規模データでのテスト）
- [ ] Core Web Vitals測定（Web UI系の場合）

### ドキュメント品質
- [ ] README最新性確認
- [ ] API仕様書更新
- [ ] 型定義コメント確認
- [ ] サンプルコード動作確認

### CI/CD設定
- [ ] GitHub Actions/.gitlab-ci.yml設定
- [ ] テスト自動実行設定
- [ ] 品質ゲート設定（テスト失敗時のマージ防止）
- [ ] 自動デプロイ設定（該当する場合）

## 8. トラブルシューティング

### 環境関連
- [ ] Node.jsバージョン不整合: `.nvmrc`確認、適切なバージョンに切り替え
- [ ] 依存関係競合: `npm ls`でエラー確認、`npm ci`で再インストール
- [ ] TypeScript設定エラー: `tsconfig.json`のpaths設定確認

### プロファイル切り替え問題
- [ ] プロファイル適用失敗: `tools/profile/apply.js`のエラーログ確認
- [ ] 不正なディレクトリ作成: profiles.json設定見直し
- [ ] 既存ファイル競合: 手動でファイル移動・統合

### ビルド・実行エラー
- [ ] TypeScriptコンパイルエラー: 型定義不整合、import文確認
- [ ] モジュール解決エラー: パスエイリアス設定、node_modules確認
- [ ] Edge制約違反: Node.js API使用箇所をEdge対応に変更

### 品質チェック失敗
- [ ] dependency-cruiser境界違反: 不正インポート修正
- [ ] 未使用コード検知: 実際に不要なコード削除または設定除外
- [ ] テスト失敗: モック設定、環境変数設定確認

### パフォーマンス問題
- [ ] バンドルサイズ過大: Tree shaking設定、不要依存関係削除
- [ ] Cold start遅延: 初期化処理の最適化、依存関係軽量化
- [ ] メモリリーク: イベントリスナー適切な削除、不要なクロージャ回避

---

**作成日**: 2025-08-19  
**対象**: v2案（軽量・プロファイル選択式）モダン構造テンプレート  
**用途**: 実装時の包括的チェックリスト