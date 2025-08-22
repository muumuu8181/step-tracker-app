@echo off
setlocal enabledelayedexpansion
REM =========================================
REM Folder Structure Detail Check System
REM check-structure.bat
REM Manual execution one-click tool
REM =========================================

echo.
echo ==========================================
echo      Folder Structure Detail Check Start
echo ==========================================
echo.

REM Check current directory
echo Current directory: %CD%
echo Start time: %date% %time%
echo.

REM Check if Git repository
if not exist ".git" (
    echo Error: .git directory not found
    echo Please run in Git repository root
    echo.
    pause
    exit /b 1
)

echo Git repository confirmed
echo.

REM ===========================================
REM 1. Basic Folder Structure Check
REM ===========================================
echo ==========================================
echo 1. Basic Folder Structure Check
echo ==========================================

set "FOLDERS_OK=true"
set "MISSING_FOLDERS="

REM Check required folders
for %%F in (CHANGE CREATE PROTECT VIEW) do (
    if exist "%%F\" (
        echo %%F folder: EXISTS
    ) else (
        echo %%F folder: NOT FOUND
        set "FOLDERS_OK=false"
        set "MISSING_FOLDERS=!MISSING_FOLDERS! %%F"
    )
)

echo.
if "%FOLDERS_OK%"=="true" (
    echo Basic folder structure: OK
) else (
    echo Basic folder structure: ISSUE
    echo Missing folders:!MISSING_FOLDERS!
)
echo.

REM ===========================================
REM 2. Root File Placement Check
REM ===========================================
echo ==========================================
echo 2. Root File Placement Check
echo ==========================================

set "ROOT_FILES_OK=true"
set "MISPLACED_FILES="

REM Check inappropriate file patterns
for %%E in (*.ts *.tsx *.js *.jsx *.html *.css *.scss *.vue *.py *.java *.cpp *.c) do (
    if exist "%%E" (
        REM Check if file should be excluded
        set "EXCLUDE=false"
        for %%X in (package.json package-lock.json playwright.config.ts tsconfig.json tsconfig.base.json vite.config.ts vitest.config.ts) do (
            if /i "%%E"=="%%X" set "EXCLUDE=true"
        )
        
        if "!EXCLUDE!"=="false" (
            echo %%E: Should not be in root
            set "ROOT_FILES_OK=false"
            set "MISPLACED_FILES=!MISPLACED_FILES! %%E"
        )
    )
)

if "%ROOT_FILES_OK%"=="true" (
    echo Root file placement: OK
) else (
    echo Root file placement: ISSUE
    echo Files to check:!MISPLACED_FILES!
    echo Recommended locations:
    echo    - Source files - CREATE/ or CHANGE/
    echo    - Documents - VIEW/
)
echo.

REM ===========================================
REM 3. Folder Structure Detail Check
REM ===========================================
echo ==========================================
echo 3. Folder Structure Detail Check
echo ==========================================

echo Project structure overview:
echo.

REM CHANGE folder contents
if exist "CHANGE\" (
    echo CHANGE folder:
    for /d %%D in (CHANGE\*) do echo    - %%~nxD\
    if exist "CHANGE\README.md" echo    README.md exists
) else (
    echo CHANGE folder does not exist
)
echo.

REM CREATE folder contents
if exist "CREATE\" (
    echo CREATE folder:
    for /d %%D in (CREATE\*) do echo    - %%~nxD\
    if exist "CREATE\README.md" echo    README.md exists
) else (
    echo CREATE folder does not exist
)
echo.

REM PROTECT folder contents
if exist "PROTECT\" (
    echo PROTECT folder:
    for /d %%D in (PROTECT\*) do echo    - %%~nxD\
    if exist "PROTECT\README.md" echo    README.md exists
) else (
    echo PROTECT folder does not exist
)
echo.

REM VIEW folder contents
if exist "VIEW\" (
    echo VIEW folder:
    for /d %%D in (VIEW\*) do echo    - %%~nxD\
    if exist "VIEW\README.md" echo    README.md exists
) else (
    echo VIEW folder does not exist
)
echo.

REM ===========================================
REM 4. Overall Evaluation and Advice
REM ===========================================
echo ==========================================
echo 4. Overall Evaluation and Advice
echo ==========================================

set "OVERALL_SCORE=0"
if "%FOLDERS_OK%"=="true" set /a OVERALL_SCORE+=50
if "%ROOT_FILES_OK%"=="true" set /a OVERALL_SCORE+=50

if %OVERALL_SCORE% geq 90 (
    echo Overall rating: EXCELLENT ^(%OVERALL_SCORE%/100^)
    echo Folder structure is in ideal state
) else if %OVERALL_SCORE% geq 70 (
    echo Overall rating: GOOD ^(%OVERALL_SCORE%/100^)
    echo Small adjustments would make it better
) else if %OVERALL_SCORE% geq 50 (
    echo Overall rating: NEEDS IMPROVEMENT ^(%OVERALL_SCORE%/100^)
    echo Several issues need to be fixed
) else (
    echo Overall rating: NEEDS MAJOR IMPROVEMENT ^(%OVERALL_SCORE%/100^)
    echo Major restructuring required
)

echo.
echo ==========================================
echo Reference Materials and Help
echo ==========================================
echo.
echo Folder structure guide:
echo    VIEW\docs\guides\UNIVERSAL_FOLDER_STRUCTURE_GUIDE.md
echo.
echo Related tools:
echo    - Git hook auto check: runs automatically on git commit
echo    - Setup: setup-git-hooks.ps1
echo.
echo Problem solving tips:
echo    1. Missing folders: Create manually and place README.md
echo    2. Inappropriate file placement: Move to appropriate folder
echo    3. Detailed rules: refer to structure guide
echo.

echo ==========================================
echo      Folder Structure Detail Check Complete
echo ==========================================
echo Completion time: %date% %time%
echo.
echo Press any key to close this window...
pause > nul