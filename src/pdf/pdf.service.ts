import { Injectable, NotFoundException } from '@nestjs/common';
import * as ejs from 'ejs';
import * as path from 'path';
import { CustomerService } from 'src/customer/customer.service';
import { InvoiceService } from 'src/invoice/invoice.service';
import { BillerService } from 'src/biller/biller.service';

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
    if (!customer) throw new NotFoundException('Customer not found');

    const biller = await this.billerService.findByUser(userId);
    if (!biller) throw new NotFoundException('Biller not found');

    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'pdf',
      'templates',
      'invoice.ejs',
    );

    const html = await ejs.renderFile(templatePath, {
      invoice: invoice[0],
      customer,
      biller,
    });

    // Unterschiedliche Browser je nach Umgebung
    const isProd = process.env.NODE_ENV === 'production';

    let browser;

    if (isProd) {
      const puppeteer = require('puppeteer-core');
      const chromium = require('chrome-aws-lambda');

      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath:
          (await chromium.executablePath) || '/usr/bin/google-chrome',
        headless: chromium.headless,
      });
    } else {
      const puppeteer = require('puppeteer');

      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
