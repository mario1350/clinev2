import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Configure middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Proposal PDF generation endpoint
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { html, filename = 'proposal.pdf' } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }
    
    // Launch a browser instance
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Set content to the provided HTML
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    
    // Set PDF options for A4 size
    const pdfOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.4in',
        right: '0.4in',
        bottom: '0.4in',
        left: '0.4in'
      }
    };
    
    // Generate PDF
    const pdfBuffer = await page.pdf(pdfOptions);
    
    // Close the browser
    await browser.close();
    
    // Set response headers
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': pdfBuffer.length
    });
    
    // Send the PDF buffer
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`PDF Server running on port ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/api/generate-pdf`);
});

// Export for potential programmatic use
export default app;
