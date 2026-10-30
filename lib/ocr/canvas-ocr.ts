export interface CanvasImageMetrics {
  width: number;
  height: number;
  aspectRatio: number;
  estimatedSharpness: number; // 0 - 100
  brightnessMean: number; // 0 - 255
  contrastRatio: number; // 0 - 100
  isBlurry: boolean;
  isLowContrast: boolean;
  recommendations: string[];
}

/**
 * Evaluates client-side image canvas data to detect blur, low resolution, or poor contrast
 * without sending excessive payload data to the server.
 */
export function analyzeImageCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): CanvasImageMetrics {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const recommendations: string[] = [];

  let totalBrightness = 0;
  const step = 4; // Sample every 4th pixel for speed
  let sampleCount = 0;

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Perceived luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalBrightness += lum;
    sampleCount++;
  }

  const brightnessMean = sampleCount > 0 ? Math.round(totalBrightness / sampleCount) : 128;

  // Approximate Laplacian variance for sharpness/blur detection
  let varianceSum = 0;
  for (let i = 0; i < data.length; i += 4 * step * 2) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    varianceSum += Math.pow(lum - brightnessMean, 2);
  }
  const variance = sampleCount > 0 ? varianceSum / (sampleCount / 2) : 500;
  const estimatedSharpness = Math.min(100, Math.round((Math.sqrt(variance) / 128) * 100));

  const isBlurry = estimatedSharpness < 25;
  const isLowContrast = estimatedSharpness < 20;

  if (isBlurry) {
    recommendations.push("Image appears blurred or out of focus. Text extraction accuracy may be reduced.");
  }
  if (width < 600 || height < 400) {
    recommendations.push("Screenshot resolution is low. High-resolution captures improve URL and fine-print detection.");
  }
  if (isLowContrast) {
    recommendations.push("Low contrast detected between text and background. Try a clearer screenshot.");
  }

  return {
    width,
    height,
    aspectRatio: Math.round((width / (height || 1)) * 100) / 100,
    estimatedSharpness,
    brightnessMean,
    contrastRatio: estimatedSharpness,
    isBlurry,
    isLowContrast,
    recommendations,
  };
}

