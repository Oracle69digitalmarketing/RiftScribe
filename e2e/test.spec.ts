import { test, expect } from '@playwright/test';

test('RiftScribe E2E Test', async ({ page }) => {
  await page.goto('http://localhost:3001');

  // Fill in the summoner name
  await page.fill('#summonerName', 'PlayerOne');

  // Select a persona
  await page.click('text=Bard, the Wandering Caretaker');

  // Click the "Forge My Saga" button
  await page.click('text=Forge My Saga');

  // Wait for the saga to be generated and displayed
  await page.waitForSelector('text=The Saga of PlayerOne', { timeout: 60000 });

  // Verify that the saga title is displayed
  expect(await page.textContent('h2')).not.toBeNull();

  // Verify that at least one chapter is displayed
  expect(await page.textContent('text=Chapter 1')).not.toBeNull();
});
