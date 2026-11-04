import sharp from "sharp";

const targets = [
  { variant: "thumbnail", width: 320, quality: 78 },
  { variant: "card", width: 960, quality: 82 },
  { variant: "detail", width: 1600, quality: 84 },
] as const;

export async function createResponsiveWebpVariants(buffer: Buffer) {
  const results = await Promise.all(targets.map(async ({ variant, width, quality }) => {
    const output = await sharp(buffer, { failOn: "error", limitInputPixels: 100_000_000 })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toBuffer({ resolveWithObject: true });
    return { variant, data: output.data, size: output.info.size, width: output.info.width, height: output.info.height };
  }));
  return results;
}
