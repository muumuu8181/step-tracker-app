// Universal App Template - Authentication Service
// このファイルは認証機能を管理します

// Googleログイン（改良版 - ポップアップブロック検知付き）
window.handleGoogleLogin = async () => {
    try {
        log('🔐 Googleログイン開始...');
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // モバイルデバイス検出（表示用）
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            log('📱 モバイルデバイス検出 - ポップアップ方式でログイン');
            log('💡 ポップアップが途中で止まる場合は、ブラウザ設定の確認が必要です');
        } else {
            log('🖥️ デスクトップデバイス - ポップアップ方式でログイン');
        }
        
        // ポップアップブロック検知のためのタイムアウト設定
        log('🪟 ポップアップウィンドウでGoogleログインを開始...');
        
        const loginPromise = auth.signInWithPopup(provider);
        
        // タイムアウト検知（5秒でポップアップが開かない場合）
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('ポップアップタイムアウト - ブロックされた可能性があります'));
            }, 5000);
        });
        
        try {
            const result = await Promise.race([loginPromise, timeoutPromise]);
            log(`✅ ログイン成功: ${result.user.displayName}`);
        } catch (raceError) {
            // タイムアウトの場合の特別処理
            if (raceError.message.includes('タイムアウト')) {
                log('⏰ ポップアップが5秒以内に開きませんでした');
                log('🔄 ポップアップブロック検知 - 解決方法をご案内します');
                throw new Error('POPUP_TIMEOUT');
            } else {
                throw raceError;
            }
        }
        
    } catch (error) {
        log(`❌ ログインエラー: ${error.message}`);
        
        // エラーの詳細情報をログに出力
        if (error.code) {
            log(`- エラーコード: ${error.code}`);
            
            // 特定のエラーコードに対する解決策を提示
            switch(error.code) {
                case 'auth/unauthorized-domain':
                    log('💡 ドメイン許可設定の問題です');
                    log('💡 Firebase Consoleで認証ドメインを確認してください');
                    break;
                case 'auth/popup-blocked':
                    log('💡 ポップアップがブロックされました');
                    showPopupGuide(isMobile);
                    break;
                case 'auth/popup-closed-by-user':
                    log('💡 ユーザーがポップアップを閉じました');
                    log('💡 もう一度ログインボタンを押してください');
                    break;
                case 'auth/cancelled-popup-request':
                    log('💡 前回のポップアップがキャンセルされました');
                    log('💡 しばらく待ってから再試行してください');
                    break;
                default:
                    if (error.message === 'POPUP_TIMEOUT') {
                        log('⚠️ ポップアップが途中で止まりました');
                        showPopupGuide(isMobile);
                    } else {
                        log('💡 ブラウザを更新してもう一度お試しください');
                    }
            }
        } else if (error.message === 'POPUP_TIMEOUT') {
            showPopupGuide(isMobile);
        }
        
        if (error.credential) {
            log('- 認証情報は取得済み');
        }
    }
};

// ログアウト
window.handleLogout = async () => {
    try {
        await auth.signOut();
        log('📤 ログアウト完了');
    } catch (error) {
        log(`❌ ログアウトエラー: ${error.message}`);
    }
};

// ポップアップ許可ガイド表示
function showPopupGuide(isMobile) {
    log('📖 === ポップアップ許可ガイド ===');
    if (isMobile) {
        log('📱 スマートフォン向け解決手順:');
        log('1. ページ上部のアドレスバーに表示される「ポップアップがブロックされました」をタップ');
        log('2. または、ブラウザメニュー(⋮) → 設定 → サイト設定 → ポップアップとリダイレクト → 許可');
        log('3. Chrome: 右上⋮メニュー → 設定 → 詳細設定 → サイト設定 → ポップアップとリダイレクト');
        log('4. Safari: 設定アプリ → Safari → ポップアップブロック → オフ');
        log('5. 設定後、このページを更新してもう一度ログインボタンを押してください');
    } else {
        log('💻 PC向け解決手順:');
        log('1. アドレスバー右端のアイコン(🚫)をクリック → 許可');
        log('2. または、ブラウザ設定 → プライバシーとセキュリティ → ポップアップとリダイレクト → 許可');
    }
    log('💡 それでも解決しない場合: プライベートモードを終了するか、別のブラウザをお試しください');
    log('🔄 ポップアップ設定を確認したら、再度「Googleでログイン」ボタンを押してください');
    log('📖 ========================');
}

// UI表示制御
function showUserInterface(user) {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('userInfo').classList.remove('hidden');
    document.getElementById('userPanel').classList.remove('hidden');
    document.getElementById('userName').textContent = user.displayName;
    
    // 今日の日付を自動設定
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('recordDate').value = today;
    
    // 歩数データを読み込み
    loadUserStepData(user.uid);
}

function showLoginInterface() {
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('userPanel').classList.add('hidden');
}