@echo off
setlocal EnableDelayedExpansion

REM ログファイルパス
set LOGFILE=C:\Users\user\.claude\subagent-activity.log

REM 現在時刻取得
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set DATE=%%a/%%b/%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set TIME=%%a:%%b

REM 完了ログ
echo [%DATE% %TIME%] Task tool completed successfully >> %LOGFILE%
echo ======================================== >> %LOGFILE%

REM 画面表示
echo.
echo ==============================
echo   タスクツール完了
echo ==============================
echo.