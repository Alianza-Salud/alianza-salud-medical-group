const { buildHtmlLayout } = require('./emailTemplateBuilder');

const FRONTEND_URL = process.env.CORS_ORIGIN || 'http://localhost:5173';

const templates = {
  // 1. Registro de Cliente
  CLIENT_CREATED: ({ fullName, clientCode }) => {
    const subject = `Bienvenido a Alianza Salud Medical Group — Código de Cliente: ${clientCode}`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p>Tu registro ha sido creado correctamente en nuestra plataforma de <strong>Injury Management & Peritaje Médico</strong>.</p>
        
        <div class="card-box" style="text-align: center; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase;">Tu Código Único de Cliente</p>
          <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: 900; color: #0ea5e9; font-family: monospace; letter-spacing: 2px;">${clientCode}</p>
        </div>
        
        <p style="font-size: 13px; color: #475569;">Con este código podrás identificarte dentro de nuestros servicios y realizar seguimiento a tus solicitudes.</p>
      `,
      ctaText: 'Acceder a la plataforma',
      ctaUrl: `${FRONTEND_URL}/login`,
    });
    return { subject, html };
  },

  // 2. Solicitud de Cita — Administración
  APPOINTMENT_REQUESTED_ADMIN: ({ fullName, email, phone, serviceType, preferredDate, preferredTime, message }) => {
    const subject = `Nueva solicitud de cita — ${fullName}`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Nueva Solicitud de Cita Recibida</h2>
        <p>Se ha recibido una solicitud de agendamiento desde la página web pública.</p>
        
        <div class="card-box">
          <div class="card-row"><span class="card-label">Cliente:</span> <span class="card-val">${fullName}</span></div>
          <div class="card-row"><span class="card-label">Correo:</span> <span class="card-val">${email}</span></div>
          <div class="card-row"><span class="card-label">Teléfono:</span> <span class="card-val">${phone}</span></div>
          <div class="card-row"><span class="card-label">Servicio Solicitado:</span> <span class="card-val">${serviceType}</span></div>
          <div class="card-row"><span class="card-label">Fecha Preferida:</span> <span class="card-val">${preferredDate}</span></div>
          <div class="card-row"><span class="card-label">Hora Preferida:</span> <span class="card-val">${preferredTime}</span></div>
          ${message ? `<div class="card-row"><span class="card-label">Observaciones:</span> <span class="card-val">${message}</span></div>` : ''}
        </div>
      `,
      ctaText: 'Ver Citas en el Panel',
      ctaUrl: `${FRONTEND_URL}/dashboard/citas`,
    });
    return { subject, html };
  },

  // 3. Solicitud de Cita — Cliente Confirmación
  APPOINTMENT_REQUESTED_CLIENT: ({ fullName, serviceType, preferredDate, preferredTime }) => {
    const subject = `Hemos recibido tu solicitud de cita — Alianza Salud`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p>Hemos recibido tu solicitud de cita médica especializada.</p>
        
        <div class="card-box">
          <div class="card-row"><span class="card-label">Servicio:</span> <span class="card-val">${serviceType}</span></div>
          <div class="card-row"><span class="card-label">Fecha solicitada:</span> <span class="card-val">${preferredDate}</span></div>
          <div class="card-row"><span class="card-label">Hora solicitada:</span> <span class="card-val">${preferredTime}</span></div>
          <div class="card-row"><span class="card-label">Estado:</span> <span class="card-val" style="color: #d97706; font-weight: 700;">Pendiente de confirmación</span></div>
        </div>
        
        <p style="font-size: 13px; color: #64748b;">Nuestra auxiliar de admisiones revisará la disponibilidad y se comunicará contigo para confirmar tu cita.</p>
      `,
    });
    return { subject, html };
  },

  // 4. Confirmación de Cita
  APPOINTMENT_CONFIRMED: ({ fullName, serviceType, date, time, modality }) => {
    const subject = `Tu cita ha sido confirmada — Alianza Salud`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p style="color: #059669; font-weight: 700;">¡Tu cita ha sido confirmada por nuestra Unidad de Admisiones!</p>
        
        <div class="card-box" style="border-left: 4px solid #059669;">
          <div class="card-row"><span class="card-label">Servicio:</span> <span class="card-val">${serviceType}</span></div>
          <div class="card-row"><span class="card-label">Fecha:</span> <span class="card-val">${date}</span></div>
          <div class="card-row"><span class="card-label">Hora:</span> <span class="card-val">${time}</span></div>
          <div class="card-row"><span class="card-label">Modalidad:</span> <span class="card-val">${modality || 'Presencial en Sede'}</span></div>
        </div>
      `,
      ctaText: 'Ver mis citas',
      ctaUrl: `${FRONTEND_URL}/dashboard/cliente`,
    });
    return { subject, html };
  },

  // 5. Cancelación de Cita
  APPOINTMENT_CANCELLED: ({ fullName, date, time, reason }) => {
    const subject = `Notificación de cancelación de cita — Alianza Salud`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p>Te informamos que la siguiente cita ha sido cancelada:</p>
        
        <div class="card-box" style="border-left: 4px solid #ef4444;">
          <div class="card-row"><span class="card-label">Fecha:</span> <span class="card-val">${date}</span></div>
          <div class="card-row"><span class="card-label">Hora:</span> <span class="card-val">${time}</span></div>
          ${reason ? `<div class="card-row"><span class="card-label">Motivo:</span> <span class="card-val">${reason}</span></div>` : ''}
        </div>
        
        <p style="font-size: 13px; color: #64748b;">Si necesitas reprogramar o información adicional, puedes comunicarte con nosotros.</p>
      `,
    });
    return { subject, html };
  },

  // 6. Solicitud de Revisión de Caso — Empresa
  PETITION_SUBMITTED_ADMIN: ({ fullName, email, phone, caseType, documentsCount, description }) => {
    const subject = `Nueva solicitud de revisión de caso — ${fullName}`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Nueva Solicitud de Revisión Preliminar</h2>
        <p>Se ha recibido una nueva solicitud de estudio preliminar desde el portal.</p>
        
        <div class="card-box">
          <div class="card-row"><span class="card-label">Cliente:</span> <span class="card-val">${fullName}</span></div>
          <div class="card-row"><span class="card-label">Tipo de Caso:</span> <span class="card-val">${caseType}</span></div>
          <div class="card-row"><span class="card-label">Teléfono:</span> <span class="card-val">${phone}</span></div>
          <div class="card-row"><span class="card-label">Correo:</span> <span class="card-val">${email}</span></div>
          <div class="card-row"><span class="card-label">Documentos Adjuntos:</span> <span class="card-val">${documentsCount || 0} archivo(s)</span></div>
          ${description ? `<div class="card-row"><span class="card-label">Descripción:</span> <span class="card-val">${description}</span></div>` : ''}
        </div>
      `,
      ctaText: 'Ver Solicitud en el Panel',
      ctaUrl: `${FRONTEND_URL}/dashboard/solicitudes-revision`,
    });
    return { subject, html };
  },

  // 7. Solicitud de Revisión de Caso — Cliente
  PETITION_SUBMITTED_CLIENT: ({ fullName, caseType }) => {
    const subject = `Recibimos tu solicitud de revisión — Alianza Salud`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p>Hemos recibido correctamente la información de tu caso (${caseType}).</p>
        
        <div class="card-box" style="border-left: 4px solid #0ea5e9;">
          <p style="margin: 0; font-size: 13px; color: #334155;">Nuestro equipo médico pericial realizará una revisión preliminar de los soportes aportados.</p>
          <p style="margin: 8px 0 0 0; font-size: 11px; color: #64748b;"><em>Nota: Esta revisión es orientativa y no constituye un dictamen médico ni garantiza resultados legales.</em></p>
        </div>
      `,
    });
    return { subject, html };
  },

  // 8. Mensaje de Contacto — Empresa
  CONTACT_SUBMITTED_ADMIN: ({ fullName, email, phone, subject: msgSubject, message }) => {
    const subject = `Nuevo mensaje de contacto — ${fullName}`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Nuevo Mensaje del Formulario de Contacto</h2>
        
        <div class="card-box">
          <div class="card-row"><span class="card-label">Nombre:</span> <span class="card-val">${fullName}</span></div>
          <div class="card-row"><span class="card-label">Email:</span> <span class="card-val">${email}</span></div>
          <div class="card-row"><span class="card-label">Teléfono:</span> <span class="card-val">${phone}</span></div>
          <div class="card-row"><span class="card-label">Asunto:</span> <span class="card-val">${msgSubject}</span></div>
          <div class="card-row"><span class="card-label">Mensaje:</span> <span class="card-val">${message}</span></div>
        </div>
      `,
    });
    return { subject, html };
  },

  // 9. Mensaje de Contacto — Cliente
  CONTACT_SUBMITTED_CLIENT: ({ fullName }) => {
    const subject = `Hemos recibido tu mensaje — Alianza Salud`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p>Gracias por comunicarte con <strong>Alianza Salud Medical Group</strong>.</p>
        <p style="font-size: 13px; color: #475569;">Nuestro equipo revisará tu mensaje y responderá a la mayor brevedad posible.</p>
      `,
    });
    return { subject, html };
  },

  // 10. Apertura de Caso
  CASE_CREATED: ({ fullName, caseCode, serviceSlug, stage, status }) => {
    const subject = `Se ha creado un nuevo caso [${caseCode}] — Alianza Salud`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p>Se ha creado un nuevo expediente asociado a tu cuenta.</p>
        
        <div class="card-box" style="border-left: 4px solid #0ea5e9;">
          <div class="card-row"><span class="card-label">Código del Caso:</span> <span class="card-val" style="font-family: monospace; font-weight: 700; color: #0ea5e9;">${caseCode}</span></div>
          <div class="card-row"><span class="card-label">Etapa Inicial:</span> <span class="card-val">${stage || 'Evaluación Inicial'}</span></div>
          <div class="card-row"><span class="card-label">Estado:</span> <span class="card-val">${status || 'En Proceso'}</span></div>
        </div>
      `,
      ctaText: 'Consultar mi caso',
      ctaUrl: `${FRONTEND_URL}/dashboard/cliente`,
    });
    return { subject, html };
  },

  // 11. Novedad de Caso
  CASE_UPDATED: ({ fullName, caseCode, title, summary }) => {
    const subject = `Nueva novedad en tu caso [${caseCode}] — Alianza Salud`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p>Se ha registrado una nueva actualización en tu expediente <strong>${caseCode}</strong>.</p>
        
        <div class="card-box">
          <div class="card-row"><span class="card-label">Actualización:</span> <span class="card-val">${title}</span></div>
          ${summary ? `<div class="card-row"><span class="card-label">Resumen:</span> <span class="card-val">${summary}</span></div>` : ''}
        </div>
      `,
      ctaText: 'Ver expediente completo',
      ctaUrl: `${FRONTEND_URL}/dashboard/cliente`,
    });
    return { subject, html };
  },

  // 12. Nuevo Documento Disponible
  DOCUMENT_UPLOADED: ({ fullName, caseCode, documentName }) => {
    const subject = `Nuevo documento disponible en tu expediente [${caseCode}]`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p>Se ha añadido un nuevo documento a tu expediente.</p>
        
        <div class="card-box">
          <div class="card-row"><span class="card-label">Caso:</span> <span class="card-val" style="font-family: monospace;">${caseCode}</span></div>
          <div class="card-row"><span class="card-label">Documento:</span> <span class="card-val">${documentName}</span></div>
        </div>
        
        <p style="font-size: 12px; color: #64748b;">Por seguridad, debes iniciar sesión en la plataforma para previsualizar o descargar el archivo.</p>
      `,
      ctaText: 'Ver documento',
      ctaUrl: `${FRONTEND_URL}/dashboard/cliente`,
    });
    return { subject, html };
  },

  // 13. Cambio de Etapa del Caso
  CASE_STAGE_CHANGED: ({ fullName, caseCode, previousStage, newStage }) => {
    const subject = `Tu caso [${caseCode}] ha cambiado de etapa`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p>Tu caso ha avanzado en la ruta de Injury Management.</p>
        
        <div class="card-box" style="border-left: 4px solid #059669;">
          <div class="card-row"><span class="card-label">Caso:</span> <span class="card-val" style="font-family: monospace;">${caseCode}</span></div>
          ${previousStage ? `<div class="card-row"><span class="card-label">Etapa Anterior:</span> <span class="card-val">${previousStage}</span></div>` : ''}
          <div class="card-row"><span class="card-label">Nueva Etapa:</span> <span class="card-val" style="color: #059669; font-weight: 700;">${newStage}</span></div>
        </div>
      `,
      ctaText: 'Consultar mi caso',
      ctaUrl: `${FRONTEND_URL}/dashboard/cliente`,
    });
    return { subject, html };
  },
};

module.exports = templates;
