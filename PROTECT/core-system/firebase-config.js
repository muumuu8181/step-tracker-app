// Universal App Template - Firebase Configuration
// このファイルはFirebaseの初期化設定を管理します

// Core Firebase設定（変更禁止）
const firebaseConfig = {
    apiKey: "AIzaSyA5PXKChizYDCXF_GJ4KL6Ylq9K5hCPXWE",
    authDomain: "shares-b1b97.firebaseapp.com",
    databaseURL: "https://shares-b1b97-default-rtdb.firebaseio.com",
    projectId: "shares-b1b97",
    storageBucket: "shares-b1b97.firebasestorage.app",
    messagingSenderId: "38311063248",
    appId: "1:38311063248:web:0d2d5726d12b305b24b8d5"
};

// Firebase初期化
let auth, database, currentUser = null;

function initializeFirebase() {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    database = firebase.database();
    
    // 認証状態の監視
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        if (user) {
            log(`✅ 認証状態確認: ${user.displayName} でログイン中`);
            log(`📧 メール: ${user.email}`);
            showUserInterface(user);
            loadUserWeightData(user.uid);
        } else {
            log('🔒 認証状態: 未ログイン');
            showLoginInterface();
        }
    });
    
    log('🔄 Firebase認証システム初期化完了 - 認証状態を確認中...');
}

// Firebase初期化を外部から呼び出し可能にする
window.initializeFirebase = initializeFirebase;