import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('ewfewf');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('fewefwef');

  // page.once('dialog', (dialog) => {
  //   console.log(`Dialog message: ${dialog.message()}`);
  //   dialog.dismiss().catch(() => {});
  // });
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(
    page.getByRole('img', { name: 'Activity indicator' })
  ).toBeVisible();
});
