import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = "public";
const source = path.join(publicDir, "favicon.svg");
const renderSize = 128;

const rasterSvg = (await readFile(source, "utf8"))
    .replace(/<style>[\s\S]*?<\/style>/, "")
    .replace('class="bg"', 'fill="#fafafa"')
    .replace('class="letter"', 'fill="none" stroke="#171717" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"');

const rendered = await sharp(Buffer.from(rasterSvg)).resize(renderSize, renderSize).png().toBuffer();

const outputs = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
];

await Promise.all(
    outputs.map(async ({ name, size }) => {
        const output = path.join(publicDir, name);

        await sharp(rendered).resize(size, size).png().toFile(output);
    }),
);

console.log(`Generated ${outputs.length} favicon PNGs from ${source}`);
