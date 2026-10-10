import { test, expect } from "@playwright/test";

test("Arabic-first homepage loads without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "خدماتك الحكومية",
  );
  await expect(page.locator(".hero-skyline")).toHaveCSS(
    "background-image",
    /saudi-hero.webp/,
  );
  await expect(page.locator(".step-card")).toHaveCount(6);
  await expect(page.locator(".sector-card")).toHaveCount(4);
  await expect(page.locator(".phone")).toHaveCount(2);
  expect(errors).toEqual([]);
});

test("service search leads to a demo request and modal closes with Escape", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "ابدأ الآن", exact: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox").fill("السجل");
  await dialog
    .getByRole("button", { name: /السجل التجاري قطاع|السجل التجاري التجارة/ })
    .click();
  await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(
    "السجل التجاري",
  );
  await dialog.getByRole("button", { name: "بدء الطلب التجريبي" }).click();
  await expect(dialog.getByText("تم إنشاء طلبك التجريبي")).toBeVisible();
  await expect(dialog.getByText("MYS-2026-001")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("assistant understands Arabic and guides to traffic services", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".request-chips")
    .getByRole("button", { name: "أريد تجديد رخصة القيادة" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator(".chat-message.assistant")).toContainText(
    "الفحص الطبي",
  );
  await dialog
    .getByRole("button", { name: "المرور والمركبات", exact: true })
    .click();
  await expect(page.locator(".sector-filters .selected")).toHaveText(
    "المرور والمركبات",
  );
  await expect(page.locator(".service-results>button")).toHaveCount(5);
});

test("English LTR and cross-language assistant work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Simply smarter.",
  );
  await page.locator(".assistant-input input").fill("كيف أبدأ نشاط تجاري؟");
  await page
    .locator(".assistant-input")
    .getByRole("button", { name: "Send" })
    .click();
  await expect(page.locator(".chat-message.assistant")).toContainText(
    "Commercial Registration",
  );
  await expect(page.locator(".chat-message.assistant")).toContainText(
    "Tax Identification Number",
  );
});

test("demo payments update wallet total and prevent duplicate payment", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#wallet").scrollIntoViewIfNeeded();
  await page
    .locator(".bill")
    .first()
    .getByRole("button", { name: "دفع", exact: true })
    .click();
  await expect(
    page.locator(".bill").first().getByRole("button"),
  ).toBeDisabled();
  await expect(page.locator(".bill").first()).toContainText("تم الدفع");
  await expect(page.locator(".wallet-top strong")).toContainText("٦٥٠");
  await expect(page.getByRole("status")).toContainText(
    "تم تسجيل الدفع التجريبي",
  );
});

test("GovMeet demo joins, toggles controls, shows summary, and leaves", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "جرّب GovMeet AI", exact: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "انضم للجلسة", exact: true })
    .click();
  await expect(
    dialog.getByText("تم الانضمام إلى الجلسة التجريبية"),
  ).toBeVisible();
  await expect(dialog.locator(".demo-notes")).toContainText("الرخصة البلدية");
  await dialog
    .getByRole("button", { name: "تبديل الميكروفون التجريبي" })
    .click();
  await expect(
    dialog.getByRole("button", { name: "تبديل الميكروفون التجريبي" }),
  ).toHaveAttribute("aria-pressed", "false");
  await dialog
    .getByRole("button", { name: "تبديل الكاميرا التجريبية" })
    .click();
  await expect(dialog.locator(".demo-preview")).toHaveClass(/camera-off/);
  await dialog.getByRole("button", { name: "مغادرة", exact: true }).click();
  await expect(
    dialog.getByRole("button", { name: "انضم للجلسة" }),
  ).toBeVisible();
});

test("mobile navigation and both languages fit without horizontal overflow", async ({
  page,
}) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Switch to English" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await expect(page.locator("nav")).toBeVisible();
  await page
    .locator("nav")
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(page.locator("nav")).not.toBeVisible();
  await expect(page).toHaveURL(/#services$/);
});

test("dialog traps keyboard focus and exposes demo privacy notice", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "الخصوصية", exact: true }).click();
  const close = page.getByRole("dialog").getByRole("button", { name: "إغلاق" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await expect(page.getByRole("dialog")).toContainText("لا تُرسل البيانات");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "الخصوصية", exact: true }),
  ).toBeFocused();
});
