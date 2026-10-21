/**
 * ONE-TIME build-side voice generation. NOT a runtime dependency.
 *
 * Pipes each lesson card's text through Piper (rhasspy/piper) — a local,
 * offline neural TTS engine with genuinely natural voices — and compresses
 * to MP3 via ffmpeg. Files are bundled under /public/voice, so the app at
 * runtime serves plain static audio: no cloud calls, no API keys, no paid
 * service at build OR run time.
 *
 * Voice: en_US-amy-medium (Rhasspy Piper, MIT-licensed ONNX model,
 * downloaded to tools/piper — never distribute the 60MB model in the repo,
 * only its outputs).
 *
 * Honest note (docs/limitations.md): this is a natural STOCK voice, not a
 * clone of a specific real person. Cloning a real person requires that
 * person's consent and a licensed pipeline; we will not do it otherwise.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildPoints } from "../src/lib/domain/points";
import { lessons } from "../src/content/lessons";

const PIPER = resolve("tools/piper/app/piper/piper.exe");
const MODEL = resolve("tools/piper/en_US-amy-medium.onnx");
const FFMPEG = "ffmpeg";
const OUT_ROOT = "public/voice";

function cleanForSpeech(text: string): string {
  return text
    .replace(/…/g, ".")
    .replace(/\*/g, "")
    .replace(/→/g, " to ")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[–—]/g, ", ");
}

import type { Lesson } from "../src/content/schema";
let lesson: Lesson;

function wavSeconds(wavPath: string): number {
  // 16-bit mono 22050 Hz PCM -> bytes / (2 * 22050)
  return Math.max(1, Math.round(statSync(wavPath).size / 44100));
}

function spokenText(i: number): string {
  const points = buildPoints(lesson);
  const point = points[i];
  if (point.isSummary) {
    const bullets = point.bullets?.map((b) => cleanForSpeech(b)).join(". ") ?? "";
    const disclaimer = point.disclaimer ? ` ${cleanForSpeech(point.disclaimer)}` : "";
    return `To sum up this lesson. ${bullets}.${disclaimer}`;
  }
  const rest = point.rest ? cleanForSpeech(point.rest) : "";
  const example = point.example ? ` For example. ${cleanForSpeech(point.example)}` : "";
  return `${cleanForSpeech(point.key)} ${rest}${example}`.trim();
}

async function main() {
  if (!existsSync(PIPER) || !existsSync(MODEL)) {
    console.error("Piper binary/model missing — see docs/research.md §11 for setup.");
    process.exit(1);
  }

  const only = process.argv[2];
  let written = 0;

  for (const l of lessons) {
    lesson = l;
    if (only && l.id !== only) continue;
    const dir = join(OUT_ROOT, l.id);
    mkdirSync(dir, { recursive: true });

    const points = buildPoints(l);
    for (let i = 0; i < points.length; i++) {
      const mp3 = join(dir, `${i}.mp3`);
      const wav = join(dir, `${i}.wav`);
      const text = spokenText(i);

      // Piper reads text on stdin; output WAV, then compress to mono MP3.
      execFileSync(PIPER, ["-m", MODEL, "-f", wav, "--length-scale", "1.05", "-q"], {
        input: text,
        encoding: "utf8",
      });
      spawnSync(FFMPEG, ["-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-b:a", "96k", mp3], {
        stdio: "ignore",
      });
      rmSync(wav, { force: true });

      written++;
      console.log(`${l.id}/${i}.mp3  ~${wavSeconds(mp3)}s  ${points[i].heading}`);
    }
  }
  console.log(`DONE — ${written} MP3 files in ${OUT_ROOT}`);
}

main();
