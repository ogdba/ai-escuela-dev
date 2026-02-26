import { defineConfig } from "@playwright/test";
import { spawnSync } from "node:child_process";

const canBind = (() => {
  const probe = spawnSync("node", [
    "-e",
    "const server=require('net').createServer();server.listen(0,'127.0.0.1',()=>{server.close();}).on('error',()=>process.exit(1));",
  ]);
  return probe.status === 0;
})();

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: canBind ? "http://127.0.0.1:3000" : "http://127.0.0.1:0",
    headless: true,
  },
  webServer: canBind
    ? {
        command: "npm run build && npx next start --hostname 127.0.0.1 --port 3000",
        port: 3000,
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      }
    : undefined,
});
