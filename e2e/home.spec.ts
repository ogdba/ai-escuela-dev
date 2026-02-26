import { test, expect } from "@playwright/test";
import { spawnSync } from "node:child_process";

const canBind = (() => {
  const probe = spawnSync("node", [
    "-e",
    "const server=require('net').createServer();server.listen(0,'127.0.0.1',()=>{server.close();}).on('error',()=>process.exit(1));",
  ]);
  return probe.status === 0;
})();

test.skip(!canBind, "No se permite abrir puertos en este entorno; se omite smoke e2e.");

test("homepage renders key sections", async ({ page }) => {
  await page.goto("/");

  // Demo sandbox interaction
  const demo = page.locator("#demo");
  await expect(demo).toBeVisible();
  await page.getByLabel(/Email/i).fill("demo@iaskool.dev");
  await page.getByLabel(/Password/i).fill("Demo123!");
  await page.getByRole("button", { name: /Iniciar sesión/i }).click();
  await expect(page.getByText(/Acceso concedido/i)).toBeVisible();

  const sections = ["curriculum", "modules", "labs", "security", "pricing", "faq", "contact"];
  for (const id of sections) {
    const locator = page.locator(`#${id}`);
    await expect(locator).toBeVisible();
  }

  await expect(page.getByRole("heading", { name: /^Seguridad OWASP LLM Top 10$/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^Laboratorios gamificados$/i })).toBeVisible();

  // Contact submission happy path
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByLabel(/Nombre completo/i).fill("Playwright Tester");
  await page.getByLabel(/Correo electrónico/i).fill("tester@example.com");
  await page.getByLabel(/Mensaje/i).fill("Quiero más detalles sobre el bootcamp con IA.");
  await page.getByRole("button", { name: /Enviar consulta/i }).click();
  await expect(page.getByText(/Ticket generado/i)).toBeVisible({ timeout: 5000 });
});
