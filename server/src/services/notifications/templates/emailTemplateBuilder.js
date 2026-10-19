/**
 * Generador base de plantillas HTML responsivas para correos transaccionales.
 */
function buildHtmlLayout({ title, contentHtml, ctaText, ctaUrl }) {
  const safeTitle = String(title || 'Alianza Salud Medical Group').replace(/[<>]/g, '');
  const safeCtaText = String(ctaText || '').replace(/[<>]/g, '');
  const safeCtaUrl = /^https?:\/\//i.test(String(ctaUrl || '')) ? String(ctaUrl) : '';
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f2b48 0%, #091a2e 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; }
    .header p { margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; tracking-widest: 1px; color: #38bdf8; font-weight: 700; }
    .body { padding: 32px 24px; line-height: 1.6; }
    .card-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .card-row { margin-bottom: 10px; font-size: 14px; }
    .card-row:last-child { margin-bottom: 0; }
    .card-label { font-weight: 700; color: #475569; }
    .card-val { color: #0f172a; }
    .cta-btn { display: inline-block; background-color: #0ea5e9; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 16px; text-align: center; }
    .footer { background-color: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Alianza Salud Medical Group</h1>
      <p>Injury Management & Peritaje Médico</p>
    </div>
    <div class="body">
      ${contentHtml}
      ${safeCtaText && safeCtaUrl ? `
        <div style="text-align: center; margin-top: 24px;">
          <a href="${safeCtaUrl}" class="cta-btn" target="_blank" rel="noopener noreferrer">${safeCtaText}</a>
        </div>
      ` : ''}
    </div>
    <div class="footer">
      <p><strong>Alianza Salud Medical Group</strong> — Medellín, Colombia</p>
      <p>Este correo contiene información confidencial dirigida exclusivamente a su destinatario. Si ha recibido este mensaje por error, por favor notifíquelo al remitente y elimínelo.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

module.exports = {
  buildHtmlLayout,
};
