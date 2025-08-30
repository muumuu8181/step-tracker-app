// Step Tracker App - Application Logic
// このファイルは万歩計アプリの主要機能を管理します

// 歩数記録保存
window.saveStepRecord = async () => {
    if (!currentUser) {
        log('❌ ログインが必要です');
        return;
    }

    const date = document.getElementById('recordDate').value;
    const steps = document.getElementById('stepCount').value;
    const memo = document.getElementById('memo').value;

    if (!date || !steps) {
        log('❌ 日付と歩数を入力してください');
        return;
    }

    try {
        log('💾 歩数データを保存中...');
        
        const now = new Date();
        const stepData = {
            date: date,
            steps: parseInt(steps),
            memo: memo || '',
            userEmail: currentUser.email,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
        };

        const userRef = database.ref(`users/${currentUser.uid}/step_records`);
        await userRef.push(stepData);
        log(`✅ 保存完了: ${date} - ${steps}歩`);
        
        // 入力フィールドをクリア
        document.getElementById('stepCount').value = '';
        document.getElementById('memo').value = '';
        
        // データを再読み込み
        loadUserStepData(currentUser.uid);
    } catch (error) {
        log(`❌ 保存エラー: ${error.message}`);
    }
};

// 歩数記録削除
window.deleteStepEntry = async (entryId) => {
    if (!currentUser) {
        log('❌ ログインが必要です');
        return;
    }
    
    if (!confirm('この記録を削除しますか？')) {
        return;
    }
    
    try {
        log(`🗑️ 歩数データ削除中: ${entryId}`);
        const entryRef = database.ref(`users/${currentUser.uid}/step_records/${entryId}`);
        await entryRef.remove();
        log(`✅ 削除完了: ${entryId}`);
    } catch (error) {
        log(`❌ 削除エラー: ${error.message}`);
    }
};

// 履歴更新
window.refreshHistory = () => {
    if (!currentUser) {
        log('❌ ログインが必要です');
        return;
    }
    
    log('🔄 履歴を更新中...');
    loadUserStepData(currentUser.uid);
};

// 履歴エクスポート
window.exportHistory = () => {
    if (!currentUser) {
        log('❌ ログインが必要です');
        return;
    }
    
    const historyDiv = document.getElementById('stepHistory');
    const historyText = historyDiv.innerText;
    
    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `step-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    log('📤 履歴エクスポート完了');
};

// ユーザーの歩数データを読み込み
function loadUserStepData(userId) {
    const userRef = database.ref(`users/${userId}/step_records`);
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const historyDiv = document.getElementById('stepHistory');
        
        if (data) {
            const entries = Object.entries(data)
                .map(([key, value]) => ({ id: key, ...value }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            historyDiv.innerHTML = entries.map(entry => {
                let displayText = `${entry.date}: ${entry.steps}歩`;
                if (entry.memo) displayText += ` - ${entry.memo}`;
                return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee; background: white; margin-bottom: 5px; border-radius: 3px;"><span>${displayText}</span><button onclick="deleteStepEntry('${entry.id}')" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;">🗑️</button></div>`;
            }).join('');
            
            log(`📊 履歴読み込み完了: ${entries.length}件`);
        } else {
            historyDiv.innerHTML = '<p style="text-align: center; color: #666;">まだ記録がありません</p>';
            log('📊 履歴: データなし');
        }
    });
}