import { useState, useEffect } from 'react';
import {
  Sliders,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  BookOpen,
  Target,
  Eye,
  Award,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { fetchSiteInfo, updateSiteInfo, type SiteInfoData } from '../../services/siteInfoService';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function SettingsPage() {
  usePageMeta('Configuración del Sitio', 'Gestión de datos públicos e información institucional');

  const [formData, setFormData] = useState<SiteInfoData>({
    company_name: '',
    tagline: '',
    phone: '',
    email: '',
    address: '',
    schedule: '',
    history: '',
    mission: '',
    vision: '',
    values: [],
    visual_resource: '',
  });

  const [newValueInput, setNewValueInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'about'>('general');

  const loadSettings = async () => {
    setIsLoading(true);
    const data = await fetchSiteInfo();
    setFormData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await updateSiteInfo(formData);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(res.message || 'Configuración e información institucional actualizadas exitosamente.');
      if (res.data) setFormData(res.data);
    } else {
      setErrorMessage(res.message || 'Error al guardar la configuración.');
    }
  };

  const addValueItem = () => {
    if (!newValueInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      values: [...prev.values, newValueInput.trim()],
    }));
    setNewValueInput('');
  };

  const removeValueItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando configuración institucional..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sliders className="h-6 w-6 text-primary" />
            Configuración del Sitio e Información Institucional
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Administre los datos públicos de la empresa, canales de contacto y el contenido institucional de la sección Nosotros.
          </p>
        </div>

        <Button onClick={handleSubmit} isLoading={isSubmitting}>
          <Save className="h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      {successMessage && (
        <Alert variant="success" message={successMessage} dismissible />
      )}
      {errorMessage && (
        <Alert variant="error" message={errorMessage} dismissible />
      )}

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'general'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Datos Públicos y Contacto
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'about'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Sección Nosotros (Información Institucional)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: DATOS PÚBLICOS Y CONTACTO */}
        {activeTab === 'general' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Identificación de la Empresa
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Oficial de la Empresa *</label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Lema / Eslogan Principal *</label>
                  <input
                    type="text"
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Canales de Contacto Directo
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono de Atención *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico Institucional *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Ubicación y Horario
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Dirección de la Sede Principal *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Horario de Atención al Público *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: SECCIÓN NOSOTROS (INFORMACIÓN INSTITUCIONAL) */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Información Institucional e Historia (Sección Nosotros)
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Espacio Institucional Adicional (Historia / Presentación) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.history}
                    onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none resize-y"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Texto por defecto: <em>"Espacio reservado para información institucional adicional: historia, misión, visión, valores. — Pendiente de datos proporcionados por la empresa."</em>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Misión
                  </h3>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={4}
                    required
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none resize-y"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Visión
                  </h3>
                </CardHeader>
                <CardContent>
                  <textarea
                    rows={4}
                    required
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none resize-y"
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Recurso Visual Institucional (Imagen o Multimedia)
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Descripción / Enlace del Recurso Visual Institucional *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.visual_resource}
                    onChange={(e) => setFormData({ ...formData, visual_resource: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Texto por defecto: <em>"Espacio reservado para imagen o recurso visual institucional"</em>
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">{formData.visual_resource}</p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Este marcador de posición se desplegará en la sección pública Nosotros.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Valores Institucionales
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Agregar un nuevo valor institucional..."
                    value={newValueInput}
                    onChange={(e) => setNewValueInput(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <Button type="button" onClick={addValueItem} size="sm">
                    + Añadir Valor
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.values.map((val, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {val}
                      <button
                        type="button"
                        onClick={() => removeValueItem(idx)}
                        className="ml-1 text-primary/60 hover:text-primary font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={loadSettings}>
            <RefreshCw className="h-4 w-4" /> Descartar Cambios
          </Button>

          <Button type="submit" isLoading={isSubmitting}>
            <Save className="h-4 w-4" /> Guardar Configuración
          </Button>
        </div>
      </form>
    </div>
  );
}
