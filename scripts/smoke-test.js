import { spawn } from "node:child_process";
import process from "node:process";

const baseUrl = "http://127.0.0.1:3000";
const server = spawn(process.execPath, ["src/server.js"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"]
});

let startupOutput = "";

server.stdout.on("data", (chunk) => {
  startupOutput += chunk.toString();
});

server.stderr.on("data", (chunk) => {
  startupOutput += chunk.toString();
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Server exited early.\n${startupOutput}`);
    }

    try {
      const response = await fetch(`${baseUrl}/login`, { redirect: "manual" });
      if (response.ok) return;
    } catch {
      await delay(500);
    }
  }

  throw new Error(`Server did not become ready.\n${startupOutput}`);
}

function extractCookie(response) {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) {
    throw new Error("Login response did not include a session cookie.");
  }
  return setCookie.split(";")[0];
}

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    ...options
  });
}

async function main() {
  await waitForServer();

  const loginPage = await request("/login");
  if (!loginPage.ok) {
    throw new Error(`GET /login returned ${loginPage.status}.`);
  }

  const loginResponse = await request("/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: "admin", password: "admin123" }).toString()
  });

  if (loginResponse.status !== 302) {
    throw new Error(`POST /login returned ${loginResponse.status} instead of 302.`);
  }

  const cookie = extractCookie(loginResponse);
  const authenticatedPaths = ["/", "/inventory", "/sales", "/reports", "/best-selling", "/settings"];

  for (const path of authenticatedPaths) {
    const response = await request(path, { headers: { Cookie: cookie } });
    if (!response.ok) {
      throw new Error(`${path} returned ${response.status}.`);
    }
  }

  const inventoryCsv = await request("/settings/export/inventory.csv", { headers: { Cookie: cookie } });
  if (!inventoryCsv.ok) {
    throw new Error(`/settings/export/inventory.csv returned ${inventoryCsv.status}.`);
  }

  const salesCsv = await request("/settings/export/sales.csv", { headers: { Cookie: cookie } });
  if (!salesCsv.ok) {
    throw new Error(`/settings/export/sales.csv returned ${salesCsv.status}.`);
  }

  console.log("Smoke test passed.");
}

try {
  await main();
} finally {
  server.kill("SIGTERM");
}
