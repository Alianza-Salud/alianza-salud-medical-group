const { buildHtmlLayout } = require('./emailTemplateBuilder');

const FRONTEND_URL = process.env.CORS_ORIGIN || 'http://localhost:5173';

function buildCalendarLinks({ title, description, location, dateStr, timeStr }) {
  try {
    let cleanDate = dateStr;
    if (cleanDate && String(cleanDate).includes('T')) {
      cleanDate = String(cleanDate).split('T')[0];
    }
    const startTimeStr = timeStr || '09:00';
    
    const startObj = new Date(`${cleanDate}T${startTimeStr}:00`);
    if (isNaN(startObj.getTime())) return null;

    const endObj = new Date(startObj.getTime() + 45 * 60 * 1000);

    const toICSFormat = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');

    const startCompact = toICSFormat(startObj);
    const endCompact = toICSFormat(endObj);

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startCompact}/${endCompact}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${startObj.toISOString()}&enddt=${endObj.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    return { googleUrl, outlookUrl };
  } catch (err) {
    return null;
  }
}

const templates = {
  // 1. Registro de Cliente
  CLIENT_CREATED: ({ fullName, clientCode }) => {
    const subject = `Bienvenido a Alianza Salud Medical Group — Registro y Código de Verificación`;
    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Estimado(a) ${fullName},</h2>
        <p>Le damos la bienvenida a <strong>Alianza Salud Medical Group</strong>. Su expediente inicial ha sido registrado exitosamente en nuestra plataforma de <strong>Injury Management & Peritaje Médico Especializado</strong>.</p>
        
        <div class="card-box" style="text-align: center; border-left: 4px solid #0ea5e9; background-color: #f8fafc; padding: 24px;">
          <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Código Único de Verificación de Cliente</p>
          <p style="margin: 8px 0 0 0; font-size: 26px; font-weight: 900; color: #0ea5e9; font-family: monospace; letter-spacing: 3px;">${clientCode}</p>
        </div>
        
        <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 18px; margin-top: 20px;">
          <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 700;">Requisito indispensable para el acceso a su portal:</p>
          <p style="margin: 8px 0 0 0; font-size: 12.5px; color: #78350f; line-height: 1.6;">
            El código asignado arriba es su <strong>credencial de verificación obligatoria</strong> para crear su usuario en nuestra plataforma. <strong>Sin este código no será posible completar su registro ni ingresar a la aplicación para consultar el estado y avance de sus casos médico-periciales.</strong>
          </p>
        </div>
        
        <p style="font-size: 13px; color: #475569; margin-top: 20px;">Para completar la activación de su cuenta de usuario y vincular sus expedientes, ingrese al portal introduciendo este código de 8 caracteres:</p>
      `,
      ctaText: 'Completar Registro en la Plataforma',
      ctaUrl: `${FRONTEND_URL}/register`,
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
  APPOINTMENT_CONFIRMED: ({ fullName, serviceType, date, time, modality, meetLink }) => {
    const isRemote = modality === 'remota' || modality === 'virtual';
    const modalityText = isRemote ? 'Consulta Virtual / Remota (Google Meet)' : 'Presencial en Sede';
    const subject = `Tu cita ha sido confirmada (${modalityText}) — Alianza Salud`;

    const calTitle = `Cita Médica: ${serviceType || 'Alianza Salud'}`;
    const calDesc = `Consulta Médica con Alianza Salud Medical Group para ${fullName}.${isRemote && meetLink ? `\n\nEnlace Google Meet: ${meetLink}` : ''}`;
    const calLoc = isRemote && meetLink ? meetLink : 'Sede Principal Alianza Salud Medical Group';

    const calLinks = buildCalendarLinks({
      title: calTitle,
      description: calDesc,
      location: calLoc,
      dateStr: date,
      timeStr: time,
    });

    const html = buildHtmlLayout({
      title: subject,
      contentHtml: `
        <h2 style="color: #0f2b48; font-size: 18px;">Hola, ${fullName}.</h2>
        <p style="color: #059669; font-weight: 700;">¡Tu cita ha sido confirmada exitosamente por nuestra Unidad de Admisiones!</p>
        
        <div class="card-box" style="border-left: 4px solid #059669;">
          <div class="card-row"><span class="card-label">Servicio:</span> <span class="card-val">${serviceType}</span></div>
          <div class="card-row"><span class="card-label">Fecha:</span> <span class="card-val">${date}</span></div>
          <div class="card-row"><span class="card-label">Hora:</span> <span class="card-val">${time}</span></div>
          <div class="card-row"><span class="card-label">Modalidad:</span> <span class="card-val" style="font-weight: 700; color: #0f2b48;">${modalityText}</span></div>
        </div>

        ${isRemote && meetLink ? `
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin-top: 20px; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #1e40af; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Videoconsulta Virtual en Vivo</p>
          <p style="margin: 6px 0 16px 0; font-size: 14px; color: #1e3a8a; font-weight: 600;">Enlace oficial de la reunión en Google Meet:</p>
          <a href="${meetLink}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 800; font-size: 15px; box-shadow: 0 4px 6px rgba(37,99,235,0.25);">
            💻 Unirse a la Videoconsulta en Google Meet
          </a>
          <p style="margin: 14px 0 0 0; font-size: 11.5px; color: #1e40af;">Le sugerimos ingresar 5 minutos antes de la hora pautada utilizando una computadora o dispositivo móvil con cámara y micrófono.</p>
        </div>
        ` : `
        <p style="font-size: 12.5px; color: #475569; margin-top: 16px;">
          <strong>Instrucciones para atención presencial:</strong> Le esperamos en nuestra sede principal 10 minutos antes de su cita asignada. Por favor traiga consigo su documento de identidad y soportes médicos previos.
        </p>
        `}

        ${calLinks ? `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-top: 20px; text-align: center;">
          <p style="margin: 0 0 12px 0; font-size: 13px; color: #334155; font-weight: 700;">📅 Agendar esta cita en su calendario personal:</p>
          <div style="text-align: center; margin-top: 6px;">
            <a href="${calLinks.googleUrl}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #1e293b; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 12.5px; border: 1px solid #cbd5e1; box-shadow: 0 1px 2px rgba(0,0,0,0.05); margin: 4px;">
              ➕ Añadir a Google Calendar
            </a>
            <a href="${calLinks.outlookUrl}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #1e293b; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 12.5px; border: 1px solid #cbd5e1; box-shadow: 0 1px 2px rgba(0,0,0,0.05); margin: 4px;">
              ➕ Añadir a Outlook / Apple / Dispositivo
            </a>
          </div>
        </div>
        ` : ''}
      `,
      ctaText: isRemote && meetLink ? 'Unirse a Google Meet' : 'Ver mis citas en el portal',
      ctaUrl: isRemote && meetLink ? meetLink : `${FRONTEND_URL}/dashboard/cliente`,
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
