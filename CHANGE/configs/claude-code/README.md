# Claude Code Hooks 設定ガイド

## 📋 概要

Claude Code hooksを使用してツール実行時の自動処理を設定できます。

## 🗂️ フォルダ構成

```
CHANGE/configs/claude-code/
├── README.md                    # このファイル
├── settings-example.json        # 設定例ファイル
├── hooks/                       # hooksスクリプト
│   ├── task-completion-notifier.bat
│   ├── subagent-logger.bat
│   └── completion-logger.bat
└── examples/
    └── complete-hooks-config.json
```

## ⚡ クイックセットアップ

### 1. 設定ファイル作成
```bash
# ユーザーの.claude設定フォルダに配置
cp settings-example.json ~/.claude/settings.json
```

### 2. hooksスクリプト配置
```bash
# hooksスクリプトをコピー
cp hooks/* ~/.claude/hooks/
```

### 3. Claude Code再起動
設定反映のため必須

## 🎯 利用可能なHooks

### イベントタイプ
- **PreToolUse**: ツール実行前
- **PostToolUse**: ツール実行後
- **UserPromptSubmit**: ユーザープロンプト送信時
- **SessionStart/End**: セッション開始・終了時
- **Notification**: 通知時
- **Stop/SubagentStop**: エージェント終了時

### 設定例
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Task",
        "hooks": [
          {
            "type": "command",
            "command": "C:\\Users\\user\\.claude\\hooks\\task-completion-notifier.bat"
          }
        ]
      }
    ]
  }
}
```

## 📝 実装済み機能

### 1. タスクツール完了通知
- **ファイル**: `hooks/task-completion-notifier.bat`
- **機能**: Taskツール実行後に完了メッセージ表示

### 2. サブエージェント実行ログ
- **ファイル**: `hooks/subagent-logger.bat`
- **機能**: ツール実行前の情報をログファイルに記録

### 3. 完了ログ機能
- **ファイル**: `hooks/completion-logger.bat`
- **機能**: ツール完了時の情報をログファイルに記録

## 🔧 カスタマイズ方法

### 新しいhookの追加
1. `hooks/`フォルダに新しいスクリプトを作成
2. `settings.json`に設定を追加
3. Claude Code再起動

### matcher指定方法
- **完全一致**: `"Task"`
- **OR条件**: `"Write|Edit"`
- **正規表現**: `".*"`
- **全マッチ**: `"*"`

## ⚠️ 注意事項

- 設定変更後は必ずClaude Code再起動
- Windowsではパスに`\\`を使用
- スクリプトはUTF-8エンコーディングで保存
- セキュリティ上、信頼できるスクリプトのみ使用

## 🆘 トラブルシューティング

### よくあるエラー
1. **文字化け**: エンコーディングをUTF-8に変更
2. **パスエラー**: 絶対パスを使用、`\\`でエスケープ
3. **権限エラー**: スクリプトの実行権限を確認

### ログ確認方法
- 実行ログ: `C:\Users\user\.claude\subagent-activity.log`
- セッションログ: `C:\Users\user\.claude\session.log`