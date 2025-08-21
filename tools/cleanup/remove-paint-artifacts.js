/**
 * ペイント関連の残骸除去ツール
 * HTMLからペイント固有の要素を汎用的な要素に置換
 */

const fs = require('fs');
const path = require('path');

function cleanupIndexHtml() {
  const indexPath = path.join(__dirname, '..', '..', 'index.html');
  let content = fs.readFileSync(indexPath, 'utf8');

  // ペイント固有のクラス名を汎用的な名前に変更
  const replacements = [
    // CSS class names
    { from: /brush-tools/g, to: 'app-tools' },
    { from: /paintCanvas/g, to: 'appCanvas' },
    { from: /brushSize/g, to: 'itemSize' },
    { from: /colorPicker/g, to: 'optionPicker' },
    
    // Tool buttons - 汎用的なツールに変更
    { from: /<button[^>]*onclick="selectTool\('brush'\)"[^>]*>🖌️ ブラシ<\/button>/, to: '<button type="button" class="tool-btn active" onclick="selectTool(\'tool1\')" data-tool="tool1" style="background: #ff0080;">🔧 ツール1</button>' },
    { from: /<button[^>]*onclick="selectTool\('pencil'\)"[^>]*>✏️ ペンシル<\/button>/, to: '<button type="button" class="tool-btn" onclick="selectTool(\'tool2\')" data-tool="tool2" style="background: #00ffff;">⚙️ ツール2</button>' },
    { from: /<button[^>]*onclick="selectTool\('spray'\)"[^>]*>🎨 スプレー<\/button>/, to: '<button type="button" class="tool-btn" onclick="selectTool(\'tool3\')" data-tool="tool3" style="background: #ff8000;">🛠️ ツール3</button>' },
    { from: /<button[^>]*onclick="selectTool\('glow'\)"[^>]*>✨ グロー<\/button>/, to: '<button type="button" class="tool-btn" onclick="selectTool(\'tool4\')" data-tool="tool4" style="background: #ffff00;">📐 ツール4</button>' },
    { from: /<button[^>]*onclick="selectTool\('neon'\)"[^>]*>💫 ネオン<\/button>/, to: '<button type="button" class="tool-btn" onclick="selectTool(\'tool5\')" data-tool="tool5" style="background: #80ff00;">📏 ツール5</button>' },
    { from: /<button[^>]*onclick="selectTool\('particle'\)"[^>]*>🌟 パーティクル<\/button>/, to: '<button type="button" class="tool-btn" onclick="selectTool(\'tool6\')" data-tool="tool6" style="background: #ff0040;">🔩 ツール6</button>' },
    
    // Labels - 汎用的なラベルに変更
    { from: /🖌️ サイズ:/g, to: '📏 サイズ:' },
    { from: /🎨 カラー:/g, to: '🎨 設定:' },
    { from: /brushSizeDisplay/g, to: 'itemSizeDisplay' },
    
    // Function names
    { from: /clearCanvas\(\)/g, to: 'clearData()' },
    { from: /downloadPainting\(\)/g, to: 'downloadData()' },
    
    // Canvas element
    { from: /<canvas id="paintCanvas"/, to: '<canvas id="appCanvas"' },
    
    // Comments
    { from: /<!-- アプリツール -->/g, to: '<!-- 汎用ツール -->' },
    
    // Button text
    { from: />🗑️ クリア</g, to: '>🗑️ リセット<' },
    { from: />💾 ダウンロード</g, to: '>📤 エクスポート<' }
  ];

  // Apply all replacements
  replacements.forEach(replacement => {
    content = content.replace(replacement.from, replacement.to);
  });

  fs.writeFileSync(indexPath, content);
  console.log('✅ HTML cleanup completed - removed paint-specific artifacts');
}

function cleanupCss() {
  const indexPath = path.join(__dirname, '..', '..', 'index.html');
  let content = fs.readFileSync(indexPath, 'utf8');

  // CSS内のペイント関連セレクタを更新
  const cssReplacements = [
    { from: /#paintCanvas/g, to: '#appCanvas' },
    { from: /\.brush-tools/g, to: '.app-tools' }
  ];

  cssReplacements.forEach(replacement => {
    content = content.replace(replacement.from, replacement.to);
  });

  fs.writeFileSync(indexPath, content);
  console.log('✅ CSS cleanup completed - updated selectors');
}

function main() {
  try {
    console.log('🧹 Starting paint artifacts cleanup...');
    
    cleanupIndexHtml();
    cleanupCss();
    
    console.log('✅ Paint artifacts cleanup completed!');
    console.log('🎉 Template is now generic and reusable');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };