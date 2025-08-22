# ユニバーサルフォルダ構造ガイド（v0.37対応）

このプロジェクトは、**4つの役割別フォルダ**で直感的に理解できる構造を採用しています。

## 基本コンセプト

4つのメインフォルダで**開発作業を明確に分類**：

```
project-template/
├── CREATE/                     # 🆕 新機能・アプリケーション開発
├── CHANGE/                     # 🔧 設定変更・改善・テスト  
├── VIEW/                       # 👀 文書・参照専用
└── PROTECT/                    # 🔒 重要システム・管理ファイル
```

## 実装済みフォルダ構造詳細

### 🎯 CREATE/ - アプリケーション・アセット
**新機能・アプリケーション本体の開発エリア**
```
CREATE/
├── web/app/index.html          # メインアプリケーションファイル
├── web/assets/icons/           # アプリアイコン（180px, 192px, 512px）
├── web/assets/manifests/       # PWA設定（manifest.json）
├── components/                 # 新UIコンポーネント開発
├── features/                   # 新機能開発
├── pages/                      # 新ページ作成
└── experiments/                # 実験・プロトタイプ
```

### 🔧 CHANGE/ - 設定・改善・テスト
**設定変更・既存改善・テストエリア**
```
CHANGE/
├── configs/tools/              # project-settings.json 等の設定
├── configs/typescript/         # tsconfig.json 等のTS設定
├── configs/build/              # ビルド設定
├── improvements/tests/         # 全テストファイル（e2e, unit, integration）
├── bug-fixes/                  # バグ修正
├── refactoring/                # リファクタリング
└── updates/                    # バージョンアップ
```

### 👀 VIEW/ - 文書・参照専用
**ドキュメント・参照専用エリア**
```
VIEW/
├── docs/core/README.md         # メインドキュメント
├── docs/guides/                # 各種ガイド
├── docs/manuals/               # マニュアル
├── docs/legal/                 # ライセンス等
├── documentation/              # 詳細ドキュメント
├── examples/                   # サンプルコード
├── reference/                  # リファレンス
└── reports/                    # レポート・ログ（分析結果等）
```

### 🔒 PROTECT/ - 重要システム・管理
**システム重要ファイル・管理エリア**
```
PROTECT/
├── core-system/core/           # TypeScriptコアシステム（domain, types, usecases）
├── core-system/shared/         # 共有ユーティリティ（constants, types, utils）
├── runtime/                    # 実行時管理ファイル（profiles.json, version.json）
├── deployment/tools/           # デプロイツール・スクリプト
├── deployment/dist/            # ビルド成果物
├── local/                      # ローカル設定・作業ログ
├── database/                   # データベース関連
└── security/                   # セキュリティ設定
```

## 設定ファイルの実装状況

### TypeScript設定（CHANGE/configs/typescript/tsconfig.base.json）
```json
"paths": {
  "@core/*": ["../../PROTECT/core-system/core/*"],
  "@shared/*": ["../../PROTECT/core-system/shared/*"]
}
```

### プロジェクト設定（CHANGE/configs/tools/project-settings.json）
```json
{
  "app": {
    "name": "[アプリ名]",
    "description": "[説明]"
  },
  "database": {
    "collection": "[データ名]"
  }
}
```

### テスト設定
- Playwright: `testDir: './CHANGE/improvements/tests/e2e'`
- Unit Tests: `./CHANGE/improvements/tests/unit/`
- Integration Tests: `./CHANGE/improvements/tests/integration/`

### ファイル配置ルール
```
📱 アプリ本体      → CREATE/web/app/
🎨 アセット        → CREATE/web/assets/
⚙️ 設定ファイル     → CHANGE/configs/
🧪 テストファイル    → CHANGE/improvements/tests/
📚 ドキュメント     → VIEW/docs/
🔧 システムファイル  → PROTECT/core-system/
```

## 利点

1. **🎯 作業分類の明確化**: 4つの役割で作業内容が一目瞭然
2. **🔒 安全性向上**: PROTECTで重要システムファイルを保護
3. **⚡ 作業効率向上**: 目的別に整理された効率的なファイル配置
4. **🌟 初心者フレンドリー**: 経験レベルに関係なく直感的に理解可能
5. **🛡️ 保守性**: 明確な構造で長期保守が容易

## 開発作業フロー

### 🚀 新しいアプリを作る場合
1. **設定変更**: `CHANGE/configs/tools/project-settings.json`でアプリ名・データベース設定
2. **アプリ開発**: `CREATE/web/app/index.html`でUI作成
3. **アイコン設定**: `CREATE/web/assets/icons/`にアプリアイコン配置
4. **PWA設定**: `CREATE/web/assets/manifests/manifest.json`で設定
5. **テスト**: `CHANGE/improvements/tests/`でテスト実行

### ⚙️ 既存改善・修正の場合
1. **設定調整**: `CHANGE/configs/`で各種設定変更
2. **バグ修正**: `CHANGE/bug-fixes/`で修正作業
3. **機能改善**: `CHANGE/improvements/`で改善作業
4. **リファクタリング**: `CHANGE/refactoring/`でコード整理

### 📚 情報参照・文書作成
1. **文書参照**: `VIEW/docs/`でドキュメント確認
2. **サンプル確認**: `VIEW/examples/`でサンプルコード参照
3. **レポート確認**: `VIEW/reports/`で分析結果確認

### 🔧 システム管理（上級者向け）
1. **コアシステム**: `PROTECT/core-system/`（慎重に操作）
2. **デプロイ**: `PROTECT/deployment/`（自動化ツール使用）
3. **ランタイム**: `PROTECT/runtime/`（設定ファイル管理）

## ✅ 実装完了項目

✅ **CREATE/CHANGE/VIEW/PROTECT**フォルダ構造完全実装  
✅ **全ファイル**の適切な配置完了  
✅ **TypeScript設定**の新構造対応完了  
✅ **テスト環境**の新構造対応完了  
✅ **設定ファイル**の集約・整理完了  
✅ **ドキュメント**の新構造対応完了  

## 🎯 新規ファイル追加ガイドライン

| ファイル種別 | 配置場所 | 例 |
|-------------|----------|----| 
| アプリHTML | `CREATE/web/app/` | index.html |
| アイコン・画像 | `CREATE/web/assets/` | icon-512.png |
| 設定ファイル | `CHANGE/configs/` | project-settings.json |
| テストファイル | `CHANGE/improvements/tests/` | app.test.ts |
| ドキュメント | `VIEW/docs/` | README.md |
| システムコード | `PROTECT/core-system/` | domain.ts |

この構造により、**誰でも迷わず効率的に開発作業ができる**環境が完成しました。