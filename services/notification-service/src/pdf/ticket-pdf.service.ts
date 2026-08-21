import { Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';

export interface TicketPdfParams {
  eventTitle: string;
  eventStartAt: string;
  venueName: string | null;
  address: string | null;
  city: string | null;
  ticketTypeName: string;
  quantity: number;
  totalAmount: string;
  bookingCode: string;
  bookingId: string;
}

/**
 * Renders a single-page PDF ticket with a QR code. The QR encodes a plain
 * "bookingCode|bookingId" reference, not a verification URL - there's no
 * check-in/scan-validation endpoint in the platform yet (a future feature),
 * so this is deliberately just a portable reference an usher could look up
 * manually or a future scanner could validate against.
 */
@Injectable()
export class TicketPdfService {
  private readonly logger = new Logger(TicketPdfService.name);

  async generate(params: TicketPdfParams): Promise<Buffer> {
    const qrBuffer = await QRCode.toBuffer(`${params.bookingCode}|${params.bookingId}`, {
      margin: 1,
      width: 200,
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A5', margin: 40 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => {
        this.logger.error(`PDF generation failed for booking ${params.bookingId}: ${err}`);
        reject(err);
      });

      this.render(doc, params, qrBuffer);
      doc.end();
    });
  }

  private render(doc: PDFKit.PDFDocument, params: TicketPdfParams, qrBuffer: Buffer): void {
    const eventDate = new Date(params.eventStartAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });
    const venueLine = [params.venueName, params.address, params.city].filter(Boolean).join(', ');

    doc.fontSize(20).fillColor('#6d28d9').text('GrabMyTicket', { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(18).fillColor('#1a1a1a').text(params.eventTitle);
    doc.moveDown(0.75);

    doc.fontSize(11).fillColor('#444444');
    doc.text(`Date: ${eventDate}`);
    if (venueLine) doc.text(`Venue: ${venueLine}`);
    doc.text(`Ticket: ${params.quantity} × ${params.ticketTypeName}`);
    doc.text(`Amount paid: ₹${params.totalAmount}`);
    doc.moveDown(1);

    doc.fontSize(13).fillColor('#1a1a1a').text(`Booking code: ${params.bookingCode}`, { characterSpacing: 1 });
    doc.moveDown(1);

    doc.image(qrBuffer, doc.page.width / 2 - 75, doc.y, { width: 150, height: 150 });
    doc.moveDown(9);
    doc.fontSize(9).fillColor('#888888').text('Present this ticket (screen or print) at entry.', { align: 'center' });
  }
}
