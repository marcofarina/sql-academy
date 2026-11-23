/** Percorsi principali del portale con servizi esterni isolati. */
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') return route.continue();
    if (url.pathname.includes('classifica')) return route.fulfill({ json: { entries: [] } });
    return route.fulfill({ status: 404, body: '' });
  });
});

for (const [id, title, table] of [['star-wars', 'Star Wars', 'pianeti'], ['lotr', 'Il Signore degli Anelli', 'personaggi']]) {
  test(`home e sandbox: ${title}`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: `Apri la scheda di ${title}` }).click();
    await page.getByRole('link', { name: 'Entra' }).click();
    await expect(page).toHaveURL(new RegExp(`#/${id}/sandbox`));
    const editor = page.getByRole('textbox', { name: 'Query SQL' });
    await editor.fill(`SELECT * FROM ${table}`);
    await page.getByRole('button', { name: 'Esegui', exact: true }).click();
    await expect(page.locator('table').first()).toBeVisible();
  });
}

test('risposta errata, risultato corretto e suggerimenti', async ({ page }) => {
  await page.goto('/#/star-wars/addestramento/ex-001');
  const editor = page.getByRole('textbox', { name: 'La tua risposta' });
  await editor.fill('SELECT nome FROM pianeti');
  await page.getByRole('button', { name: 'Verifica' }).click();
  await expect(page.getByText('Non ancora', { exact: true })).toBeVisible();
  await editor.fill('SELECT * FROM pianeti');
  await page.getByRole('button', { name: 'Verifica' }).click();
  await expect(page.getByText(/Hai guadagnato 10 punti/).first()).toBeVisible();
  await page.goto('/#/star-wars/addestramento/ex-002');
  await page.getByRole('button', { name: /Mostra un suggerimento/ }).click();
  await expect(page.getByRole('button', { name: /Mostra il suggerimento successivo.*punti/ })).toBeEnabled();
  await page.getByRole('button', { name: /Mostra il suggerimento successivo/ }).click();
  await expect(page.getByRole('img', { name: 'Punti: 7' })).toBeVisible();
  await expect(page.getByText(/Dopo SELECT le colonne/)).toBeVisible();
});

test('sessione riprendibile', async ({ page }) => {
  await page.goto('/#/star-wars/addestramento/sessione');
  await page.getByRole('button', { name: 'Avvia la sessione' }).click();
  await expect(page.getByRole('textbox', { name: 'La tua risposta' })).toBeVisible();
  await page.goto('/');
  await page.goto('/#/star-wars/addestramento/sessione');
  await page.getByRole('button', { name: 'Riprendi la sessione' }).click();
  await expect(page.getByRole('textbox', { name: 'La tua risposta' })).toBeVisible();
});

test('barra e ritorno da zaino e classifica', async ({ page }) => {
  await page.goto('/#/star-wars/sandbox');
  await page.getByRole('link', { name: /Zaino/ }).first().click();
  await expect(page.getByRole('link', { name: /Torna a/ })).toBeVisible();
  await page.getByRole('link', { name: /Torna a/ }).click();
  await page.getByRole('link', { name: 'Classifica', exact: true }).first().click();
  await expect(page.getByRole('link', { name: /Torna a/ })).toBeVisible();
});

test('creazione dello zaino e classifica con servizi simulati', async ({ page }) => {
  let writes = 0;
  await page.route('https://zaino.rainbowbits.cloud/**', async (route) => {
    if (route.request().method() === 'PUT') {
      writes += 1;
      await route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*', 'access-control-expose-headers': 'ETag', etag: '"1"' }, body: '' });
    } else if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, PUT, OPTIONS', 'access-control-allow-headers': '*' } });
    } else {
      await route.fulfill({ status: 404, headers: { 'access-control-allow-origin': '*' } });
    }
  });
  await page.goto('/#/zaino');
  await page.getByRole('button', { name: 'Crea uno zaino' }).click();
  await page.getByLabel(/Ho capito/).check();
  await page.getByRole('button', { name: 'Mostra le parole' }).click();
  const words = await page.locator('.zaino-codice-parole li').allTextContents();
  await page.getByRole('button', { name: 'Le ho salvate' }).click();
  for (let i = 0; i < 4; i++) await page.getByRole('combobox').nth(i).fill(words[i].replace(/^\d+/, '').trim());
  await page.getByRole('button', { name: 'Crea lo zaino', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Il tuo zaino è pronto' })).toBeVisible();
  expect(writes).toBeGreaterThan(0);
  await page.goto('/#/classifica');
  await expect(page.getByText(/Nessuno ha ancora punti nella classifica generale/)).toBeVisible();
});
