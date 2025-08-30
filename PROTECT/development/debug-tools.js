// Universal App Template - Debug Tools
// このファイルは開発時のデバッグ用ツール群です

// Firebase接続デバッグ
window.debugFirebaseConnection = () => {
    log('🔍 === Firebase Debug 開始 ===');
    
    // 1. Firebase設定確認
    log(`🔥 Firebase Config確認:`);
    log(`- Project ID: ${firebaseConfig.projectId}`);
    log(`- Database URL: ${firebaseConfig.databaseURL}`);
    log(`- Auth Domain: ${firebaseConfig.authDomain}`);
    
    // 2. 認証状態確認
    if (currentUser) {
        log(`🔐 現在のユーザー: ${currentUser.displayName} (${currentUser.email})`);
        log(`👤 ユーザーID: ${currentUser.uid}`);
    } else {
        log('❌ 未ログイン状態');
    }
    
    // 3. データベース接続確認
    const connectedRef = database.ref('.info/connected');
    connectedRef.on('value', (snap) => {
        const connected = snap.val();
        log(`🌐 Firebase接続状態: ${connected ? '接続中' : '未接続'}`);
    });
    
    // 4. テストデータ書き込み
    if (currentUser) {
        const testRef = database.ref(`debug/${currentUser.uid}/test`);
        testRef.set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            message: 'Debug test from debugFirebaseConnection'
        }).then(() => {
            log('✅ テストデータ書き込み成功');
        }).catch((error) => {
            log(`❌ テストデータ書き込み失敗: ${error.message}`);
        });
    }
    
    log('🔍 === Firebase Debug 完了 ===');
};

// ログイン問題診断
window.checkLoginIssues = () => {
    log('⚠️ === ログイン問題診断 開始 ===');
    
    // 1. プロトコルチェック
    const protocol = window.location.protocol;
    log(`🌐 現在のプロトコル: ${protocol}`);
    
    if (protocol === 'file:') {
        log('❌ 問題発見: file://プロトコルではGoogle認証が動作しません');
        log('✅ 解決方法:');
        log('  1. HTTPサーバー経由でアクセス');
        log('  2. python -m http.server 8000');
        log('  3. または chrome://flags でローカルファイルアクセスを許可');
        log('- Googleログインはリダイレクト方式を使用');
        return;
    }
    
    // 2. ドメイン確認
    const domain = window.location.hostname;
    log(`🏠 現在のドメイン: ${domain}`);
    
    if (domain !== 'localhost' && domain !== '127.0.0.1' && !domain.includes('github.io')) {
        log('⚠️ 注意: Firebase Consoleでこのドメインが許可されているか確認が必要');
    }
    
    // 3. Firebaseライブラリ確認
    if (typeof firebase !== 'undefined') {
        log('✅ Firebase SDK: 読み込み済み');
        log(`- Firebase Version: ${firebase.SDK_VERSION || 'Unknown'}`);
    } else {
        log('❌ Firebase SDK: 読み込みエラー');
        return;
    }
    
    // 4. 認証設定確認
    if (auth) {
        log('✅ Firebase Auth: 初期化済み');
        const user = auth.currentUser;
        if (user) {
            log(`👤 現在のユーザー: ${user.displayName}`);
        } else {
            log('👤 現在のユーザー: 未ログイン');
        }
    } else {
        log('❌ Firebase Auth: 初期化エラー');
    }
    
    // 5. 開発環境向けアドバイス
    if (domain === 'localhost' || domain === '127.0.0.1') {
        log('✅ ローカル開発: Firebase設定で許可が必要');
        log('💡 Firebase Consoleの認証設定で許可が必要かもしれません');
    }
    
    log('⚠️ === ログイン問題診断 完了 ===');
};

