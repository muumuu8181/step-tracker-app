# Claude Code Hooks Configuration

## セットアップ手順

### 1. Windows設定
```powershell
# PowerShell実行ポリシーを設定（管理者権限で実行）
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. 設定ファイル作成
Claude Codeの設定ファイル（通常 `%APPDATA%\.claude\settings.json`）を編集：

```json
{
  "hooks": {
    "postToolUse": "C:\\path\\to\\your\\hooks\\task-completion-notifier.bat"
  }
}
```

### 3. フックスクリプトの配置
`hooks/` フォルダ内のbatファイルを適切な場所に配置し、パスを更新してください。

## 利用可能なフック

- **task-completion-notifier.bat** - タスク完了時の強調表示
- **subagent-logger.bat** - サブエージェント使用ログ
- **completion-logger.bat** - 完了タスクのログ記録

## 設定例
`settings-example.json` に完全な設定例があります。

## トラブルシューティング
- 新しい設定は Claude Code の再起動後に有効になります
- batファイルのパスは絶対パスを使用してください
- Windows環境でのテスト済み