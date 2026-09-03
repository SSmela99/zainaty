/**
 * Jednorazowy skrypt: uzyskuje GOOGLE_REFRESH_TOKEN do tworzenia Meetów.
 *
 * Wymaga w .env.local:
 *   GOOGLE_CLIENT_ID=
 *   GOOGLE_CLIENT_SECRET=
 *
 * W Google Cloud (OAuth Client typu „Aplikacja internetowa”) dodaj redirect URI:
 *   http://localhost:3333/oauth2callback
 *
 * Uruchom: npm run google:oauth
 */

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { google } from "googleapis";

const PORT = 3333;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvLocal();

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    console.error(
      "Dodaj GOOGLE_CLIENT_ID i GOOGLE_CLIENT_SECRET do .env.local (OAuth Client).",
    );
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    REDIRECT_URI,
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  const server = createServer(async (req, res) => {
    try {
      if (!req.url?.startsWith("/oauth2callback")) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const url = new URL(req.url, `http://localhost:${PORT}`);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(`OAuth error: ${error}`);
        server.close();
        process.exit(1);
      }

      if (!code) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Brak parametru code");
        return;
      }

      const { tokens } = await oauth2Client.getToken(code);
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        "<h1>OK</h1><p>Możesz zamknąć tę kartę i wrócić do terminala.</p>",
      );

      console.log("\nDodaj do .env.local:\n");
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token ?? ""}`);
      if (!tokens.refresh_token) {
        console.log(
          "\n(Uwaga: Google nie zwróciło refresh_token. Usuń dostęp aplikacji w https://myaccount.google.com/permissions i uruchom skrypt ponownie.)",
        );
      }
      console.log("");

      server.close();
      process.exit(0);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Błąd wymiany kodu");
      server.close();
      process.exit(1);
    }
  });

  server.listen(PORT, () => {
    console.log("\n1) Upewnij się, że w OAuth Client jest redirect URI:");
    console.log(`   ${REDIRECT_URI}`);
    console.log("\n2) Zaloguj się kontem kalendarza (np. pumalol22@gmail.com):");
    console.log(`\n${authUrl}\n`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
