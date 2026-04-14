import pdfmake from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

export class PdfService {
  constructor() {
    const fonts = {
      Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      }
    };
    pdfmake.setFonts(fonts);
  }

  async generatePdf(docDefinition: TDocumentDefinitions): Promise<Buffer> {
    const doc = pdfmake.createPdf(docDefinition);
    return await doc.getBuffer();
  }
}
