import { Injectable, NotFoundException } from '@nestjs/common';
import * as ejs from 'ejs';
import * as path from 'path';
import { CustomerService } from 'src/customer/customer.service';
import { InvoiceService } from 'src/invoice/invoice.service';
import { BillerService } from 'src/biller/biller.service';

import puppeteer from 'puppeteer-core';
import { existsSync } from 'fs';
import { spawnSync } from 'child_process';

function resolveChromePath(): string {
  const envs = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.GOOGLE_CHROME_BIN,
    process.env.CHROME_BINARY,
    process.env.CHROME_PATH,
  ].filter(Boolean) as string[];
  for (const p of envs) if (existsSync(p)) return p;

  for (const bin of ['chrome', 'google-chrome', 'chromium', 'chromium-browser']) {
    const r = spawnSync('which', [bin], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  throw new Error('Chrome executable not found');
}

@Injectable()
export class PdfService {
  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private billerService: BillerService,
  ) {}

  async generateInvoicePdf(invoiceId: number, userId: number): Promise<Buffer> {
    const invoice = await this.invoiceService.findOne(invoiceId, userId);
    if (!invoice || !invoice.length) {
      throw new NotFoundException('Invoice not found');
    }

    const customer = await this.customerService.findOne(invoice[0].customer);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const biller = await this.billerService.findByUser(userId);
    if (!biller) {
      throw new NotFoundException('Biller not found');
    }

    const templatePath = path.join(__dirname, 'templates', 'invoice.ejs');
    if (!existsSync(templatePath)) {
      throw new Error(`Template not found at ${templatePath}`);
    }

    const html = await ejs.renderFile(
      templatePath,
      { invoice: invoice[0], customer, biller },
      { async: true },
    );

    const browser = await puppeteer.launch({
      headless: true, // bei neuem puppeteer-core auch: 'new'
      executablePath: resolveChromePath(),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
        '--disable-dev-shm-usage',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      // Optional: Styles wie im Browser nutzen
      // await page.emulateMediaType('screen');

      const pdfData = await page.pdf({
        printBackground: true,
        format: 'A4',
        margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
      });

      // Kompatibel mit Buffer/Uint8Array/ArrayBuffer
      const buffer: Buffer = Buffer.isBuffer(pdfData)
        ? pdfData
        : Buffer.from(pdfData as Uint8Array);

      return buffer;
    } finally {
      await browser.close();
    }
  }
}
