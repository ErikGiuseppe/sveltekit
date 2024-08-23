import { test, expect } from '@playwright/test';

test('homepage should load and contain the form', async ({ page }) => {
    await page.goto('http://localhost:4173');

    await page.waitForLoadState('networkidle');

    const title = await page.title();
    ;

    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('input#phone')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
});

test('should complete form, start challenge, navigate to candidate page and back', async ({ page }) => {
    await page.goto('http://localhost:4173');

    await page.waitForLoadState('networkidle');

    await page.fill('input#name', 'John Doe');
    await page.fill('input#phone', '123456789');
    await page.fill('input#email', 'john.doe@example.com');

    await page.click('button:has-text("Iniciar Desafio")');

    await page.waitForSelector('p:text("Tempo restante:")');

    await page.waitForTimeout(3000);

    await page.click('button:has-text("Enviar")');
    const modal = page.locator('div.fixed');
    await expect(modal).toBeVisible();

    const closeButton = modal.locator('button[aria-label="Close"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await modal.waitFor({ state: 'hidden' });

    await expect(modal).toBeHidden();
    await page.click('button:has-text("Ir para Candidato")');

    await page.waitForURL(/candidate/);
    await expect(page).toHaveURL(/candidate/);

    const backButton = page.locator('button:has-text("Voltar ao Desafio")');
    await expect(backButton).toBeVisible();

    await backButton.click();
    await page.waitForURL(/\/$/);
    await expect(page).toHaveURL(/\/$/);
});

