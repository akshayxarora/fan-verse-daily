// Newsletter email template matching website theme
// Dark background, electric cyan primary, techie aesthetic
import { getEmailLogoHTML } from './email-logo';

export function getNewsletterTemplate(content: {
  title?: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  unsubscribeUrl?: string;
}) {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.VITE_SITE_URL || 'https://marketingwithvibes.com';
  const logoHTML = getEmailLogoHTML(36);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #0d1117;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #c9d1d9;
          }
          .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #0d1117;
            padding-bottom: 40px;
          }
          .main {
            background-color: #0d1117;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            color: #c9d1d9;
          }
          .content-card {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 12px;
            overflow: hidden;
            margin: 20px 0;
          }
          .header {
            padding: 40px 30px 20px 30px;
            text-align: left;
          }
          .body {
            padding: 0 30px 40px 30px;
            font-size: 16px;
            line-height: 1.6;
          }
          .body h1 { color: #f0f6fc; font-size: 28px; margin-top: 0; margin-bottom: 20px; font-weight: 800; }
          .body h2 { color: #f0f6fc; font-size: 22px; margin-top: 30px; margin-bottom: 15px; font-weight: 700; }
          .body h3 { color: #f0f6fc; font-size: 18px; margin-top: 25px; margin-bottom: 12px; font-weight: 700; }
          .body p { margin-bottom: 20px; color: #c9d1d9; }
          .body a { color: #58a6ff; text-decoration: none; }
          .body a:hover { text-decoration: underline; }
          .body ul, .body ol { padding-left: 20px; margin-bottom: 20px; }
          .body li { margin-bottom: 10px; }
          .body blockquote {
            margin: 20px 0;
            padding: 10px 20px;
            border-left: 4px solid #2dd4bf;
            background-color: #0d1117;
            font-style: italic;
          }
          .body img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
            display: block;
          }
          .body code {
            background-color: #30363d;
            padding: 2px 5px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            color: #e6edf3;
          }
          .body pre {
            background-color: #0d1117;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid #30363d;
          }
          .body pre code { background: none; padding: 0; }
          .cta-container {
            text-align: center;
            padding: 20px 0;
          }
          .cta-button {
            background-color: #2dd4bf;
            color: #0d1117 !important;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 700;
            display: inline-block;
            text-decoration: none !important;
          }
          .footer {
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #8b949e;
          }
          .footer p { margin-bottom: 10px; }
          .footer a { color: #58a6ff; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <table class="main" role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td class="header">
                ${logoHTML}
              </td>
            </tr>
            <tr>
              <td>
                <div class="content-card">
                  <div class="body">
                    ${content.title ? `<h1>${content.title}</h1>` : ''}
                    ${content.body}
                    ${content.ctaUrl && content.ctaText ? `
                      <div class="cta-container">
                        <a href="${content.ctaUrl}" class="cta-button">${content.ctaText} →</a>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="footer">
                <p>&copy; ${new Date().getFullYear()} Marketing With Vibes. All rights reserved.</p>
                <p>GTM Engineering Blog • technical deep-dives and systems breakdowns.</p>
                ${content.unsubscribeUrl ? `
                  <p><a href="${content.unsubscribeUrl}">Unsubscribe</a> from this newsletter</p>
                ` : ''}
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `.trim();
}
