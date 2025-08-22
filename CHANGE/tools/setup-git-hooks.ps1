# Git フック自動チェックシステム導入スクリプト
# setup-git-hooks.ps1

Write-Host "===========================================" -ForegroundColor Green
Write-Host "Git フック自動チェックシステム導入開始" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# 現在のディレクトリを取得
$currentDir = Get-Location
Write-Host "現在のディレクトリ: $currentDir" -ForegroundColor Cyan

# .gitディレクトリの存在確認
if (-not (Test-Path ".git")) {
    Write-Host "エラー: .gitディレクトリが見つかりません。Git リポジトリのルートで実行してください。" -ForegroundColor Red
    exit 1
}

# hooksディレクトリの確認
$hooksDir = ".git\hooks"
if (-not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force
    Write-Host "hooksディレクトリを作成しました: $hooksDir" -ForegroundColor Yellow
} else {
    Write-Host "hooksディレクトリが存在します: $hooksDir" -ForegroundColor Green
}

# pre-commitフックの内容
$preCommitContent = @'
#!/bin/sh
# フォルダ構造チェック用pre-commitフック
# 自動生成日時: 2025-08-22

echo "===========================================" 
echo "フォルダ構造チェック (pre-commit)" 
echo "==========================================="

# フォルダ構造のチェック関数
check_folder_structure() {
    echo "📁 フォルダ構造をチェック中..."
    
    # CHANGE、CREATE、PROTECT、VIEWフォルダの存在確認
    required_folders="CHANGE CREATE PROTECT VIEW"
    missing_folders=""
    
    for folder in $required_folders; do
        if [ ! -d "$folder" ]; then
            missing_folders="$missing_folders $folder"
        fi
    done
    
    if [ -n "$missing_folders" ]; then
        echo "❌ 必須フォルダが見つかりません:$missing_folders"
        echo "💡 フォルダ構造の修復が必要です。"
        return 1
    fi
    
    echo "✅ 基本フォルダ構造は正常です"
    return 0
}

# ルートファイルの配置チェック
check_root_files() {
    echo "📄 ルートファイルの配置をチェック中..."
    
    # ルートに置くべきでないファイルのパターン
    forbidden_patterns="*.ts *.tsx *.js *.jsx *.html *.css *.scss *.vue *.py *.java *.cpp *.c"
    forbidden_found=""
    
    for pattern in $forbidden_patterns; do
        if ls $pattern 2>/dev/null | grep -v "package.json\|package-lock.json\|playwright.config.ts\|tsconfig\|vite.config\|vitest.config" >/dev/null 2>&1; then
            files=$(ls $pattern 2>/dev/null | grep -v "package.json\|package-lock.json\|playwright.config.ts\|tsconfig\|vite.config\|vitest.config" | tr '\n' ' ')
            if [ -n "$files" ]; then
                forbidden_found="$forbidden_found $files"
            fi
        fi
    done
    
    if [ -n "$forbidden_found" ]; then
        echo "⚠️  ルートに配置すべきでないファイルが見つかりました:"
        echo "$forbidden_found"
        echo "💡 適切なフォルダに移動することを推奨します。"
        echo "   - ソースファイル → CREATE/または CHANGE/"
        echo "   - ドキュメント → VIEW/"
        return 1
    fi
    
    echo "✅ ルートファイルの配置は適切です"
    return 0
}

# メイン処理
main() {
    echo "開始時刻: $(date)"
    
    # 各チェックを実行
    check_folder_structure
    structure_result=$?
    
    check_root_files  
    files_result=$?
    
    # 結果の判定
    if [ $structure_result -ne 0 ] || [ $files_result -ne 0 ]; then
        echo ""
        echo "=========================================="
        echo "⚠️  フォルダ構造に問題が検出されました"
        echo "=========================================="
        echo "コミットを続行しますが、構造の見直しを推奨します。"
        echo ""
        echo "📋 手動チェックを実行するには:"
        echo "   .\check-structure.bat"
        echo ""
        echo "📖 フォルダ構造ガイド:"
        echo "   VIEW\docs\guides\UNIVERSAL_FOLDER_STRUCTURE_GUIDE.md"
        echo "=========================================="
        echo ""
        
        # 警告は表示するがコミットは継続
        exit 0
    else
        echo ""
        echo "✅ フォルダ構造チェック完了: 問題ありません"
        echo ""
        exit 0
    fi
}

# メイン処理実行
main
'@

# pre-commitフックファイルの作成
$preCommitPath = ".git\hooks\pre-commit"
$preCommitContent | Out-File -FilePath $preCommitPath -Encoding UTF8 -NoNewline
Write-Host "pre-commitフックを作成しました: $preCommitPath" -ForegroundColor Green

# Gitでの実行権限付与
if (Get-Command "git" -ErrorAction SilentlyContinue) {
    try {
        git update-index --chmod=+x ".git/hooks/pre-commit"
        Write-Host "pre-commitフックに実行権限を付与しました" -ForegroundColor Green
    } catch {
        Write-Host "実行権限の付与に失敗しましたが、続行します" -ForegroundColor Yellow
    }
}

# フックの動作テスト
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "フックの動作テスト実行" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

try {
    # Git Bashでpre-commitフックをテスト実行
    $env:PATH = "C:\Program Files\Git\bin;$env:PATH"
    $testCommand = "bash"
    $testArgs = @("-c", "cd '$currentDir' && ./.git/hooks/pre-commit")
    $testResult = & $testCommand $testArgs 2>&1
    Write-Host "テスト実行結果:" -ForegroundColor Yellow
    Write-Host $testResult -ForegroundColor White
    Write-Host "✅ フックのテスト実行が完了しました" -ForegroundColor Green
} catch {
    Write-Host "⚠️  フックのテスト実行に失敗しました: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Git Bashがインストールされていない可能性があります" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "Git フック自動チェックシステム導入完了" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 設定内容:" -ForegroundColor Cyan
Write-Host "  ✅ pre-commitフック: 有効" -ForegroundColor White
Write-Host "  ✅ フォルダ構造チェック: 有効" -ForegroundColor White
Write-Host "  ✅ ルートファイル警告: 有効" -ForegroundColor White
Write-Host ""
Write-Host "🔄 動作タイミング:" -ForegroundColor Cyan
Write-Host "  • git commit 実行時に自動チェック" -ForegroundColor White
Write-Host "  • 問題があっても警告のみ（コミット継続）" -ForegroundColor White
Write-Host ""
Write-Host "📋 手動チェック:" -ForegroundColor Cyan
Write-Host "  check-structure.bat で詳細チェック可能" -ForegroundColor White
Write-Host ""
Write-Host "🎉 セットアップが正常に完了しました！" -ForegroundColor Green