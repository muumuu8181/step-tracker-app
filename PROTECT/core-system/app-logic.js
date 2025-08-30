// Universal App Template - Application Logic
// このファイルはアプリケーションの主要機能を管理します

let selectedTimingValue = '';

// キーボードでの値調整機能
window.handleWeightKeypress = (event) => {
    const weightInput = document.getElementById('weightValue');
    const currentValue = parseFloat(weightInput.value) || 50.0;
    
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        weightInput.value = (currentValue + 0.1).toFixed(1);
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        weightInput.value = Math.max(0, currentValue - 0.1).toFixed(1);
    }
};

// タイミング選択機能（改良版）
window.selectTiming = (timing) => {
    selectedTimingValue = timing;
    document.getElementById('selectedTiming').value = timing;
    
    // すべてのボタンから選択状態を削除
    document.querySelectorAll('.timing-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.opacity = '0.7';
    });
    
    // 選択されたボタンに選択状態を追加
    const selectedBtn = document.querySelector(`[data-timing="${timing}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
        selectedBtn.style.opacity = '1';
    }
    
    log(`⏰ 測定タイミング選択: ${timing}`);
};

// データ保存
window.saveWeightData = async () => {
    if (!currentUser) {
        log('❌ ログインが必要です');
        return;
    }

    const date = document.getElementById('dateInput').value;
    const value = document.getElementById('weightValue').value;
    const memo = document.getElementById('memoInput').value;

    if (!date || !value) {
        log('❌ 日付と値を入力してください');
        return;
    }

    try {
        log('💾 データを保存中...');
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('ja-JP', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const weightData = {
            date: date,
            time: timeString,
            value: parseFloat(value),
            timing: selectedTimingValue || '',
            memo: memo || '',
            userEmail: currentUser.email,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            createdAt: now.toISOString()
        };

        const userRef = database.ref(`users/${currentUser.uid}/weights`);
        await userRef.push(weightData);
        log(`✅ 保存完了: ${date} ${timeString} - ${value} ${selectedTimingValue ? `(${selectedTimingValue})` : ''}`);
        
        // 入力フィールドをクリア（値は50.0に戻す）
        document.getElementById('weightValue').value = '50.0';
        document.getElementById('memoInput').value = '';
        document.getElementById('selectedTiming').value = '';
        selectedTimingValue = '';
        
        // ボタンのスタイルをリセット
        document.querySelectorAll('.timing-btn').forEach(btn => {
            btn.style.opacity = '0.7';
            btn.classList.remove('selected');
        });
        
        // データを再読み込み
        loadUserWeightData(currentUser.uid);
    } catch (error) {
        log(`❌ 保存エラー: ${error.message}`);
    }
};

// データ削除
window.deleteWeightEntry = async (entryId) => {
    if (!currentUser) {
        log('❌ ログインが必要です');
        return;
    }
    
    if (!confirm('この記録を削除しますか？')) {
        return;
    }
    
    try {
        log(`🗑️ データ削除中: ${entryId}`);
        const entryRef = database.ref(`users/${currentUser.uid}/weights/${entryId}`);
        await entryRef.remove();
        log(`✅ 削除完了: ${entryId}`);
    } catch (error) {
        log(`❌ 削除エラー: ${error.message}`);
    }
};

// ユーザーのデータを読み込み
function loadUserWeightData(userId) {
    const userRef = database.ref(`users/${userId}/weights`);
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const historyDiv = document.getElementById('weightHistory');
        
        if (data) {
            const entries = Object.entries(data)
                .map(([key, value]) => ({ id: key, ...value }))
                .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
            
            historyDiv.innerHTML = entries.map(entry => {
                let displayText = `${entry.date}`;
                if (entry.time) displayText += ` ${entry.time}`;
                displayText += `: ${entry.value || entry.weight}`;
                if (entry.timing) displayText += ` (${entry.timing})`;
                if (entry.memo) displayText += ` - ${entry.memo}`;
                return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 2px 0; border-bottom: 1px solid #eee;"><span>${displayText}</span><button onclick="deleteWeightEntry('${entry.id}')" style="background: #dc3545; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">🗑️</button></div>`;
            }).join('');
            
            log(`📈 履歴読み込み完了: ${entries.length}件`);
        } else {
            historyDiv.innerHTML = 'まだデータがありません';
            log('📈 履歴: データなし');
        }
    });
}