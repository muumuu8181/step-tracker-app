@echo off
REM 完了タスクログフック
REM Claude CodeのsessionStartイベントで実行

echo.
echo 📝 Session Started - Completion Logger Active
echo Time: %date% %time%
echo.

REM セッション開始をログに記録
echo [%date% %time%] New Claude Code Session Started >> "C:\Users\user\Desktop\work\logs\session.log"