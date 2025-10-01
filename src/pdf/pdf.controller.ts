import {
  Controller,
  Get,
  Param,
  UseGuards,
  Res,
  Request,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { PdfService } from './pdf.service';
// import { CreatePdfDto } from './dto/create-pdf.dto';
// import { UpdatePdfDto } from './dto/update-pdf.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getInvoicePdf(
    @Param('id') id: string,
    @Res() res: ExpressResponse,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const pdfBuffer = await this.pdfService.generateInvoicePdf(+id, userId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${id}.pdf`,
    });
    res.end(pdfBuffer);
  }
}
