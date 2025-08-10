// Database Module  
// 責務: Firebase Realtime Databaseとのデータ操作

export class DatabaseService {
    constructor(firebaseDatabase, logger) {
        this.database = firebaseDatabase;
        this.log = logger;
    }

    // データ保存
    async saveWeightData(userId, data) {
        try {
            this.log('💾 データを保存中...');
            
            const now = new Date();
            const timeString = now.toLocaleTimeString('ja-JP', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            const weightData = {
                ...data,
                time: timeString,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                createdAt: now.toISOString()
            };

            const userRef = this.database.ref(`users/${userId}/weights`);
            await userRef.push(weightData);
            
            this.log(`✅ 保存完了: ${data.date} ${timeString} - ${data.value} ${data.timing ? `(${data.timing})` : ''}`);
            return true;
        } catch (error) {
            this.log(`❌ 保存エラー: ${error.message}`);
            throw error;
        }
    }

    // データ削除
    async deleteWeightEntry(userId, entryId) {
        try {
            this.log(`🗑️ データ削除中: ${entryId}`);
            const entryRef = this.database.ref(`users/${userId}/weights/${entryId}`);
            await entryRef.remove();
            this.log(`✅ 削除完了: ${entryId}`);
        } catch (error) {
            this.log(`❌ 削除エラー: ${error.message}`);
            throw error;
        }
    }

    // データ読み込み（リアルタイム監視）
    watchUserData(userId, onDataUpdate) {
        const userRef = this.database.ref(`users/${userId}/weights`);
        
        userRef.on('value', (snapshot) => {
            const data = snapshot.val();
            
            if (data) {
                const entries = Object.entries(data)
                    .map(([key, value]) => ({ id: key, ...value }))
                    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
                
                this.log(`📈 履歴読み込み完了: ${entries.length}件`);
                onDataUpdate(entries);
            } else {
                this.log('📈 履歴: データなし');
                onDataUpdate([]);
            }
        });
    }

    // 監視を停止
    stopWatching(userId) {
        const userRef = this.database.ref(`users/${userId}/weights`);
        userRef.off();
    }

    // 接続状態確認
    async checkConnection() {
        const connectedRef = this.database.ref('.info/connected');
        const snapshot = await connectedRef.once('value');
        const connected = snapshot.val();
        this.log(`🌐 Firebase接続状態: ${connected ? '接続中' : '未接続'}`);
        return connected;
    }

    // データベース構造確認
    async checkDatabaseStructure(userId, userEmail) {
        this.log('🏗️ データベース構造確認中...');
        
        try {
            const userRef = this.database.ref(`users/${userId}/weights`);
            const snapshot = await userRef.once('value');
            const data = snapshot.val();
            
            if (data) {
                const entries = Object.keys(data);
                this.log(`📊 ユーザー(${userEmail})のデータ:`);
                this.log(`- 記録数: ${entries.length}件`);
                return { count: entries.length, hasData: true };
            } else {
                this.log('📊 データがありません');
                return { count: 0, hasData: false };
            }
        } catch (error) {
            this.log(`❌ 構造確認エラー: ${error.message}`);
            throw error;
        }
    }
}