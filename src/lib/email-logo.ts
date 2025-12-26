// MarketingWithVibes logo for emails
// Logo: Terminal icon in rounded square with primary color background

export const getEmailLogo = () => {
  // SVG logo matching the website design
  // Terminal icon (>_) in a rounded square with teal/cyan background
  const logoSvg = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#2dd4bf"/>
      <path d="M10 16L14 20L10 24M18 12H22" stroke="#0d1117" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
  
  // Convert to data URL for email compatibility
  const base64Svg = Buffer.from(logoSvg).toString('base64');
  return `data:image/svg+xml;base64,${base64Svg}`;
};

export const getEmailLogoHTML = (size: number = 32) => {
  // Use table-based layout and text-based icon for 100% email client compatibility
  // Inline SVGs are blocked by many clients (Gmail, Outlook, etc.)
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0;">
      <tr>
        <td style="padding-right: 12px; vertical-align: middle;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: ${size}px; height: ${size}px; background-color: #2dd4bf; border-radius: 6px;">
            <tr>
              <td align="center" style="vertical-align: middle; font-family: 'Courier New', Courier, monospace; font-weight: 900; font-size: ${size * 0.6}px; color: #0d1117; line-height: 1;">
                &gt;_
              </td>
            </tr>
          </table>
        </td>
        <td style="vertical-align: middle;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: ${size * 0.7}px; color: #f0f6fc; letter-spacing: -0.5px; white-space: nowrap;">MarketingWithVibes</span>
        </td>
      </tr>
    </table>
  `.trim();
};

