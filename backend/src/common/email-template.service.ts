import { Injectable } from '@nestjs/common';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class EmailTemplateService {
  generateOtpEmail(otp: string, company?: Company | null): string {
    const primaryColor = company?.primaryColor || '#0057e7';
    const appName = company?.appName || 'Moovon';
    const logoUrl = company?.emailHeaderLogo || company?.logo || 'https://via.placeholder.com/150x50?text=Moovon';
    const supportEmail = company?.supportEmail || 'support@moovon.app';
    const footerText = company?.footerText || `© ${new Date().getFullYear()} Moovon. All rights reserved.`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${appName} Verification</title>
        <style>
          body { font-family: ${company?.fontFamily || 'Arial, sans-serif'}; background-color: #f4f7f6; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { text-align: center; padding: 32px 20px; border-bottom: 1px solid #eeeeee; }
          .header img { max-height: 50px; }
          .content { padding: 40px 32px; text-align: center; }
          .otp-box { 
            background: #f9f9f9; 
            border: 2px dashed ${primaryColor}; 
            color: ${primaryColor}; 
            font-size: 32px; 
            letter-spacing: 8px; 
            font-weight: bold; 
            padding: 20px; 
            margin: 24px auto; 
            border-radius: 8px;
            max-width: 300px;
          }
          .footer { background: #fafafa; padding: 24px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eeeeee; }
          .link { color: ${primaryColor}; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="${appName} Logo" />
          </div>
          <div class="content">
            <h2 style="margin-top: 0; color: #111;">Verify Your Email</h2>
            <p>You recently requested to sign in to <strong>${appName}</strong>. Use the verification code below to complete the process.</p>
            
            <div class="otp-box">${otp}</div>
            
            <p>This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>Need help? Contact us at <a href="mailto:${supportEmail}" class="link">${supportEmail}</a></p>
            <p>${footerText}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
