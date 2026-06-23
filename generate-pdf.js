const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

// 1. Configuration Constants
const PORT = 3987;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_FILENAME = 'DigitalNest_Immersive_Portfolio.pdf';

const MIME_TYPES = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// 2. Start a Minimal Static Web Server
const server = http.createServer((req, res) => {
  // Parse and sanitize path (remove query params)
  let requestPath = req.url.split('?')[0];
  if (requestPath === '/') {
    requestPath = '/index.html';
  }

  // URL-decode to handle directories/files with space encodings (e.g. "%20")
  const decodedPath = decodeURIComponent(requestPath);
  const filePath = path.join(__dirname, decodedPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, async () => {
  console.log(`[Server] Static server running at http://localhost:${PORT}`);
  console.log(`[PDF Generator] Initializing puppeteer-core with Microsoft Edge...`);

  let browser;
  try {
    // 3. Launch browser via Edge executable
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set high-res viewport
    await page.setViewport({ width: 1440, height: 900 });

    console.log(`[PDF Generator] Navigating to website...`);
    await page.goto(`http://localhost:${PORT}/index.html`, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    console.log(`[PDF Generator] Preparing page content for print...`);

    // 4. Force reveal animations to active state in DOM (as fallback for JS observers)
    await page.evaluate(() => {
      document.querySelectorAll('.reveal-block').forEach((el) => {
        el.classList.add('active');
      });
      
      // Also make sure all lazily loaded images are initialized
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        img.removeAttribute('loading');
      });
    });

    // Short wait for any rendering or image swaps to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`[PDF Generator] Exporting to PDF: ${OUTPUT_FILENAME}...`);

    // 5. Generate high-quality print PDF
    await page.pdf({
      path: path.join(__dirname, OUTPUT_FILENAME),
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        bottom: '12mm',
        left: '12mm',
        right: '12mm'
      },
      displayHeaderFooter: false,
      preferCSSPageSize: false
    });

    console.log(`[PDF Generator] PDF created successfully! Saved as: ${OUTPUT_FILENAME}`);
  } catch (error) {
    console.error(`[PDF Generator] Failed to generate PDF:`, error);
  } finally {
    if (browser) {
      await browser.close();
      console.log(`[PDF Generator] Browser closed.`);
    }
    server.close(() => {
      console.log(`[Server] Server shut down.`);
      process.exit(0);
    });
  }
});
