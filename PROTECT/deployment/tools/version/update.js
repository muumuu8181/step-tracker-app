/**
 * バージョン一元管理システム
 * version.json を基準に全ファイルのバージョンを更新
 */

const fs = require('fs');
const path = require('path');

// version.json を読み込み
function loadVersionConfig() {
  const versionPath = path.join(__dirname, '..', '..', '..', 'runtime', 'version.json');
  const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  return versionData;
}

// package.json を更新
function updatePackageJson(versionConfig) {
  const packagePath = path.join(__dirname, '..', '..', '..', '..', 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  packageData.version = versionConfig.template.version;
  packageData.description = versionConfig.template.description + " - カップラーメン方式";
  
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
  console.log(`✅ package.json updated to v${versionConfig.template.version}`);
}

// project-settings.json を更新
function updateProjectSettings(versionConfig) {
  const settingsPath = path.join(__dirname, '..', '..', '..', '..', 'CHANGE', 'configs', 'tools', 'project-settings.json');
  const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  
  // Template version
  settingsData.project.version = versionConfig.template.version;
  
  // App defaults (テンプレート用)
  settingsData.app.name = versionConfig.template.name;
  settingsData.app.nameEn = versionConfig.template.name;
  settingsData.app.description = versionConfig.template.description;
  settingsData.app.version = versionConfig.app.defaultVersion;
  
  fs.writeFileSync(settingsPath, JSON.stringify(settingsData, null, 2));
  console.log(`✅ project-settings.json updated to template v${versionConfig.template.version}`);
}

// index.html のタイトルを更新
function updateIndexHtml(versionConfig) {
  const indexPath = path.join(__dirname, '..', '..', 'index.html');
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // タイトル部分を更新
  const titlePattern = /<h1 class="app-title">[^<]+<\/h1>/;
  const newTitle = `<h1 class="app-title">📱 ${versionConfig.template.name} v${versionConfig.template.version}</h1>`;
  
  indexContent = indexContent.replace(titlePattern, newTitle);
  
  // サブタイトルを更新
  const subtitlePattern = /<p class="app-subtitle">[^<]+<\/p>/;
  const newSubtitle = `<p class="app-subtitle">${versionConfig.template.description}</p>`;
  
  indexContent = indexContent.replace(subtitlePattern, newSubtitle);
  
  fs.writeFileSync(indexPath, indexContent);
  console.log(`✅ index.html updated with template info`);
}

// メイン実行
function main() {
  try {
    console.log('🔄 Starting version update...');
    
    const versionConfig = loadVersionConfig();
    console.log(`📖 Loaded version config: template v${versionConfig.template.version}`);
    
    updatePackageJson(versionConfig);
    updateProjectSettings(versionConfig);
    updateIndexHtml(versionConfig);
    
    console.log('✅ All files updated successfully!');
    console.log(`🎉 Template version is now v${versionConfig.template.version}`);
    
  } catch (error) {
    console.error('❌ Error updating versions:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, loadVersionConfig };