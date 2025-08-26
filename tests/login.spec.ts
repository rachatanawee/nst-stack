import { test, expect } from '@playwright/test';

test('should allow a user to log in', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('test1@test.com');
  await page.getByLabel('Password').fill('12345678');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');
});

test('should show error for incorrect password', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('test1@test.com');
  await page.getByLabel('Password').fill('wrongpassword');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Could not authenticate user: Invalid login credentials')).toBeVisible();
});

test('should show error for non-existent user', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('nonexistent@test.com');
  await page.getByLabel('Password').fill('anypassword');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Could not authenticate user: Invalid login credentials')).toBeVisible();
});

test('should show validation errors for empty fields', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('button', { name: 'Login' }).click();

  // Check for browser's built-in validation messages
  // This might vary based on browser and form implementation
  await expect(page.getByLabel('Email')).toHaveJSProperty('validationMessage', 'Please fill out this field.');
  await expect(page.getByLabel('Password')).toHaveJSProperty('validationMessage', 'Please fill out this field.');
});