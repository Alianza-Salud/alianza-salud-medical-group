import { useState, useEffect } from 'react';
import {
  Mail,
  MailOpen,
  Search,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Send,
  MessageSquare,
  Phone,
  User,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  fetchContactMessages,
  markContactMessageAsRead,
  type ContactMessage,
} from '../../services/contactService';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function ContactMessagesPage() {
  usePageMeta('Mensajes de Contacto', 'Bandeja de Entrada de Consultas del Sitio Web');

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Estados de respuesta
  const [isCopied, setIsCopied] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyBody, setReplyBody] = useState('');

  const loadMessages = async () => {
    setIsLoading(true);
    const data = await fetchContactMessages();
    setMessages(data);
    if (data.length > 0 && !selectedMessage) {
      setSelectedMessage(data[0]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setShowReplyForm(false);
    setReplyBody('');
    if (!msg.isRead) {
      await markContactMessageAsRead(msg.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
      );
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mensajes de Contacto</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bandeja de entrada de consultas recibidas a través del formulario de contacto del sitio web.
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por remitente, correo, asunto o mensaje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando mensajes de contacto..." />
      ) : filteredMessages.length === 0 ? (
        <Card className="text-center p-12">
          <p className="text-gray-500">No se encontraron mensajes de contacto.</p>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lista de mensajes */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Bandeja de Entrada ({filteredMessages.length})
            </h2>

            <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    selectedMessage?.id === msg.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : msg.isRead
                      ? 'border-gray-200 bg-white hover:border-gray-300'
                      : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                      {msg.isRead ? (
                        <MailOpen className="h-4 w-4 text-gray-400 shrink-0" />
                      ) : (
                        <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                      )}
                      <span className="truncate">{msg.fullName}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(msg.createdAt).toLocaleDateString('es-CO')}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-gray-800 mt-1 truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detalle del mensaje seleccionado */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Encabezado del Mensaje */}
                  <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          <span>Remitente: <strong className="text-gray-900">{selectedMessage.fullName}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          <span>Correo: <strong className="text-gray-900 font-mono">{selectedMessage.email}</strong></span>
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(selectedMessage.email)}
                            className="text-primary hover:underline font-semibold ml-1 flex items-center gap-1 text-[11px]"
                            title="Copiar correo electrónico al portapapeles"
                          >
                            {isCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            {isCopied ? '¡Copiado!' : 'Copiar'}
                          </button>
                        </div>
                        {selectedMessage.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            <span>Teléfono: <strong className="text-gray-900">{selectedMessage.phone}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(selectedMessage.createdAt).toLocaleString('es-CO')}
                    </div>
                  </div>

                  {/* Cuerpo del Mensaje */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Consulta Recibida</span>
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Opciones de Respuesta Multicanal */}
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-primary" /> Opciones de Respuesta
                      </h3>

                      <Button
                        size="sm"
                        variant={showReplyForm ? 'outline' : 'primary'}
                        onClick={() => setShowReplyForm(!showReplyForm)}
                      >
                        <Send className="h-3.5 w-3.5" />
                        {showReplyForm ? 'Cerrar Formulario' : 'Redactar Respuesta Rápida'}
                      </Button>
                    </div>

                    {/* Formulario de Respuesta Rápida Inline */}
                    {showReplyForm && (
                      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-900">Respuesta a: {selectedMessage.email}</span>
                          <span className="text-gray-500">Asunto: RE: {selectedMessage.subject}</span>
                        </div>

                        <textarea
                          rows={4}
                          placeholder={`Estimado(a) ${selectedMessage.fullName},\n\nGracias por comunicarse con Alianza Salud Medical Group. Con respecto a su consulta...`}
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 p-3 text-xs focus:border-primary focus:outline-none bg-white leading-relaxed resize-y"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <span className="text-[11px] text-gray-500">
                            Elija su proveedor o copie el texto para enviar:
                          </span>

                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedMessage.email)}&su=${encodeURIComponent('RE: ' + selectedMessage.subject)}&body=${encodeURIComponent(replyBody || 'Estimado(a) ' + selectedMessage.fullName + ',\n\n')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
                            >
                              <ExternalLink className="h-3.5 w-3.5" /> Gmail Web
                            </a>

                            <a
                              href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(selectedMessage.email)}&subject=${encodeURIComponent('RE: ' + selectedMessage.subject)}&body=${encodeURIComponent(replyBody || 'Estimado(a) ' + selectedMessage.fullName + ',\n\n')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                            >
                              <ExternalLink className="h-3.5 w-3.5" /> Outlook Web
                            </a>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const fullText = `Para: ${selectedMessage.email}\nAsunto: RE: ${selectedMessage.subject}\n\n${replyBody}`;
                                navigator.clipboard.writeText(fullText);
                                setIsCopied(true);
                                setTimeout(() => setIsCopied(false), 2500);
                              }}
                            >
                              <Copy className="h-3.5 w-3.5" /> Copiar Respuesta
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botones de Enlace Directo a Webmail y App local */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedMessage.email)}&su=${encodeURIComponent('RE: ' + selectedMessage.subject)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-red-600" /> Responder vía Gmail
                      </a>

                      <a
                        href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(selectedMessage.email)}&subject=${encodeURIComponent('RE: ' + selectedMessage.subject)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-blue-600" /> Responder vía Outlook
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopyEmail(selectedMessage.email)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-gray-500" />}
                        {isCopied ? '¡Correo Copiado!' : 'Copiar Correo'}
                      </button>

                      <a
                        href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
                        title="Intentar abrir aplicación predeterminada de correo del sistema"
                      >
                        <Mail className="h-3.5 w-3.5 text-gray-500" /> App del Sistema (mailto)
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center p-12">
                <p className="text-gray-500">Seleccione un mensaje para ver el detalle.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
