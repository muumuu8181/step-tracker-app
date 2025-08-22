# ユニバーサルデザイン・包摂型フォルダ構造

このプロジェクトは、**すべてのレベルの開発者が直感的に理解できる**フォルダ構造を採用しています。

## 基本コンセプト

4つのメインフォルダで**意図を明確に表現**：

```
project-template/
├── CREATE-新しく作る/           # 新機能・新ページの開発
├── CHANGE-変更する/            # 既存コードの修正・改善  
├── VIEW-見るだけ/              # 参照専用・読み取り専用
└── PROTECT-保護された/         # 重要・危険なシステム
```

## フォルダ構造詳細

### 📝 CREATE-新しく作る/
**新機能・新ページの開発エリア**
- `features/` - 新機能開発
- `components/` - 新UIコンポーネント
- `pages/` - 新ページ作成
- `experiments/` - 実験・プロトタイプ

### 🔧 CHANGE-変更する/
**既存コードの修正・改善エリア**
- `bug-fixes/` - バグ修正
- `improvements/` - 機能改善（testsフォルダもここに配置）
- `refactoring/` - リファクタリング
- `updates/` - バージョンアップ

### 👀 VIEW-見るだけ/
**参照専用・読み取り専用エリア**
- `documentation/` - ドキュメント（旧docsフォルダ）
- `examples/` - サンプルコード
- `reference/` - リファレンス
- `reports/` - レポート・ログ（分析結果など）

### 🔒 PROTECT-保護された/
**重要・危険なシステムエリア**
- `core-system/` - コアシステム（旧core/, shared/フォルダ）
- `database/` - データベース
- `security/` - セキュリティ
- `deployment/` - デプロイ関連（旧tools/, dist/フォルダ）

## 設定ファイルの変更内容

### TypeScript設定（tsconfig.base.json）
```json
"paths": {
  "@core/*": ["PROTECT-保護された/core-system/core/*"],
  "@shared/*": ["PROTECT-保護された/core-system/shared/*"]
}
```

### Vite設定（vite.config.ts）
```js
alias: {
  '@core': path.resolve(__dirname, 'PROTECT-保護された/core-system/core'),
  '@shared': path.resolve(__dirname, 'PROTECT-保護された/core-system/shared')
}
```

### テスト設定
- Playwright: `testDir: './CHANGE-変更する/improvements/tests/e2e'`
- Vitest: テストファイルパスを新構造に対応

## 利点

1. **直感的理解**: フォルダ名で作業内容が明確
2. **安全性向上**: PROTECT-保護されたで重要ファイルを区別  
3. **作業効率**: 目的別に整理されたファイル配置
4. **包摂性**: 経験レベルに関係なく理解可能
5. **保守性**: 構造が明確で長期保守が容易

## 作業フロー

1. **新機能開発**: CREATE-新しく作る/で開発
2. **既存改善**: CHANGE-変更する/で作業
3. **情報参照**: VIEW-見るだけ/を参照
4. **重要変更**: PROTECT-保護された/は慎重に操作

## 移行完了項目

✅ フォルダ構造作成  
✅ 既存ファイル移動  
✅ 設定ファイル更新  
✅ TypeScript/Vite/テスト設定対応  

このフォルダ構造により、**誰でも迷わず開発作業ができる**環境が整いました。