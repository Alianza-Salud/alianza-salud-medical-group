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
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { fetchSiteInfo, updateSiteInfo, type SiteInfoData } from '../../services/siteInfoService';
import {
  fetchCaseTypes,
  createCaseType,
  updateCaseType,
  deleteCaseType,
} from '../../services/caseTypeService';
import type { CaseType } from '../../types/caseType';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function SettingsPage() {
  usePageMeta('Configuración del Sitio', 'Gestión de datos públicos, información institucional y Maestro de Tipos de Caso');

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
  const [activeTab, setActiveTab] = useState<'general' | 'about' | 'case-types'>('general');

  // Estado del Maestro de Tipos de Caso
  const [caseTypes, setCaseTypes] = useState<CaseType[]>([]);
  const [isCaseTypeModalOpen, setIsCaseTypeModalOpen] = useState(false);
  const [editingCaseType, setEditingCaseType] = useState<CaseType | null>(null);
  const [caseTypeName, setCaseTypeName] = useState('');
  const [caseTypeDesc, setCaseTypeDesc] = useState('');
  const [caseTypeActive, setCaseTypeActive] = useState(true);
  const [isSavingCaseType, setIsSavingCaseType] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);
    const [infoData, typesData] = await Promise.all([
      fetchSiteInfo(),
      fetchCaseTypes(true), // incluir inactivos para gestión de admin
    ]);
    setFormData(infoData);
    setCaseTypes(typesData);
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

  // Handlers CRUD Tipo de Caso
  const handleOpenCreateTypeModal = () => {
    setEditingCaseType(null);
    setCaseTypeName('');
    setCaseTypeDesc('');
    setCaseTypeActive(true);
    setIsCaseTypeModalOpen(true);
  };

  const handleOpenEditTypeModal = (type: CaseType) => {
    setEditingCaseType(type);
    setCaseTypeName(type.name);
    setCaseTypeDesc(type.description || '');
    setCaseTypeActive(type.isActive);
    setIsCaseTypeModalOpen(true);
  };

  const handleSaveCaseType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTypeName.trim()) return;

    setIsSavingCaseType(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (editingCaseType) {
      const res = await updateCaseType(editingCaseType.id, {
        name: caseTypeName.trim(),
        description: caseTypeDesc.trim(),
        isActive: caseTypeActive,
      });
      if (res.success) {
        setSuccessMessage('Tipo de caso actualizado exitosamente.');
        setIsCaseTypeModalOpen(false);
        loadSettings();
      } else {
        setErrorMessage(res.message || 'Error al actualizar tipo de caso.');
      }
    } else {
      const res = await createCaseType({
        name: caseTypeName.trim(),
        description: caseTypeDesc.trim(),
      });
      if (res.success) {
        setSuccessMessage('Nuevo tipo de caso creado exitosamente.');
        setIsCaseTypeModalOpen(false);
        loadSettings();
      } else {
        setErrorMessage(res.message || 'Error al crear tipo de caso.');
      }
    }

    setIsSavingCaseType(false);
  };

  const handleDeleteCaseType = async (id: number, name: string) => {
    if (!window.confirm(`¿Está seguro de eliminar el tipo de caso "${name}"?`)) return;

    setSuccessMessage(null);
    setErrorMessage(null);

    const res = await deleteCaseType(id);
    if (res.success) {
      setSuccessMessage('Tipo de caso eliminado exitosamente.');
      loadSettings();
    } else {
      setErrorMessage(res.message || 'Error al eliminar el tipo de caso.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando configuración del sistema..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sliders className="h-6 w-6 text-primary" />
            Configuración Global del Sistema
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Administre datos públicos, contenido institucional y el Maestro de Tipos de Caso médico-periciales.
          </p>
        </div>

        {activeTab !== 'case-types' && (
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        )}
      </div>

      {successMessage && (
        <Alert variant="success" message={successMessage} dismissible />
      )}
      {errorMessage && (
        <Alert variant="error" message={errorMessage} dismissible />
      )}

      {/* Tabs Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200">
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
          Sección Nosotros (Institucional)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('case-types')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'case-types'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FolderKanban className="h-4 w-4 text-emerald-600" />
          Maestro de Tipos de Caso
        </button>
      </div>

      {/* TAB 3: MAESTRO DE TIPOS DE CASO (CRUD) */}
      {activeTab === 'case-types' ? (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-emerald-600" />
                  Maestro de Tipos de Caso (Tipos de Lesión)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure dinámicamente las categorías de lesión o tipos de caso disponibles para la apertura de expedientes.
                </p>
              </div>

              <Button onClick={handleOpenCreateTypeModal} size="sm">
                <Plus className="h-4 w-4" />
                Agregar Tipo de Caso
              </Button>
            </CardHeader>

            <CardContent className="pt-4">
              {caseTypes.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-6">
                  No hay tipos de caso registrados actualmente.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Nombre / Categoría</th>
                        <th className="px-4 py-3 text-left">Descripción</th>
                        <th className="px-4 py-3 text-center">Estado</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {caseTypes.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs font-bold text-gray-400">
                            #{t.id}
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-900">
                            {t.name}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {t.description || 'Sin descripción'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {t.isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <Check className="h-3 w-3 text-emerald-600" /> Activo
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                Inactivo
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEditTypeModal(t)}
                                title="Editar Tipo de Caso"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteCaseType(t.id, t.name)}
                                title="Eliminar Tipo de Caso"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal Crear / Editar Tipo de Caso */}
          {isCaseTypeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-emerald-600" />
                    {editingCaseType ? 'Editar Tipo de Caso' : 'Agregar Tipo de Caso'}
                  </h3>
                  <button onClick={() => setIsCaseTypeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveCaseType} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nombre del Tipo de Caso / Lesión *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Lesión por Accidente de Tránsito (SOAT)"
                      value={caseTypeName}
                      onChange={(e) => setCaseTypeName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Descripción (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detalles o ámbito de esta categoría de lesión..."
                      value={caseTypeDesc}
                      onChange={(e) => setCaseTypeDesc(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none resize-y"
                    />
                  </div>

                  {editingCaseType && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="caseTypeActiveCheckbox"
                        checked={caseTypeActive}
                        onChange={(e) => setCaseTypeActive(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label htmlFor="caseTypeActiveCheckbox" className="text-xs font-medium text-gray-700 cursor-pointer">
                        Habilitado para selección en la apertura de casos
                      </label>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsCaseTypeModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" isLoading={isSavingCaseType}>
                      {editingCaseType ? 'Guardar Cambios' : 'Crear Tipo de Caso'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
}
