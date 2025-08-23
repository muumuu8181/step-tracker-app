@echo off
REM タスク完了通知フック
REM Claude CodeのpostToolUseイベントで実行

echo.
echo ===============================================
echo ^|^|^|  🎉 TASK COMPLETED SUCCESSFULLY! 🎉  ^|^|^|
echo ===============================================
echo Tool: %1
echo Status: COMPLETED
echo Time: %date% %time%
echo ===============================================
echo.

REM ログファイルに記録
echo [%date% %time%] Task Completed - Tool: %1 >> "C:\Users\user\Desktop\work\logs\task-completion.log"