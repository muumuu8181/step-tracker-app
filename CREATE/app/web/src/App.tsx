import React from 'react';
import { greet } from '@core/domain/greeting';

export const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎯 ユニバーサルデザイン・包摂型フォルダ構造</h1>
      <p>{greet('開発者')}</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>📁 新フォルダ構造</h2>
        <ul>
          <li><strong>CREATE-新しく作る/</strong> - 新機能・新ページの開発</li>
          <li><strong>CHANGE-変更する/</strong> - 既存コードの修正・改善</li>
          <li><strong>VIEW-見るだけ/</strong> - 参照専用・読み取り専用</li>
          <li><strong>PROTECT-保護された/</strong> - 重要・危険なシステム</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e7f5e7', borderRadius: '4px' }}>
        <p><strong>✅ フォルダ構造の実装が完了しました！</strong></p>
        <p>すべてのレベルの開発者が直感的に理解できる構造になっています。</p>
      </div>
    </div>
  );
};