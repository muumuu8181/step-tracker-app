@echo off
REM サブエージェント使用ログフック
REM Claude CodeのpreToolUseイベントで実行

REM Taskツールの使用を検知した場合
if /i "%1"=="Task" (
    echo.
    echo 🤖 Subagent Launching...
    echo Tool: %1
    echo Args: %2
    echo Time: %date% %time%
    echo.
    
    REM ログファイルに記録
    echo [%date% %time%] Subagent Used - Tool: %1, Args: %2 >> "C:\Users\user\Desktop\work\logs\subagent-usage.log"
)