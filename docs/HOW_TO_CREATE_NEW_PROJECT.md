# 🚀 v2テンプレートを使った新規プロジェクト作成手順

## 📋 概要

このv2テンプレートを使って実際のプロジェクトを作成する手順をまとめました。  
例として **ToDoアプリ** を作成する場合の具体的な流れを示します。

---

## 🎯 Step 1: プロジェクトコピーと初期設定

### 1-1. テンプレートをコピー
```bash
# テンプレートを新しい場所にコピー
cp -r "C:\Users\user\Desktop\work\90_cc\20250817\0000-00-00-project-template" "C:\Users\user\Desktop\work\90_cc\my-todo-app"

cd "C:\Users\user\Desktop\work\90_cc\my-todo-app"
```

### 1-2. プロジェクト設定を更新
```bash
# package.jsonを編集（プロジェクト名、説明、リポジトリURL等）
# Git履歴をリセット
rm -rf .git
git init
git add .
git commit -m "Initial commit: v2 template setup"
```

### 1-3. 依存関係インストール
```bash
npm install
```

---

## 🔧 Step 2: プロファイル選択と環境確認

### 2-1. プロファイル選択（例：minimal）
```bash
# 既に適用済みの場合はスキップ可能
npm run init:profile -- minimal
```

### 2-2. 動作確認
```bash
# 開発サーバー起動
npm run dev  # → http://localhost:3000 で確認

# テスト実行
npm test     # → 既存テストが通ることを確認
npm run test:e2e  # → E2Eテストが通ることを確認
```

---

## 🏗️ Step 3: ドメインロジック実装

### 3-1. ドメイン型定義
```typescript
// core/types/index.ts に追加
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoFilter {
  status: 'all' | 'active' | 'completed';
  search?: string;
}
```

### 3-2. ドメインロジック実装
```typescript
// core/domain/todo.ts を新規作成
export function createTodo(title: string): Todo {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: new Date()
  };
}

export function toggleTodo(todo: Todo): Todo {
  return { ...todo, completed: !todo.completed };
}
```

### 3-3. ユースケース実装
```typescript
// core/usecases/todoManagement.ts を新規作成
export class TodoService {
  private todos: Todo[] = [];

  addTodo(title: string): Todo {
    const todo = createTodo(title);
    this.todos.push(todo);
    return todo;
  }

  toggleTodo(id: string): Todo | null {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return null;
    
    const updated = toggleTodo(todo);
    this.todos = this.todos.map(t => t.id === id ? updated : t);
    return updated;
  }
}
```

---

## 🎨 Step 4: UI実装

### 4-1. コンポーネント作成
```typescript
// app/web/src/components/TodoItem.tsx
import React from 'react';
import type { Todo } from '@core/types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
}

export function TodoItem({ todo, onToggle }: Props) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.title}</span>
    </div>
  );
}
```

### 4-2. メインページ更新
```typescript
// app/web/src/pages/HomePage.tsx を更新
import React, { useState } from 'react';
import { TodoService } from '@core/usecases/todoManagement';
import { TodoItem } from '../components/TodoItem';

const todoService = new TodoService();

export function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');

  const addTodo = () => {
    if (newTitle.trim()) {
      todoService.addTodo(newTitle);
      setTodos([...todoService.getTodos()]);
      setNewTitle('');
    }
  };

  const toggleTodo = (id: string) => {
    todoService.toggleTodo(id);
    setTodos([...todoService.getTodos()]);
  };

  return (
    <div>
      <h1>My Todo App</h1>
      <div>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="新しいタスク"
        />
        <button onClick={addTodo}>追加</button>
      </div>
      <div>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🧪 Step 5: テスト追加

### 5-1. ドメインロジックテスト
```typescript
// tests/unit/core/todo.test.ts を新規作成
import { describe, it, expect } from 'vitest';
import { createTodo, toggleTodo } from '@core/domain/todo';

describe('Todo Domain', () => {
  it('should create todo with correct properties', () => {
    const todo = createTodo('Test task');
    expect(todo.title).toBe('Test task');
    expect(todo.completed).toBe(false);
    expect(todo.id).toBeDefined();
  });

  it('should toggle todo completion status', () => {
    const todo = createTodo('Test task');
    const toggled = toggleTodo(todo);
    expect(toggled.completed).toBe(true);
  });
});
```

### 5-2. E2Eテスト更新
```typescript
// tests/e2e/basic.spec.ts を更新
import { test, expect } from '@playwright/test';

test('todo app basic functionality', async ({ page }) => {
  await page.goto('/');
  
  // タイトル確認
  await expect(page).toHaveTitle(/Todo/);
  
  // 新しいタスク追加
  await page.fill('input[placeholder="新しいタスク"]', 'テストタスク');
  await page.click('button:has-text("追加")');
  
  // タスクが表示されることを確認
  await expect(page.locator('.todo-item')).toContainText('テストタスク');
  
  // チェックボックスをクリックして完了状態にする
  await page.click('input[type="checkbox"]');
  await expect(page.locator('.todo-item.completed')).toBeVisible();
});
```

---

## ✅ Step 6: 品質確認と最終調整

### 6-1. 全テスト実行
```bash
npm test        # → 単体テスト
npm run test:e2e # → E2Eテスト
```

### 6-2. 品質チェック
```bash
npm run check:unused  # → 未使用コード検知
npm run lint         # → コード品質チェック
npx tsc --noEmit     # → 型エラーチェック
```

### 6-3. 動作確認
```bash
npm run dev     # → 開発サーバーで動作確認
npm run build   # → プロダクションビルド確認
```

---

## 🚀 Step 7: デプロイ準備（オプション）

### 7-1. GitHub Pages向け
```bash
# dist/にビルド
npm run build

# GitHub Pagesにデプロイ
# (GitHub Actionsやgh-pagesを使用)
```

### 7-2. Vercel/Netlify向け
```bash
# package.jsonのbuildコマンドが既に設定済み
# 各サービスでリポジトリを連携するだけ
```

---

## 💡 開発のコツ

### ✅ **推奨開発順序**
1. **型定義** → **ドメインロジック** → **ユースケース** → **UI** → **テスト**
2. **core/** から始めて、外側に向かって実装
3. 各ステップで `npm test` を実行して品質維持

### ✅ **v2テンプレートの活用ポイント**
- `@core/*` エイリアスでビジネスロジックを分離
- `@shared/*` で共通ユーティリティを活用
- プロファイル切り替えで他の構成にも対応可能

### ✅ **拡張時の注意**
- 新しい依存関係は `npm run check:unused` で監視
- boundary違反は `.dependency-cruiser.cjs` で自動検知
- E2Eテストは主要動線のみに絞る

---

**作成日**: 2025-08-19  
**対象**: v2テンプレート使用時の実践的開発手順  
**想定時間**: 初回セットアップ30分 + 機能実装2-4時間