// 認証状態強制確認
window.forceAuthCheck = () => {
    log('🔍 === 認証状態強制確認 開始 ===');
    
    const user = auth.currentUser;
    log(`🔐 Firebase認証状態: ${user ? `ログイン済み (${user.displayName})` : '未ログイン'}`);
    
    if (user) {
        log('✅ ユーザー画面を表示します');
        showUserInterface(user);
        loadUserWeightData(user.uid);
    } else {
        log('❌ 未ログイン - ログイン画面を表示します');
        showLoginInterface();
    }
    
    // 現在のUI状態確認
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    
    log(`🎨 UI状態:`);
    log(`- 認証セクション: ${authSection.classList.contains('hidden') ? '非表示' : '表示'}`);
    log(`- ユーザーセクション: ${userSection.classList.contains('hidden') ? '非表示' : '表示'}`);
    
    log('🔍 === 認証状態強制確認 完了 ===');
};

// Firebase設定診断
window.checkFirebaseConfig = () => {
    log('🔧 === Firebase設定診断 開始 ===');
    
    // 現在のドメイン確認
    const currentDomain = window.location.hostname;
    const currentUrl = window.location.href;
    log(`🌐 現在のドメイン: ${currentDomain}`);
    log(`🔗 現在のURL: ${currentUrl}`);
    
    // Firebase設定情報
    log(`🔥 Firebase設定:`);
    log(`- Project ID: ${firebaseConfig.projectId}`);
    log(`- Auth Domain: ${firebaseConfig.authDomain}`);
    log(`- Database URL: ${firebaseConfig.databaseURL}`);
    log(`- Storage Bucket: ${firebaseConfig.storageBucket}`);
    
    // 設定チェック
    if (!firebaseConfig.projectId) {
        log('❌ Project ID が設定されていません');
    }
    if (!firebaseConfig.authDomain) {
        log('❌ Auth Domain が設定されていません');
    }
    if (!firebaseConfig.databaseURL) {
        log('❌ Database URL が設定されていません');
    }
    
    // ドメイン整合性チェック
    if (currentDomain !== 'localhost' && 
        currentDomain !== '127.0.0.1' && 
        !currentUrl.includes(firebaseConfig.authDomain)) {
        log('⚠️ 警告: 現在のドメインとFirebase設定が不整合の可能性');
        log('💡 Firebase Consoleでこのドメインが許可されているか確認が必要');
    }
    
    // プロトコルチェック
    if (window.location.protocol === 'file:') {
        log('❌ file://プロトコル検出 - Firebase認証は動作しません');
        log('💡 HTTPサーバー経由でアクセスしてください');
    }
    
    log('🔧 === Firebase設定診断 完了 ===');
};

// その他のデバッグ関数（簡略版）
window.copyDebugInfo = () => {
    const debugInfo = `
=== デバッグ情報 ===
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Firebase設定:
- プロジェクトID: ${firebaseConfig.projectId}
- データベースURL: ${firebaseConfig.databaseURL}
- 認証ドメイン: ${firebaseConfig.authDomain}
Firebase SDK: ${typeof firebase !== 'undefined' ? '読み込み済み' : '読み込みエラー'}
認証状態: ${auth.currentUser ? `ログイン済み (${auth.currentUser.displayName})` : '未ログイン'}
現在時刻: ${new Date().toLocaleString()}
`;
    navigator.clipboard.writeText(debugInfo).then(() => {
        log('📋 デバッグ情報をクリップボードにコピーしました');
    }).catch(() => {
        log('❌ クリップボードへのコピーに失敗しました');
        console.log(debugInfo);
    });
};

window.testPopup = () => {
    log('🧪 ポップアップテスト開始...');
    const popup = window.open('about:blank', 'test', 'width=400,height=300');
    if (popup) {
        log('✅ ポップアップ表示成功');
        setTimeout(() => popup.close(), 2000);
    } else {
        log('❌ ポップアップブロックされています');
    }
};

// プロトコルチェック（自動診断）
if (window.location.protocol === 'file:') {
    log('⚠️ file://プロトコル検出 - Googleログインには HTTPサーバーが必要です');
    log('💡 解決方法: python -m http.server 8000 または chrome://flags設定');
}