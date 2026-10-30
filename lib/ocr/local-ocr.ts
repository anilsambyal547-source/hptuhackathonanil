/**
 * SafeGuard AI - Local In-Browser OCR Engine
 * Runs client-side Optical Character Recognition (English + Hindi) via Tesseract.js.
 * Offline-capable: loads worker and language models locally from /public/tesseract/.
 * Ensures screenshot images and extracted text never leave the browser.
 */

export interface LocalOcrProgress {
  status: string;
  progress: number; // 0 to 100
}

export interface LocalOcrResult {
  text: string;
  confidence: number; // 0 to 100
  durationMs: number;
  engine: "local_tesseract";
}

/**
 * Lazy loads Tesseract.js and executes OCR inside a Web Worker.
 * Only loaded when the user actually uploads or pastes an image.
 */
export async function runLocalOcr(
  imageSource: string | File | Blob,
  onProgress?: (progress: LocalOcrProgress) => void
): Promise<LocalOcrResult> {
  const startTime = performance.now();

  if (onProgress) {
    onProgress({ status: "Initializing local OCR worker...", progress: 5 });
  }

  // Lazy-load tesseract.js to avoid initial bundle bloat
  const { createWorker } = await import("tesseract.js");

  let worker;
  try {
    worker = await createWorker(["eng", "hin"], undefined, {
      workerPath: "/tesseract/worker.min.js",
      corePath: "/tesseract/core",
      langPath: "/tesseract/lang-data",
      gzip: true,
      cacheMethod: "none",
      logger: (m) => {
        if (!onProgress) return;
        const pct = Math.round((m.progress || 0) * 100);
        if (m.status === "recognizing text") {
          onProgress({ status: `Recognizing text (${pct}%)...`, progress: Math.min(95, 20 + Math.round(pct * 0.75)) });
        } else if (m.status === "loading tesseract core") {
          onProgress({ status: "Loading WebAssembly core...", progress: 15 });
        } else if (m.status === "loading language traineddata") {
          onProgress({ status: "Loading language dictionary (English + Hindi)...", progress: 25 });
        } else if (m.status === "initializing api") {
          onProgress({ status: "Configuring OCR engine...", progress: 35 });
        } else {
          onProgress({ status: m.status || "Processing image...", progress: pct });
        }
      },
    });

    if (onProgress) {
      onProgress({ status: "Scanning text...", progress: 40 });
    }

    const ret = await worker.recognize(imageSource);
    const durationMs = Math.round(performance.now() - startTime);

    if (onProgress) {
      onProgress({ status: "OCR extraction complete", progress: 100 });
    }

    return {
      text: ret.data.text ? ret.data.text.trim() : "",
      confidence: Math.round(ret.data.confidence || 0),
      durationMs,
      engine: "local_tesseract",
    };
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // Ignored
      }
    }
  }
}
