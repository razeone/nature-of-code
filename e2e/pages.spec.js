import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'index',  path: '/index.html' },
  { name: 'week0',  path: '/src/week0/index.html' },
  { name: 'week1',  path: '/src/week1/index.html' },
  { name: 'week2',  path: '/src/week2/index.html' },
  { name: 'week3',  path: '/src/week3/index.html' },
  { name: 'week4',  path: '/src/week4/index.html' },
  { name: 'week5',  path: '/src/week5/index.html' },
  { name: 'week6',  path: '/src/week6/index.html' },
];

for (const page of PAGES) {
  test(`${page.name} loads without console errors`, async ({ page: pw }) => {
    const consoleErrors = [];
    const pageErrors = [];

    pw.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    pw.on('pageerror', (err) => {
      pageErrors.push(`${err.name}: ${err.message}`);
    });

    await pw.goto(page.path, { waitUntil: 'load' });
    // Give the sketch a moment to call setup() and run a few draw() ticks
    await pw.waitForTimeout(1500);

    // Save a screenshot artifact for visual review
    await pw.screenshot({ path: `e2e/__screenshots__/${page.name}.png`, fullPage: true });

    expect(pageErrors, `Uncaught page errors:\n${pageErrors.join('\n')}`).toEqual([]);
    expect(
      consoleErrors,
      `Console errors:\n${consoleErrors.join('\n')}`,
    ).toEqual([]);
  });
}
