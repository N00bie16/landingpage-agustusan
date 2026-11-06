import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage displays competitions", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("Pilih cabang lombamu dan Daftar sekarang!"),
  ).toBeVisible();
  await expect(page.getByText("Daftar Balap Karung")).toBeVisible();
  await expect(page.getByText("Daftar Tarik Tambang")).toBeVisible();
});

test("participant can open a registration form", async ({ page }) => {
  await page.goto("/");

  await page.getByText("Daftar Balap Karung").click();

  await expect(page.getByRole("heading", { name: "Pendaftaran Lomba" })).toBeVisible();
  await expect(page.getByText("Balap Karung", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Nama Lengkap")).toBeVisible();
  await expect(page.getByLabel("Usia (Tahun)")).toBeVisible();
});

test("registration form closes with Escape and validates age", async ({ page }) => {
  await page.goto("/");

  await page.getByText("Daftar Balap Karung").click();
  await page.getByLabel("Usia (Tahun)").fill("16");
  await page.getByLabel("Nama Lengkap").fill("Peserta Test");
  await page.getByLabel("Nomor WhatsApp/HP").fill("081234567890");
  await page.getByLabel("Alamat").fill("Alamat Test");
  await page.getByRole("button", { name: "Daftar Sekarang" }).click();

  await expect(page.getByRole("alert")).toContainText(
    "khusus untuk usia 7 - 15 tahun",
  );

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("Tari-tarian requires and accepts an audio file", async ({ page }) => {
  await page.route("https://script.google.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/plain",
      body: "ok",
    });
  });

  await page.goto("/");
  await page.getByText("Daftar Tari-tarian").click();

  const audioInput = page.getByLabel("Upload Audio/Musik Tarian (Maks 10MB)");
  await expect(audioInput).toBeVisible();
  await expect(audioInput).toHaveAttribute("accept", "audio/*");

  await page.getByLabel("Nama Lengkap").fill("Peserta Tari");
  await page.getByLabel("Nomor WhatsApp/HP").fill("081234567890");
  await page.getByLabel("Alamat").fill("Alamat Peserta Tari");
  await page.getByLabel("Usia (Tahun)").fill("12");

  await page.getByRole("button", { name: "Daftar Sekarang" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Harap unggah file audio/lagu tari-tariannya",
  );

  await audioInput.setInputFiles({
    name: "lagu-tarian.mp3",
    mimeType: "audio/mpeg",
    buffer: Buffer.from("test audio file"),
  });

  await expect(audioInput).toHaveValue(/lagu-tarian\.mp3$/);
  await page.getByRole("button", { name: "Daftar Sekarang" }).click();

  await expect(page.getByRole("status")).toContainText(
    "Berhasil! Pendaftaran kamu sudah terdata.",
  );
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("homepage passes automated accessibility checks", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(600);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("registration dialog supports keyboard focus and traps Tab", async ({ page }) => {
  await page.goto("/");

  const balapCard = page.getByRole("button", {
    name: /Daftar Balap Karung/,
  });
  await balapCard.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByLabel("Nama Lengkap")).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Tutup formulir pendaftaran" }),
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(balapCard).toBeFocused();
});

test("registration dialog passes automated accessibility checks", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", {
    name: /Daftar Balap Karung/,
  }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.waitForTimeout(600);

  const results = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .analyze();
  expect(results.violations).toEqual([]);
});
