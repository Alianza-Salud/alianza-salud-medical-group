import { useState, useEffect } from 'react';
import { Mail, MailOpen, Search, Check, Clock } from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  fetchContactMessages,
  markContactMessageAsRead,
  type ContactMessage,
} from '../../services/contactService';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function ContactMessagesPage() {
  usePageMeta('Mensajes de Contacto', 'Bandeja de Entrada de Consultas del Sitio Web');

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

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
    if (!msg.isRead) {
      await markContactMessageAsRead(msg.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
      );
    }
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

            <div className="space-y-2">
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
                      {new Date(msg.createdAt).toLocaleDateString()}
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
                  <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                      <p className="text-xs text-gray-500 mt-1">
                        De: <strong className="text-gray-800">{selectedMessage.fullName}</strong> ({selectedMessage.email}) | Tel: {selectedMessage.phone}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
                    >
                      <Mail className="h-4 w-4" /> Responder por Correo
                    </a>
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Leído
                    </span>
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
