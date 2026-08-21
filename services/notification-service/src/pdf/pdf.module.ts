import { Global, Module } from '@nestjs/common';
import { TicketPdfService } from './ticket-pdf.service';

@Global()
@Module({
  providers: [TicketPdfService],
  exports: [TicketPdfService],
})
export class PdfModule {}
