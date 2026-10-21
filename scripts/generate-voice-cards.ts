/**
 * ONE-TIME build-side voice generation for topic cards (NOT a runtime
 * dependency). Pipes each card's voice script through Piper — the local,
 * offline neural TTS engine — and compresses to MP3 via ffmpeg.
 *
 * Outputs:
 *   public/voice/cards/<id>.mp3        — the audio the card's play button plays
 *   docs/voice/<id>.txt                — the TTS-ready script file (deliverable)
 *
 * Voice: en_US-amy-medium (Rhasspy Piper, MIT). One warm calm voice app-wide.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { cards } from "../src/content/cards";

const PIPER = resolve("tools/piper/app/piper/piper.exe");
const MODEL = resolve("tools/piper/en_US-amy-medium.onnx");
const FFMPEG = "ffmpeg";
const OUT_AUDIO = "public/voice/cards";
const OUT_TEXT = "docs/voice";

function cleanForSpeech(text: string): string {
  return text
    .replace(/…/g, ".")
    .replace(/\.\.\./g, " ... ")
    .replace(/["""]/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[–—]/g, ", ")
    .replace(/0800 678 678/g, "oh eight hundred, six seven eight, six seven eight")
    .replace(/112/g, "one one two");
}

async function main() {
  if (!existsSync(PIPER) || !existsSync(MODEL)) {
    console.error("Piper binary/model missing.");
    process.exit(1);
  }
  mkdirSync(OUT_AUDIO, { recursive: true });
  mkdirSync(OUT_TEXT, { recursive: true });

  for (const card of cards) {
    const spoken = cleanForSpeech(card.voiceScript);
    const wav = join(OUT_AUDIO, `${card.id}.wav`);
    const mp3 = join(OUT_AUDIO, `${card.id}.mp3`);

    writeFileSync(join(OUT_TEXT, `${card.id}.txt`), card.voiceScript + "\n");

    execFileSync(PIPER, ["-m", MODEL, "-f", wav, "--length-scale", "1.05", "-q"], {
      input: spoken,
      encoding: "utf8",
    });
    spawnSync(FFMPEG, ["-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-b:a", "96k", mp3], {
      stdio: "ignore",
    });
    rmSync(wav, { force: true });
    console.log(`${card.id}.mp3  (${card.voiceScript.split(/\s+/).length} words)`);
  }
  console.log("DONE — card voices generated.");
}

main();
