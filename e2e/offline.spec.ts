/** Una prima visita prepara entrambi i mondi e lo zaino riparte al ritorno della rete. */
import { test, expect } from '@playwright/test';

test('prima visita, uso senza rete e sincronizzazione al rientro', async ({ context, page }) => {
  let online = true;
  let remote: Buffer | null = null;
  let version = 0;
  const headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, PUT, OPTIONS',
    'access-control-allow-headers': '*',
    'access-control-expose-headers': 'ETag',
  };
  await context.route('https://zaino.rainbowbits.cloud/v1/zaino/**', async (route) => {
    if (!online) return route.abort('internetdisconnected');
    const request = route.request();
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
    if (request.method() === 'PUT') {
      remote = request.postDataBuffer();
      version += 1;
      return route.fulfill({ status: 200, headers: { ...headers, etag: `"${version}"` } });
    }
    return route.fulfill({ status: remote ? 200 : 404, headers: { ...headers, etag: `"${version}"` }, body: remote ?? '' });
  });

  await page.goto('/');
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.evaluate(() => window.__zaino!.crea());
  expect(version).toBe(1);

  online = false;
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Apri la scheda di Star Wars' })).toBeVisible();
  const sandbox = [
    { id: 'star-wars', table: 'pianeti' },
    { id: 'lotr', table: 'personaggi' },
  ];
  for (const { id, table } of sandbox) {
    await page.goto(`/#/${id}/sandbox`);
    await page.getByRole('textbox', { name: 'Query SQL' }).fill(`SELECT * FROM ${table}`);
    await page.getByRole('button', { name: 'Esegui', exact: true }).click();
    await expect(page.locator('table').first()).toBeVisible();
  }

  await page.goto('/#/star-wars/addestramento/ex-001');
  await page.getByRole('textbox', { name: 'La tua risposta' }).fill('SELECT * FROM pianeti');
  await page.getByRole('button', { name: 'Verifica' }).click();
  await expect(page.getByText(/Hai guadagnato 10 punti/).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole('img', { name: 'Punti: 10' })).toBeVisible();
  expect(version).toBe(1);

  online = true;
  await context.setOffline(false);
  await expect.poll(() => version).toBe(2);
  await expect.poll(() => page.evaluate(() => window.__zaino!.stato().inSospeso)).toBe(false);
  const cachedUrls = await page.evaluate(async () => {
    const names = await caches.keys();
    const entries = await Promise.all(names.map(async (name) => (await caches.open(name)).keys()));
    return entries.flat().map(({ url }) => url);
  });
  expect(cachedUrls.some((url) => url.endsWith('.wasm'))).toBe(true);
  expect(cachedUrls.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
});
