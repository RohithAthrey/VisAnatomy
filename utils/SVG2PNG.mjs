import puppeteer from 'puppeteer';
import fs from 'fs/promises'
import path from 'path';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ioPath = path.join(__dirname, '..', 'charts_svg');

async function normalizeSvgWithSizeOnly(svgContent, page) {
  // Inject xmlns if missing
  if (!svgContent.includes('xmlns=')) {
    svgContent = svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Wrap in minimal HTML
  const wrapped = `
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: white; }
          svg, svg * {
            display: inline !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
        </style>
      </head>
      <body>${svgContent}</body>
    </html>
  `;

  await page.setContent(wrapped, { waitUntil: 'load', timeout: 0 });
  await page.waitForSelector('svg');

  // Modify the SVG in-place only if needed
  const { svgWithSize, width, height } = await page.evaluate(() => {
    const svg = document.querySelector('svg');

    const hasWidth = svg.hasAttribute('width');
    const hasHeight = svg.hasAttribute('height');

    if (!hasWidth || !hasHeight) {
      const bbox = svg.getBBox();  // this respects drawn area, but does not shift content
      if (!hasWidth) svg.setAttribute('width', bbox.x + bbox.width);
      if (!hasHeight) svg.setAttribute('height', bbox.y + bbox.height);
    }

    const rect = svg.getBoundingClientRect();
    return {
      svgWithSize: svg.outerHTML,
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height)
    };
  });

  // Re-render updated SVG with safe layout
  const finalHtml = `<html><body style="margin:0">${svgWithSize}</body></html>`;
  await page.setContent(finalHtml, { waitUntil: 'load', timeout: 0 });

  return { width, height };
}


async function generatePNGs() {
    const browser = await puppeteer.launch({ headless: "new", protocolTimeout: 30000 }); //"new"
    const page = await browser.newPage();
    const files = await fs.readdir("../charts_svg");
    for (const file of files) {
      if (path.extname(file).toLowerCase() !== '.svg') continue;
      const outputPath = path.join('../png/', file.replace(/\.svg$/, '.png'));
      try {
        await fs.access(outputPath);
        //console.log(`⏩ Skipping (already exists): ${outputPath}`);
        continue;
      } catch {
        // File does not exist, proceed
      }

      const filePath = path.resolve(ioPath, file);
      let svgContent = await fs.readFile(filePath, 'utf-8');

      const { width, height } = await normalizeSvgWithSizeOnly(svgContent, page);
      await page.setViewport({ width, height });

      const svgElement = await page.$('svg');
      await svgElement.screenshot({ path: outputPath });
      console.log(file, width, height)

      //await fs.writeFile(`debug-${file}.html`, html);
    }
    await page.close();
    await browser.close();
}

generatePNGs();