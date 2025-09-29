import { Injectable, NotFoundException } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as puppeteer from 'puppeteer';
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
  async generatePdf(invoiceId: number, userId: number): Promise<Buffer> {
    const invoice = await this.invoiceService.findOne(invoiceId, userId);

    if (!invoice) {
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

    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Beispiel-Content
    doc.fontSize(20).text('RECHNUNG', { align: 'left' });
    doc.moveDown(2);

    // Absender
    doc.fontSize(10).text(biller.companyName);
    doc.text(biller.street);
    doc.text(biller.postcode + biller.town);
    doc.moveDown(2);

    // Empfänger
    doc.fontSize(12).text('Empfänger:', { underline: true });
    doc.text(`${customer.preName} ${customer.lastName}`);
    doc.text(`${customer.street} ${customer.streetNumber}`);
    doc.text(`${customer.postcode} ${customer.town}`);
    doc.text(`${customer.country}`);
    doc.moveDown(2);

    // Rechnungsdetails
    doc.fontSize(12).text(`Rechnungsnummer: ${invoice[0].number}`);
    doc.text(`Rechnungsdatum: ${invoice[0].invDate}`);
    doc.moveDown(2);

    // Tabelle / Positionen
    doc.fontSize(12).text('Leistungen', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text('Beschreibung', 50, doc.y);
    doc.text('Betrag (EUR)', 400, doc.y);
    doc.moveDown(0.5);
    doc.text('Beratung / Dienstleistung', 50, doc.y);
    doc.text(`${invoice.invAmount} EUR`, 400, doc.y);
    doc.moveDown(2);

    // Summenblock
    const netto = invoice[0].invAmount;
    doc.fontSize(12).text('Zusammenfassung', { underline: true });
    doc.fontSize(10).text(`Nettobetrag: ${netto} EUR`);
    doc.text(`MwSt: ${invoice[0].vatAmount} EUR`);
    doc.text(
      `Gesamtbetrag: ${Number(invoice[0].invAmount) + Number(invoice[0].vatAmount)} EUR`,
    );
    doc.moveDown(2);

    // Fußzeile
    // doc
    //   .fontSize(8)
    //   .text('Bitte überweisen Sie den Gesamtbetrag innerhalb von 14 Tagen.', {
    //     align: 'center',
    //     opacity: 0.7,
    //   });
    // doc.text('Bankverbindung: IBAN DE00 1234 5678 9012 3456 00', {
    //   align: 'center',
    //   opacity: 0.7,
    // });

    doc.end();

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });
  }

  async generateInvoicePdf(invoiceId: number, userId: number): Promise<Buffer> {
    const invoice = await this.invoiceService.findOne(invoiceId, userId);

    if (!invoice) {
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

    const templatePath = path.join(
      __dirname,
      '..', // zurück aus dist/pdf in dist
      '..', // zurück aus dist in root
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


    const browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // wichtig für Docker
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
