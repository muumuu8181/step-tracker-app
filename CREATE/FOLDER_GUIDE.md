# CREATE フォルダガイド

**このフォルダ専用の説明です。テンプレート全体については `START_HERE.md` を参照してください。**

新機能・新ページの開発用フォルダです。

## フォルダ構成

### features/
- 新機能の開発
- 機能ごとにサブフォルダを作成
- 例: `user-auth/`, `payment-system/`

### components/
- 新しいUIコンポーネントの開発
- 再利用可能なコンポーネントを配置
- 例: `Button.tsx`, `Modal.tsx`

### pages/
- 新しいページの作成
- ページ単位の実装
- 例: `Dashboard.tsx`, `Settings.tsx`

### experiments/
- 実験的機能・プロトタイプ
- 概念実証（PoC）
- A/Bテスト用コンポーネント

## 使用方法

1. 新機能を開発する際は適切なサブフォルダを選択
2. 機能が完成したらPROTECT-保護された/core-systemに移動を検討
3. 実験段階では experiments/ を活用