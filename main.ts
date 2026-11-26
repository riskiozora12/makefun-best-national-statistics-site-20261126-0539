// NusaStat — program penyerahan (main.ts).
// Menyalin app/ dan screenshots/ dari repositori ini ke direktori output,
// lalu menulis /output/dossier.json dengan buildDossier dari
// vendor/makefun-frontend.ts (salinan kit, tidak diubah).
// Dijalankan dua kali oleh grader; kedua jalan harus menulis byte yang sama.
// Hanya memakai pustaka standar Node.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const REPO_ROOT = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Batas yang dipakai scorer untuk bounty ini (lihat RULES.txt):
// teks dossier 160 KiB, 4 screenshot @ 256 KiB, app/ 993 file / 16 MiB,
// jalur app/ paling panjang 1000 byte UTF-8.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16 * 1024 * 1024,
  app_path_max_bytes: 1000,
};

function copyDir(name: string): void {
  const src = join(REPO_ROOT, name);
  if (!existsSync(src)) return;
  cpSync(src, join(OUT_DIR, name), { recursive: true });
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });
copyDir("app");
copyDir("screenshots");
writeFileSync(join(OUT_DIR, "dossier.json"), buildDossier(OUT_DIR, CAPS));
