/**
 * Build-side voice generation for MOTION EXPLAINERS (not a runtime
 * dependency). Pipes each scene's script through the offline Piper neural
 * engine and compresses to MP3 via ffmpeg.
 *
 * Outputs (7 files): public/voice/motion/<scene>.mp3
 * Voice: en_US-amy-medium (Piper, MIT) — same warm voice as the cards.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { MOTION } from "../src/components/visual/explainers";

const PIPER = resolve("tools/piper/app/piper/piper.exe");
const MODEL = resolve("tools/piper/en_US-amy-medium.onnx");
const FFMPEG = "ffmpeg";
const OUT = "public/voice/motion";

function cleanForSpeech(text: string): string {
  return text
    .replace(/…/g, ".")
    .replace(/\.\.\./g, " ... ")
    .replace(/["""\u2018\u2019]/g, "")
    .replace(/[–—]/g, ", ");
}

async function main() {
  if (!existsSync(PIPER) || !existsSync(MODEL)) {
    console.error("Piper binary/model missing.");
    process.exit(1);
  }
  mkdirSync(OUT, { recursive: true });

  for (const [name, spec] of Object.entries(MOTION)) {
    if (!spec) continue;
    const wav = join(OUT, `${name}.wav`);
    const mp3 = join(OUT, `${name}.mp3`);
    execFileSync(PIPER, ["-m", MODEL, "-f", wav, "--length-scale", "1.05", "-q"], {
      input: cleanForSpeech((spec as { script: string }).script),
      encoding: "utf8",
    });
    spawnSync(FFMPEG, ["-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-b:a", "96k", mp3], {
      stdio: "ignore",
    });
    rmSync(wav, { force: true });
    console.log(`${name}.mp3 (${(spec as { script: string }).script.split(/\s+/).length} words)`);
  }
  console.log("DONE — motion explainer voices generated.");
}

main();
