モダン構造テンプレート v2（軽量・プロファイル選択式）
1) 目的と非目的

目的：小〜中規模の Web/Node 系を、最小コストで始めて、要件拡張にも無理なく追従できる構造にする。

非目的：最初からすべての種類のアプリに対応する巨大テンプレ化（=過剰化）。

2) 適用レンジ（早見表）
タイプ	適合度	方針
SPA/MPA + Node API	✅ 高	ベース構成そのまま
SSR（Next/Nuxt 等）	✅ 中〜高	BFFは持たず SSR側の API Routes へ寄せる
Serverless/Edge	✅ 中	Express禁止、Fetch ハンドラで functions/ へ
ライブラリ/CLI	✅ 中	app/* を外し、packages 化
デスクトップ/モバイル	⚠️ 中	UI層を差し替え（Electron/React Native）
3) ベース構成（最小セットのみ作成）

必要になるまで“作らない”が正義。まずはこれだけ。

/ (repo root)
├─ package.json / tsconfig.base.json / .eslintrc.cjs / .dependency-cruiser.cjs
├─ core/                 # ドメイン/ユースケース（純ロジック・副作用禁止）
│  ├─ domain/ usecases/ types/ index.ts
├─ app/
│  └─ web/               # クライアント（SPA/MPA/または後でSSR置換）
│     ├─ index.html
│     └─ src/ (app.tsx, components/, pages/)
├─ shared/               # 横断（utils, i18n, 共通types）
├─ tests/                # テスト本体
│  ├─ unit/              # core中心に厚く
│  ├─ integration/       # I/O境界の結合
│  └─ e2e/               # 主要ユーザ動線（Playwright等）
└─ tools/                # 開発/運用補助（※テスト本体は置かない）
   ├─ codegen/           # 型/契約生成など
   ├─ smoke/             # 簡易疎通チェック
   └─ profile/           # プロファイル適用スクリプト

4) オプション（条件を満たしたら追加）
ディレクトリ	追加の条件	メモ
app/server/	外部APIの集約/秘匿情報/認可/キャッシュがフロントだけでは辛い	= BFF（Backend for Frontend）。SSR採用時はまず不要
functions/	Serverless/Edge にデプロイ	Fetch ハンドラ（標準 Request/Response）で書く
contracts/	API契約を複数箇所で参照/型生成したい	OpenAPI/JSON Schema 出力先は shared/types/contracts に一元化
db/	マイグレーションが必要になった	Prisma/Drizzle 等の管理一式
infra/	IaC/Docker/devcontainer/CI をコード化したい	必要最低限から
.github/workflows/	CI を回す	Lint→Unit→Integration→E2E の速い失敗順
5) プロファイル（選択式で“物理的に作る”）

profiles.json に“作るディレクトリ”を宣言し、それ以外は作らない。

{
  "minimal": ["core","app/web","shared","tests","tools"],
  "ssr":     ["core","shared","tests","tools","app/web"], 
  "edge":    ["core","shared","tests","tools","functions"],
  "lib":     ["core","shared","tests","tools"] 
}


package.json（抜粋）

{
  "scripts": {
    "init:profile": "node tools/profile/apply.js $PROFILE",
    "check:unused": "knip && ts-prune && depcruise -v .dependency-cruiser.cjs",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "smoke": "node tools/smoke/api.js",
    "codegen": "node tools/codegen/openapi.js"
  }
}


minimal：最小開始（BFFなし）

ssr：Next/Nuxt に置換する想定（BFF不要）

edge：Serverless/Edge 前提（Express禁止）

lib：app/* なし、配布/CLI 向け

6) BFF（Backend for Frontend）の要否判定（5つのYES/NO）

外部/社内 API を3つ以上集約して使う？

秘匿キー/厳格な認可をフロントから切り離したい？

レスポンス整形/キャッシュで画面毎の負荷を下げたい？

SSRの API Routes だけでは辛い結合が多い？

将来のモバイル/他クライアントも同じ窓口を使う予定？
→ YES が複数なら BFF を 後付けで導入（最初からは作らない）。

7) SSR（Next/Nuxt）採用時のマッピング

app/web/ → Next/Nuxt プロジェクト（app/ or pages/）へ置換

app/server/ → 作らない（必要 API は app/api/* や Server Actions）

core/ shared/ → そのまま再利用（tsconfig.paths でエイリアス）

public/ → SSR 側の public/ へ

tests/ → unit: Vitest/Jest、e2e: Playwright 継続

8) Serverless/Edge（functions/）置き換えの素型

Expressは禁止。標準 Fetch で統一。

// functions/handler.ts (Cloudflare Workers/Edge等)
export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/healthz") {
      return new Response("ok", { headers: { "content-type": "text/plain" } });
    }
    if (url.pathname === "/todos") {
      const data = await listTodos(); // core の純ロジック
      return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
    }
    return new Response("not found", { status: 404 });
  }
}

9) tools/ と tests/ の境界

tests/：テスト“本体”（unit/integration/e2e）。

tools/：補助（コード生成・スモーク・マイグレーション・プロファイル適用など）。

業界で “scripts = テスト置き場”という決まりはない。混同回避のため tools/ を採用。

10) 未使用検知と“ゴミ防止”CI

作らない：プロファイル適用で不要ディレクトリは物理的に生成しない

使っていなければ落とす：check:unused を CI に入れて Fail で知らせる

knip（未使用ファイル/exports）、ts-prune（未使用TS exports）、dependency-cruiser（境界違反）

.github/workflows/ci.yml（骨子）

name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run check:unused
      - run: npm run test --workspaces=false
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

11) テスト戦略（最小→拡張）

unit（多）：core を純ロジックとして厚く守る

integration（中）：HTTP/DB/Queue など I/O 境界

e2e（要所）：主要動線のみ（ログイン/CRUD/レスポンシブ）

Playwright の“共通スモーク”例：

test('smoke', async ({ page }) => {
  await page.goto(process.env.BASE_URL!);
  await expect(page).toHaveTitle(/.+/);
});

12) 型と契約の一元化

ドメイン型 → core/types

横断型 → shared/types

契約生成型（OpenAPI/Schema） → shared/types/contracts に一本化

tools/codegen/* から出力 → core/app/tests が共有参照

13) 導入手順（5分版）

最小構成だけ作る（本セクション3のツリー）

npm init -y && npm i -D typescript vitest playwright（必要な範囲で）

profiles.json を置き、npm run init:profile -- minimal

CI に check:unused と test/test:e2e を登録

追加が必要になったら その時だけ app/server/ や functions/ を生成

14) 付録
14.1 dependency-cruiser（境界違反の最小ルール）
// .dependency-cruiser.cjs
module.exports = {
  forbidden: [
    { name: 'no-core-to-app', from: { path: '^core' }, to: { path: '^app' } },
    { name: 'no-core-to-node', from: { path: '^core' }, to: { pathNot: '^shared|^core' } }
  ],
  options: { doNotFollow: { path: 'node_modules' } }
};

14.2 tsconfig.paths（例）
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@core/*": ["core/*"],
      "@shared/*": ["shared/*"],
      "@web/*": ["app/web/src/*"]
    }
  }
}