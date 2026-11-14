import sharp from "sharp";
import type { StoneRegion } from "../ai/ai-fill";
import { aiConfigured, detectStoneRegion } from "../ai/ai-fill";

const targets = [
  { variant: "thumbnail", width: 320, quality: 78 },
  { variant: "card", width: 960, quality: 82 },
  { variant: "detail", width: 1600, quality: 84 },
] as const;

export async function createResponsiveWebpVariants(buffer: Buffer) {
  const results = await Promise.all(targets.map(async ({ variant, width, quality }) => {
    const pipeline = sharp(buffer, { failOn: "error", limitInputPixels: 100_000_000 })
      .rotate()
      .resize({ width, withoutEnlargement: true });
    // Gentle sharpening on the larger variants keeps resized stone photography
    // crisp without introducing halos or visible artefacts.
    if (variant !== "thumbnail") pipeline.sharpen({ sigma: 0.8, m1: 0.3, m2: 0.5 });
    const output = await pipeline.webp({ quality, effort: 4 }).toBuffer({ resolveWithObject: true });
    return { variant, data: output.data, size: output.info.size, width: output.info.width, height: output.info.height };
  }));
  return results;
}

/** Applies EXIF orientation so later pixel maths match what viewers see. */
export async function autoOrient(buffer: Buffer) {
  return sharp(buffer, { failOn: "error", limitInputPixels: 100_000_000 }).rotate().toBuffer();
}

/** Crops to a 0-1000 normalised [ymin,xmin,ymax,xmax] box with a small margin.
 *  Returns null when the box is unusable or would barely remove anything. */
export async function cropToBox(buffer: Buffer, box: [number, number, number, number]) {
  const meta = await sharp(buffer, { failOn: "error", limitInputPixels: 100_000_000 }).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) return null;
  const margin = 0.05;
  const left = Math.max(0, Math.round((box[1] / 1000) * width - margin * width));
  const top = Math.max(0, Math.round((box[0] / 1000) * height - margin * height));
  const right = Math.min(width, Math.round((box[3] / 1000) * width + margin * width));
  const bottom = Math.min(height, Math.round((box[2] / 1000) * height + margin * height));
  const cropWidth = right - left;
  const cropHeight = bottom - top;
  if (cropWidth < 240 || cropHeight < 240) return null;
  if (cropWidth * cropHeight >= width * height * 0.98) return null;
  return sharp(buffer).extract({ left, top, width: cropWidth, height: cropHeight }).toBuffer();
}

/** Removes plain, uniform borders (tables, walls, backdrop). */
export async function trimEdges(buffer: Buffer) {
  try {
    const trimmed = await sharp(buffer, { failOn: "error", limitInputPixels: 100_000_000 }).trim({ threshold: 25 }).toBuffer({ resolveWithObject: true });
    const meta = await sharp(buffer).metadata();
    const area = (meta.width ?? 0) * (meta.height ?? 0);
    if (!trimmed.info.width || !area || trimmed.info.width * trimmed.info.height >= area * 0.98) return null;
    return trimmed.data;
  } catch {
    return null;
  }
}

/**
 * Product-photo refinement: asks the AI to locate the stone and crops to it,
 * excluding stands, clamps and background. Falls back to trimming uniform
 * borders locally, then to the untouched image. Returns a human-readable note
 * for the admin interface.
 */
export async function refineStoneImage(buffer: Buffer): Promise<{ data: Buffer; note: string }> {
  try {
    const oriented = await autoOrient(buffer);
    let box: [number, number, number, number] | null = null;
    let noStoneFound = false;
    if (aiConfigured()) {
      const probe = await sharp(oriented).resize({ width: 1024, withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer();
      const region: StoneRegion | null = await detectStoneRegion(`data:image/jpeg;base64,${probe.toString("base64")}`);
      if (region && "box" in region) box = region.box;
      if (region && "found" in region) noStoneFound = true;
    }
    const cropped = box ? await cropToBox(oriented, box) : null;
    if (cropped) return { data: cropped, note: "Stone area detected — the photo was cropped to the stone (stands and background excluded) and enhanced." };
    if (!box) {
      const trimmed = await trimEdges(oriented);
      if (trimmed) return { data: trimmed, note: "Cropped automatically to the image content and enhanced." };
      if (noStoneFound) return { data: oriented, note: "No clear stone area was detected in this photo — it was processed as sent. Consider re-photographing the slab on a plain background." };
    }
    return { data: oriented, note: "Processed and enhanced; no automatic crop was needed." };
  } catch {
    return { data: buffer, note: "" };
  }
}

