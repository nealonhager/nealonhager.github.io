import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = path.join("public", "images", "me.jpeg");
const outputDir = path.join("public", "images");
const widths = [400, 576, 800, 1152];

await mkdir(outputDir, { recursive: true });

await Promise.all(
    widths.map(async (width) => {
        const output = path.join(outputDir, `me-${width}w.jpeg`);

        await sharp(source)
            .rotate()
            .resize(width, null, { withoutEnlargement: true })
            .jpeg({ quality: 85, mozjpeg: true })
            .toFile(output);
    }),
);

console.log(`Generated ${widths.length} responsive images from ${source}`);
