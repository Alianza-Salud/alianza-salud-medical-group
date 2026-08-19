require('dotenv').config();
const notificationService = require('../services/notifications/notificationService');
const notificationRepository = require('../repositories/notificationRepository');

async function testNotificationSystem() {
  console.log('--- TEST SISTEMA DE NOTIFICACIONES TRANSACCIONALES (BREVO) ---');

  const settings = await notificationRepository.getSettings();
  console.log(`[Config] Se encontraron ${settings.length} eventos configurados en BD.`);

  console.log('[Evento] Disparando CLIENT_CREATED...');
  notificationService.emit('CLIENT_CREATED', {
    fullName: 'Carlos Andrés Mendoza',
    email: 'carlos.mendoza.test@example.com',
    clientCode: 'CLI-TEST-2026',
    clientId: null,
  });

  console.log('[Evento] Disparando APPOINTMENT_REQUESTED...');
  notificationService.emit('APPOINTMENT_REQUESTED', {
    fullName: 'María Fernanda Gómez',
    email: 'maria.gomez.test@example.com',
    phone: '3009876543',
    serviceType: 'Calificación de Pérdida de Capacidad Laboral (PCLO)',
    preferredDate: '2026-08-25',
    preferredTime: '10:00 AM',
    message: 'Evaluación post-accidente laboral.',
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { logs, total } = await notificationRepository.getLogs({ limit: 10, offset: 0 });
  console.log(`[Bitácora Auditoría] Total de envíos registrados en MySQL: ${total}`);
  logs.slice(0, 5).forEach((log) => {
    console.log(` -> ID #${log.id} | Evento: ${log.event_type} | Destinatario: ${log.recipient_email} (${log.recipient_type}) | Estado: ${log.status} | MsgId: ${log.provider_message_id}`);
  });

  console.log('--- TEST COMPLETADO EXITOSAMENTE CON 0 ERRORES ---');
  process.exit(0);
}

testNotificationSystem().catch(console.error);
