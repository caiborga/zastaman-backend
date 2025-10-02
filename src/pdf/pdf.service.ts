import { Injectable, NotFoundException } from '@nestjs/common';
import * as ejs from 'ejs';
import * as path from 'path';
import { CustomerService } from 'src/customer/customer.service';
import { InvoiceService } from 'src/invoice/invoice.service';
import { BillerService } from 'src/biller/biller.service';

import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

@Injectable()
export class PdfService {
  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private billerService: BillerService,
  ) {}

  async generateInvoicePdf(invoiceId: number, userId: number): Promise<Buffer> {
    const invoice = await this.invoiceService.findOne(invoiceId, userId);
    if (!invoice || !invoice.length)
      throw new NotFoundException('Invoice not found');

    const customer = await this.customerService.findOne(invoice[0].customer);
    if (!customer) throw new NotFoundException('Customer not found');

    const biller = await this.billerService.findByUser(userId);
    if (!biller) throw new NotFoundException('Biller not found');

    const templatePath = path.join(__dirname, 'templates', 'invoice.ejs');

    const html = await ejs.renderFile(templatePath, {
      invoice: invoice[0],
      customer,
      biller,
    });

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'a4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' },
    });

    await browser.close();
    return pdfBuffer;
  }
}
