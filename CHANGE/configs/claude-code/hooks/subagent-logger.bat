@echo off
setlocal EnableDelayedExpansion

REM ログファイルパス
set LOGFILE=C:\Users\user\.claude\subagent-activity.log

REM 現在時刻取得
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set DATE=%%a/%%b/%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set TIME=%%a:%%b

REM JSON入力からツール情報抽出（簡易版）
set INPUT=
for /f "delims=" %%i in ('more') do (
    set INPUT=!INPUT!%%i
)

REM ログ出力
echo [%DATE% %TIME%] Task tool called >> %LOGFILE%
echo Input: %INPUT% >> %LOGFILE%
echo ---------------------------------------- >> %LOGFILE%