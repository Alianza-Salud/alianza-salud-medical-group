import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Stethoscope,
  Scale,
  Edit2,
  X,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { fetchLawyers, createLawyer, updateLawyer } from '../../services/lawyerService';
import type { Lawyer, CreateLawyerFormData, LawyerRoleType } from '../../types/lawyer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function LawyersManagerPage() {
  usePageMeta('Maestro de Abogados', 'Gestión de Abogados y Especialistas Médicos');

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateLawyerFormData>({
    fullName: '',
    email: '',
    phone: '',
    specialty: 'Derecho Médico',
    roleType: 'lawyer',
  });

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchLawyers();
    setLawyers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingLawyer(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      specialty: 'Derecho Médico',
      roleType: 'lawyer',
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEdit = (l: Lawyer) => {
    setEditingLawyer(l);
    setFormData({
      fullName: l.fullName,
      email: l.email,
      phone: l.phone || '',
      specialty: l.specialty,
      roleType: l.roleType,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    let res;
    if (editingLawyer) {
      res = await updateLawyer(editingLawyer.id, formData);
    } else {
      res = await createLawyer(formData);
    }
    setIsSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      loadData();
    } else {
      setErrorMessage(res.message || 'Error al guardar.');
    }
  };

  const toggleStatus = async (l: Lawyer) => {
    await updateLawyer(l.id, { ...l, isActive: !l.isActive });
    loadData();
  };

  const filteredLawyers = lawyers.filter(
    (l) =>
      l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maestro de Abogados y Médicos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Registro y gestión del equipo interdisciplinario (Abogados de Responsabilidad y Médicos Especialistas).
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-5 w-5" />
          Registrar Profesional
        </Button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando profesionales..." />
      ) : filteredLawyers.length === 0 ? (
        <Card className="text-center p-12">
          <p className="text-gray-500">No hay profesionales registrados.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Profesional</th>
                <th className="px-6 py-4">Tipo / Especialidad</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLawyers.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{l.fullName}</div>
                    <div className="text-xs text-gray-500">{l.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-medium text-gray-800">
                      {l.roleType === 'medical_specialist' ? (
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Scale className="h-4 w-4 text-primary" />
                      )}
                      <span>{l.specialty}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      {l.roleType === 'medical_specialist' ? 'Médico Especialista' : 'Abogado Jurídico'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">{l.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(l)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        l.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {l.isActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {l.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(l)}>
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {editingLawyer ? 'Editar Profesional' : 'Registrar Profesional'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {errorMessage && <Alert variant="error" message={errorMessage} dismissible />}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr(a). Elena Ramírez"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="elena@alianzasalud.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de Profesional *</label>
                  <select
                    value={formData.roleType}
                    onChange={(e) => setFormData({ ...formData, roleType: e.target.value as LawyerRoleType })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                  >
                    <option value="lawyer">Abogado Jurídico</option>
                    <option value="medical_specialist">Médico Especialista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+57 300 999 8877"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Especialidad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Derecho Médico / Ortopedia y Traumatología"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  {editingLawyer ? 'Guardar Cambios' : 'Registrar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
