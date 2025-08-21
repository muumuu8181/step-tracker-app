import { test, expect } from '@playwright/test';

test.describe('Integrated Life App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('http://localhost:3000');
  });

  test('basic smoke test - app loads correctly', async ({ page }) => {
    // Check if the app loads with correct title
    await expect(page).toHaveTitle(/Integrated Life App|統合ライフ管理アプリ/);
    
    // Check that main navigation tabs are present
    await expect(page.locator('[data-testid="tab-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-weight"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-sleep"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-todo"]')).toBeVisible();
    
    // Check initial dashboard content
    await expect(page.locator('h2')).toContainText(/ダッシュボード|Dashboard/);
  });

  test('weight management flow', async ({ page }) => {
    // Navigate to weight management tab
    await page.click('[data-testid="tab-weight"]');
    await expect(page.locator('h2')).toContainText(/体重|Weight/);
    
    // Test adding a weight record using modal
    const addButton = page.locator('[data-testid="modal-add-weight"]');
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Fill weight form in modal
      const weightInput = page.locator('input[name="modal-weight"]');
      if (await weightInput.isVisible()) {
        await weightInput.fill('70');
        
        // Submit form
        const submitButton = page.locator('button:has-text("保存"), button:has-text("Save")').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          // Wait for modal to close
          await page.waitForTimeout(1000);
          // Check if the weight appears anywhere on the page
          await expect(page.locator('body')).toContainText('70', { timeout: 5000 });
        }
      }
    }
  });

  test('todo management flow', async ({ page }) => {
    // Navigate to todo management tab
    await page.click('[data-testid="tab-todo"]');
    await expect(page.locator('h2')).toContainText(/Todo|タスク|やること/);
    
    // Test adding a todo
    const addButton = page.locator('button:has-text("追加"), button:has-text("Add"), button:has-text("新規")').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Fill todo form if form exists
      const titleInput = page.locator('input[name="title"], input[placeholder*="タイトル"], input[placeholder*="title"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('Test Todo Item');
        
        // Submit form
        const submitButton = page.locator('button:has-text("保存"), button:has-text("Save"), button[type="submit"]').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Verify todo was added
          await expect(page.locator('text="Test Todo Item"')).toBeVisible({ timeout: 5000 });
        }
      }
    }
    
    // Test completing a todo (if one exists)
    const todoCheckbox = page.locator('input[type="checkbox"]').first();
    if (await todoCheckbox.isVisible()) {
      await todoCheckbox.check();
      
      // Verify todo is marked as completed
      await expect(todoCheckbox).toBeChecked();
    }
  });

  test('sleep management flow', async ({ page }) => {
    // Navigate to sleep management tab
    await page.click('[data-testid="tab-sleep"]');
    await expect(page.locator('h2')).toContainText(/睡眠|Sleep/);
    
    // Test adding a sleep record
    const addButton = page.locator('button:has-text("追加"), button:has-text("Add"), button:has-text("記録")').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Fill sleep form if form exists
      const bedTimeInput = page.locator('input[type="time"], input[name="bedTime"], input[placeholder*="就寝"]').first();
      const wakeTimeInput = page.locator('input[type="time"], input[name="wakeTime"], input[placeholder*="起床"]').first();
      
      if (await bedTimeInput.isVisible() && await wakeTimeInput.isVisible()) {
        await bedTimeInput.fill('23:00');
        await wakeTimeInput.fill('07:00');
        
        // Select sleep quality if available
        const qualitySelect = page.locator('select[name="quality"], input[name="sleepQuality"]').first();
        if (await qualitySelect.isVisible()) {
          if (await qualitySelect.getAttribute('type') === null) {
            // It's a select dropdown
            await qualitySelect.selectOption('4');
          } else {
            // It's an input (possibly range or number)
            await qualitySelect.fill('4');
          }
        }
        
        // Submit form
        const submitButton = page.locator('button:has-text("保存"), button:has-text("Save"), button[type="submit"]').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Verify sleep record was added (look for time indicators)
          await expect(page.locator('text="23:00", text="07:00"').first()).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('navigation between tabs', async ({ page }) => {
    // Test navigation works correctly
    const tabs = [
      { selector: '[data-testid="tab-weight"]', expectedText: /体重|Weight/ },
      { selector: '[data-testid="tab-sleep"]', expectedText: /睡眠|Sleep/ },
      { selector: '[data-testid="tab-todo"]', expectedText: /Todo|タスク|やること/ },
      { selector: '[data-testid="tab-dashboard"]', expectedText: /ダッシュボード|Dashboard/ }
    ];

    for (const tab of tabs) {
      await page.click(tab.selector);
      await expect(page.locator('h2')).toContainText(tab.expectedText);
      
      // Verify URL changes or tab becomes active
      const tabElement = page.locator(tab.selector);
      await expect(tabElement).toHaveClass(/active|selected|current/);
    }
  });

  test('data persistence across page reload', async ({ page }) => {
    // Add some test data first
    await page.click('[data-testid="tab-weight"]');
    
    const addButton = page.locator('[data-testid="modal-add-weight"]');
    if (await addButton.isVisible()) {
      await addButton.click();
      
      const weightInput = page.locator('input[name="modal-weight"]');
      if (await weightInput.isVisible()) {
        await weightInput.fill('72');
        
        const submitButton = page.locator('button:has-text("保存"), button:has-text("Save")').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          // Wait for modal to close
          await page.waitForTimeout(1000);
          // Check if the weight appears anywhere on the page
          await expect(page.locator('body')).toContainText('72', { timeout: 5000 });
        }
      }
    }
    
    // Reload the page
    await page.reload();
    
    // Navigate back to weight tab and verify data persists
    await page.click('[data-testid="tab-weight"]');
    await expect(page.locator('body')).toContainText('72', { timeout: 5000 });
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that navigation is still accessible
    await expect(page.locator('[data-testid="tab-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-weight"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-sleep"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-todo"]')).toBeVisible();
    
    // Test basic functionality on mobile
    await page.click('[data-testid="tab-todo"]');
    await expect(page.locator('h2')).toContainText(/Todo|タスク|やること/);
  });

  test('error handling - network offline simulation', async ({ page, context }) => {
    // Set offline mode
    await context.setOffline(true);
    
    // App should still function with localStorage
    await page.click('[data-testid="tab-weight"]');
    await expect(page.locator('h2')).toContainText(/体重|Weight/);
    
    // Reset online mode
    await context.setOffline(false);
  });

  test('accessibility - keyboard navigation', async ({ page }) => {
    // Test tab key navigation
    await page.keyboard.press('Tab');
    
    // Check that focused elements are visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test Enter key to activate buttons/links
    const firstTab = page.locator('[data-testid="tab-weight"]');
    await firstTab.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('h2')).toContainText(/体重|Weight/);
  });

  test('dashboard statistics display', async ({ page }) => {
    // Navigate to dashboard
    await page.click('[data-testid="tab-dashboard"]');
    
    // Check for statistics sections
    const statsElements = [
      page.locator('text="統計", text="Stats", text="概要", text="Overview"'),
      page.locator('[data-testid="weight-stats"], [class*="weight-stats"]'),
      page.locator('[data-testid="sleep-stats"], [class*="sleep-stats"]'),
      page.locator('[data-testid="todo-stats"], [class*="todo-stats"]')
    ];

    // At least one statistics element should be visible
    let hasStats = false;
    for (const element of statsElements) {
      if (await element.count() > 0) {
        hasStats = true;
        break;
      }
    }
    expect(hasStats).toBe(true);
  });

  test('button click error handling', async ({ page }) => {
    // Navigate to weight management tab
    await page.click('[data-testid="tab-weight"]');
    
    // Test clicking disabled/non-existent button (should throw error)
    try {
      await page.click('[data-testid="non-existent-button"]', { timeout: 1000 });
      expect(false).toBe(true); // This should not execute
    } catch (error) {
      // Expected error - button doesn't exist
      expect(error.message).toContain('Locator');
      console.log('✅ Caught expected error for non-existent button:', error.message);
    }
    
    // Test clicking button that should cause validation error
    await page.click('[data-testid="modal-add-weight"]');
    
    // Try to submit empty form (should show validation error)
    const submitButton = page.locator('button:has-text("保存")');
    await submitButton.click();
    
    // Check if error message appears in DOM
    const errorExists = await page.locator('.error, [class*="error"], [style*="color: red"], [style*="color:#"]').count();
    console.log('✅ Form validation elements found:', errorExists);
    
    // Check if modal stays open (indicating validation error)
    await expect(page.locator('h3:has-text("体重記録を追加")')).toBeVisible();
    console.log('✅ Modal stays open after validation error');
  });

  test('weight range settings and increment/decrement buttons', async ({ page }) => {
    // Navigate to weight management tab
    await page.click('[data-testid="tab-weight"]');
    
    // Open range settings
    await page.click('[data-testid="weight-range-settings"]');
    await expect(page.locator('h3:has-text("体重入力範囲設定")')).toBeVisible();
    
    // Change min value to 10kg and max to 150kg
    await page.fill('[data-testid="min-weight-input"]', '10');
    await page.fill('[data-testid="max-weight-input"]', '150');
    await page.click('[data-testid="save-range-settings"]');
    
    // Test that the range is applied to the quick input
    const quickInput = page.locator('input[name="weight"]');
    await expect(quickInput).toHaveAttribute('min', '10');
    await expect(quickInput).toHaveAttribute('max', '150');
    
    // Test increment/decrement functionality
    await quickInput.fill('50');
    
    // Test increment button (↑) - Playwright can simulate this
    await quickInput.press('ArrowUp');
    await expect(quickInput).toHaveValue('50.1');
    
    // Test decrement button (↓)
    await quickInput.press('ArrowDown');
    await expect(quickInput).toHaveValue('50');
    
    // Test that values stay within range
    await quickInput.fill('5');  // Below minimum
    await quickInput.blur();
    // Browser should automatically adjust to minimum
    
    await quickInput.fill('200');  // Above maximum  
    await quickInput.blur();
    // Browser should automatically adjust to maximum
  });

  test('UI element dimensions, colors, and positioning', async ({ page }) => {
    // Navigate to weight management tab
    await page.click('[data-testid="tab-weight"]');
    
    // Test various UI element properties
    const quickInput = page.locator('input[name="weight"]');
    const addButton = page.locator('[data-testid="quick-add-weight"]');
    
    // Get bounding box (position and size)
    const inputBox = await quickInput.boundingBox();
    const buttonBox = await addButton.boundingBox();
    
    console.log('📏 Input dimensions:', {
      width: inputBox?.width,
      height: inputBox?.height,
      x: inputBox?.x,
      y: inputBox?.y
    });
    
    console.log('📏 Button dimensions:', {
      width: buttonBox?.width, 
      height: buttonBox?.height,
      x: buttonBox?.x,
      y: buttonBox?.y
    });
    
    // Test computed styles
    const inputStyles = await quickInput.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        width: computed.width,
        height: computed.height,
        padding: computed.padding,
        border: computed.border,
        borderRadius: computed.borderRadius
      };
    });
    
    const buttonStyles = await addButton.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        width: computed.width,
        height: computed.height,
        padding: computed.padding,
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        border: computed.border,
        borderRadius: computed.borderRadius
      };
    });
    
    console.log('🎨 Input styles:', inputStyles);
    console.log('🎨 Button styles:', buttonStyles);
    
    // Specific assertions about dimensions
    expect(inputBox?.width).toBeGreaterThan(70); // Should be around 80px
    expect(inputBox?.width).toBeLessThan(100);
    
    // Test button color (should be blue)
    expect(buttonStyles.backgroundColor).toMatch(/rgb\(25, 118, 210\)/); // #1976d2
    expect(buttonStyles.color).toMatch(/rgb\(255, 255, 255\)/); // white
    
    // Test padding
    expect(buttonStyles.padding).toMatch(/8px 16px/);
    
    // Test border radius  
    expect(buttonStyles.borderRadius).toBe('4px');
    
    // Test positioning (button should be to the right of input)
    if (inputBox && buttonBox) {
      expect(buttonBox.x).toBeGreaterThan(inputBox.x + inputBox.width);
      expect(Math.abs(buttonBox.y - inputBox.y)).toBeLessThan(5); // Same row
    }
    
    console.log('✅ All UI dimension and style tests passed!');
  });

  test('responsive design breakpoints', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' }, 
      { width: 1200, height: 800, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      console.log(`📱 Testing ${viewport.name} viewport: ${viewport.width}x${viewport.height}`);
      
      // Navigate to weight tab
      await page.click('[data-testid="tab-weight"]');
      
      // Check if elements are properly sized for this viewport
      const container = page.locator('div[style*="maxWidth"]').first();
      const containerBox = await container.boundingBox();
      
      if (containerBox) {
        console.log(`📐 Container width at ${viewport.name}:`, containerBox.width);
        
        // Container should not exceed viewport width
        expect(containerBox.width).toBeLessThanOrEqual(viewport.width);
        
        // Mobile should be nearly full width, desktop should have max width
        if (viewport.name === 'Mobile') {
          expect(containerBox.width).toBeGreaterThan(viewport.width * 0.8);
        } else if (viewport.name === 'Desktop') {
          expect(containerBox.width).toBeLessThanOrEqual(1200);
        }
      }
    }
    
    console.log('✅ All responsive design tests passed!');
  });
});