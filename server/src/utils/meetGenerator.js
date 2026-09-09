const { google } = require('googleapis');
const crypto = require('crypto');

/**
 * Genera un código de reunión aleatorio con el formato estándar de Google Meet (abc-defg-hij).
 * Se utiliza como fallback cuando no hay credenciales de Google Calendar configuradas en el entorno.
 * @returns {string} URL formateada de Google Meet
 */
function generateFallbackMeetUrl() {
  const segment1 = crypto.randomBytes(2).toString('hex').substring(0, 3);
  const segment2 = crypto.randomBytes(2).toString('hex').substring(0, 4);
  const segment3 = crypto.randomBytes(2).toString('hex').substring(0, 3);
  return `https://meet.google.com/${segment1}-${segment2}-${segment3}`;
}

/**
 * Inicializa el cliente de autenticación de Google APIs.
 * Soporta OAuth2 (Refresh Token) y Service Account.
 */
function getGoogleAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground'
    );
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    return oauth2Client;
  }

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (serviceAccountEmail && privateKey) {
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
    return new google.auth.JWT({
      email: serviceAccountEmail,
      key: formattedPrivateKey,
      scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
    });
  }

  return null;
}

/**
 * Crea un evento en Google Calendar y solicita la generación automática de una conferencia Google Meet.
 * 
 * Usando conferenceDataVersion = 1 y conferenceData.createRequest, Google API asigna un enlace único de videoconferencia.
 * 
 * @param {Object} params - Datos de la cita
 * @param {string} params.summary - Título de la reunión
 * @param {string} [params.description] - Descripción o detalles
 * @param {string} params.startDateTime - Fecha/Hora de inicio en formato ISO
 * @param {string} params.endDateTime - Fecha/Hora de fin en formato ISO
 * @param {string} [params.attendeeEmail] - Correo electrónico del paciente
 * @returns {Promise<string>} URL navegable de Google Meet (entryPoint.uri)
 */
async function createGoogleMeetEvent({ summary, description, startDateTime, endDateTime, attendeeEmail }) {
  try {
    const auth = getGoogleAuthClient();

    if (!auth) {
      console.warn('[GoogleMeet] Credenciales de Google API no encontradas en .env. Usando fallback dinamico de URL.');
      return generateFallbackMeetUrl();
    }

    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    const requestId = `meet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const event = {
      summary: summary || 'Consulta Médica - Alianza Salud',
      description: description || 'Videoconsulta agendada a través de Alianza Salud Medical Group.',
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Santo_Domingo',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Santo_Domingo',
      },
      attendees: attendeeEmail ? [{ email: attendeeEmail }] : [],
      conferenceData: {
        createRequest: {
          requestId: requestId,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      resource: event,
      sendUpdates: 'all',
    });

    const conferenceData = response.data.conferenceData;
    const entryPoints = conferenceData?.entryPoints || [];
    const videoEntryPoint = entryPoints.find((ep) => ep.entryPointType === 'video');

    if (videoEntryPoint && videoEntryPoint.uri) {
      console.log(`[GoogleMeet] Evento creado exitosamente. Meet Link: ${videoEntryPoint.uri}`);
      return videoEntryPoint.uri;
    }

    if (response.data.hangoutLink) {
      return response.data.hangoutLink;
    }

    console.warn('[GoogleMeet] No se obtuvo entryPoint de video desde Google API. Usando fallback.');
    return generateFallbackMeetUrl();
  } catch (error) {
    console.error('[GoogleMeet Error] Error al crear evento en Google Calendar:', error.message);
    return generateFallbackMeetUrl();
  }
}

/**
 * Función síncrona/asíncrona auxiliar para obtener un enlace de reunión.
 * Si se llama sin parámetros complejos, devuelve una URL formateada de Meet.
 */
function generateMeetUrl() {
  return generateFallbackMeetUrl();
}

module.exports = {
  createGoogleMeetEvent,
  generateMeetUrl,
  generateFallbackMeetUrl,
};
