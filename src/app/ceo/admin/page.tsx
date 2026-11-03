"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ICctvCamera {
  name: string;
  location: string;
  streamUrl: string;
  isActive: boolean;
}

interface IFacilityStatus {
  area: string;
  status: "optimo" | "mantenimiento" | "critico";
  lastInspection?: string;
  notes?: string;
}

interface IBranchPaymentInfo {
  bankName?: string;
  pagoMovilPhone?: string;
  idOrRif?: string;
  notes?: string;
}

interface IBranch {
  _id: string;
  name: string;
  code: string;
  city: string;
  state?: string;
  address: string;
  referencePoint?: string;
  phone: string;
  whatsappPhone?: string;
  email?: string;
  managerName?: string;
  managerPhone?: string;
  openingHours?: string;
  totalCapacity?: number;
  classroomsCount?: number;
  paymentInfo?: IBranchPaymentInfo;
  facilities: IFacilityStatus[];
  cctvCameras: ICctvCamera[];
  isActive: boolean;
  createdAt: string;
}

export default function CeoAdminPage() {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [editingBranch, setEditingBranch] = useState<IBranch | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "editor" | "cctv" | "facilities">("overview");

  // New Branch Modal
  const [showNewBranchModal, setShowNewBranchModal] = useState(false);
  const [newBranchData, setNewBranchData] = useState({
    name: "",
    code: "",
    city: "",
    state: "Barinas",
    address: "",
    phone: "",
    whatsappPhone: "",
    managerName: "",
    managerPhone: "",
    classroomsCount: 3,
    totalCapacity: 60,
  });

  // Camera preview in modal
  const [previewCamera, setPreviewCamera] = useState<ICctvCamera | null>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/branches");
      if (res.ok) {
        const data: IBranch[] = await res.json();
        setBranches(data);
        if (data.length > 0 && !editingBranch) {
          setEditingBranch(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBranchToEdit = (branch: IBranch) => {
    setEditingBranch({ ...branch });
    setSelectedBranchId(branch._id);
    setActiveTab("editor");
  };

  const handleBranchFieldChange = (field: keyof IBranch, value: unknown) => {
    if (!editingBranch) return;
    setEditingBranch({
      ...editingBranch,
      [field]: value,
    });
  };

  const handlePaymentFieldChange = (field: keyof IBranchPaymentInfo, value: string) => {
    if (!editingBranch) return;
    setEditingBranch({
      ...editingBranch,
      paymentInfo: {
        ...(editingBranch.paymentInfo || {}),
        [field]: value,
      },
    });
  };

  const handleFacilityStatusChange = (index: number, newStatus: IFacilityStatus["status"]) => {
    if (!editingBranch) return;
    const updated = [...editingBranch.facilities];
    updated[index].status = newStatus;
    setEditingBranch({ ...editingBranch, facilities: updated });
  };

  const handleAddFacility = () => {
    if (!editingBranch) return;
    const area = prompt("Nombre de la nueva área o equipo (ej. Laboratorio 2, Taller de Robótica):");
    if (!area) return;
    setEditingBranch({
      ...editingBranch,
      facilities: [...editingBranch.facilities, { area, status: "optimo", notes: "" }],
    });
  };

  const handleRemoveFacility = (index: number) => {
    if (!editingBranch) return;
    const updated = editingBranch.facilities.filter((_, i) => i !== index);
    setEditingBranch({ ...editingBranch, facilities: updated });
  };

  const handleAddCamera = () => {
    if (!editingBranch) return;
    const name = prompt("Nombre de la cámara (ej. Cámara 04 - Aula Magna):");
    if (!name) return;
    const streamUrl = prompt("URL de la cámara o snapshot IP (HTTP / HLS / IP):", "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80");
    if (!streamUrl) return;

    setEditingBranch({
      ...editingBranch,
      cctvCameras: [
        ...editingBranch.cctvCameras,
        { name, location: "Interior de la sede", streamUrl, isActive: true },
      ],
    });
  };

  const handleRemoveCamera = (index: number) => {
    if (!editingBranch) return;
    const updated = editingBranch.cctvCameras.filter((_, i) => i !== index);
    setEditingBranch({ ...editingBranch, cctvCameras: updated });
  };

  const saveBranchChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingBranch) return;

    setIsSaving(true);
    setStatusMessage("");

    try {
      const res = await fetch(`/api/branches/${editingBranch._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBranch),
      });

      if (res.ok) {
        const updated = await res.json();
        setEditingBranch(updated);
        setBranches((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
        setStatusMessage("¡Sede actualizada exitosamente!");
        setTimeout(() => setStatusMessage(""), 4000);
      } else {
        const err = await res.json();
        alert(err.error || "Error al actualizar la sede");
      }
    } catch (error) {
      console.error("Error updating branch:", error);
      alert("Error de conexión al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  const createNewBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBranchData),
      });

      if (res.ok) {
        const created = await res.json();
        setBranches((prev) => [...prev, created]);
        setEditingBranch(created);
        setSelectedBranchId(created._id);
        setShowNewBranchModal(false);
        setActiveTab("editor");
        alert("¡Nueva sede registrada con éxito!");
      } else {
        const err = await res.json();
        alert(err.error || "Error al registrar la sede");
      }
    } catch (error) {
      console.error("Error creating branch:", error);
    }
  };

  const activeBranchView =
    selectedBranchId === "all"
      ? null
      : branches.find((b) => b._id === selectedBranchId) || editingBranch;

  // Global KPIs
  const totalCapacity = branches.reduce((acc, b) => acc + (b.totalCapacity || 0), 0);
  const totalClassrooms = branches.reduce((acc, b) => acc + (b.classroomsCount || 0), 0);
  const totalCameras = branches.reduce((acc, b) => acc + (b.cctvCameras?.length || 0), 0);
  const allFacilities = branches.flatMap((b) => b.facilities || []);
  const facilitiesWarning = allFacilities.filter((f) => f.status === "critico").length;

  return (
    <div className="min-h-screen bg-surface-grey font-body-md text-on-background">
      {/* CEO Executive Top Bar */}
      <header className="bg-surface border-b border-outline-variant sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-20">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-amber-500 text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_person
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline-lg text-title-md font-black text-on-surface">
                  CEMPROZA Executive — Modo CEO
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                  SUPER ADMIN MULTI-SEDE
                </span>
              </div>
              <p className="text-xs text-on-surface-variant hidden sm:block">
                Control central de sedes, cámaras CCTV, instalaciones y supervisión directiva
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs font-bold px-3 py-2 bg-surface-variant hover:bg-surface-dim text-on-surface rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              <span>Panel Operativo</span>
            </Link>
            <Link
              href="/"
              className="text-primary hover:underline text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>Ver Sitio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Sede Switcher & Navigation Tabs */}
      <div className="bg-surface border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-stretch md:items-center py-3 gap-3">
          {/* Branch Selector */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">domain</span>
            <label className="text-xs font-bold text-on-surface-variant uppercase">Sede en Foco:</label>
            <select
              value={selectedBranchId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedBranchId(val);
                if (val !== "all") {
                  const b = branches.find((item) => item._id === val);
                  if (b) setEditingBranch(b);
                }
              }}
              className="bg-surface-bright border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold focus:border-primary outline-none"
            >
              <option value="all">🌟 Todas las Sedes (Consolidado)</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  🏢 {b.name} ({b.city})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowNewBranchModal(true)}
              className="ml-2 bg-primary text-on-primary hover:bg-on-primary-container px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-xs">add_business</span>
              <span>Nueva Sede</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                activeTab === "overview"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant text-on-surface-variant hover:bg-surface-dim"
              }`}
            >
              <span className="material-symbols-outlined text-xs">dashboard</span>
              <span>Visión General</span>
            </button>
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                activeTab === "editor"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant text-on-surface-variant hover:bg-surface-dim"
              }`}
            >
              <span className="material-symbols-outlined text-xs">edit_note</span>
              <span>Editor de Sede</span>
            </button>
            <button
              onClick={() => setActiveTab("cctv")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                activeTab === "cctv"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant text-on-surface-variant hover:bg-surface-dim"
              }`}
            >
              <span className="material-symbols-outlined text-xs text-red-500">videocam</span>
              <span>CCTV y Cámaras ({totalCameras})</span>
            </button>
            <button
              onClick={() => setActiveTab("facilities")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                activeTab === "facilities"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant text-on-surface-variant hover:bg-surface-dim"
              }`}
            >
              <span className="material-symbols-outlined text-xs">apartment</span>
              <span>Instalaciones</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-gutter py-8 space-y-8">
        {/* Top Executive KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Sedes Registradas
              </span>
              <span className="material-symbols-outlined text-primary text-xl">domain</span>
            </div>
            <p className="text-3xl font-black mt-2 text-on-surface">{branches.length}</p>
            <p className="text-xs text-on-surface-variant mt-1">
              {branches.filter((b) => b.isActive).length} operativas actualmente
            </p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Capacidad Simultánea
              </span>
              <span className="material-symbols-outlined text-blue-600 text-xl">groups</span>
            </div>
            <p className="text-3xl font-black mt-2 text-blue-600 dark:text-blue-400">{totalCapacity}</p>
            <p className="text-xs text-on-surface-variant mt-1">alumnos en {totalClassrooms} aulas/talleres</p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Cámaras CCTV Activas
              </span>
              <span className="material-symbols-outlined text-red-600 text-xl">videocam</span>
            </div>
            <p className="text-3xl font-black mt-2 text-red-600 dark:text-red-400">{totalCameras}</p>
            <p className="text-xs text-on-surface-variant mt-1">vigilancia y supervisión en vivo</p>
          </div>

          <div
            className={`bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm border-l-4 ${
              facilitiesWarning > 0 ? "border-l-red-500" : "border-l-emerald-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Estado Instalaciones
              </span>
              <span className="material-symbols-outlined text-emerald-600 text-xl">handyman</span>
            </div>
            <p
              className={`text-3xl font-black mt-2 ${
                facilitiesWarning > 0 ? "text-red-600" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {facilitiesWarning > 0 ? `${facilitiesWarning} alertas` : "100% Óptimo"}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">aires, planta eléctrica y redes</p>
          </div>
        </div>

        {/* Status Message Alert */}
        {statusMessage && (
          <div className="p-4 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            {statusMessage}
          </div>
        )}

        {/* TAB 1: OVERVIEW & SEDES LIST */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-title-md text-title-md font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">apartment</span>
                  Directorio de Sedes CEMPROZA
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Haz clic en cualquier sede para editar su nombre, teléfono, encargado, cámaras o instalaciones.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => {
                const branchCrit = branch.facilities?.filter((f) => f.status === "critico").length || 0;

                return (
                  <div
                    key={branch._id}
                    className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm hover:border-primary transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-lg leading-tight text-on-surface">{branch.name}</h4>
                          <span className="inline-block mt-1 bg-surface-variant text-on-surface text-[11px] font-bold px-2 py-0.5 rounded">
                            Ciudad: {branch.city}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                            branch.isActive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {branch.isActive ? "OPERATIVA" : "PAUSADA"}
                        </span>
                      </div>

                      <p className="text-xs text-on-surface-variant mt-3 flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-xs mt-0.5">location_on</span>
                        <span>{branch.address}</span>
                      </p>

                      <div className="mt-4 pt-3 border-t border-outline-variant/40 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant font-medium">Director / Encargado:</span>
                          <span className="font-bold">{branch.managerName || "Por asignar"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant font-medium">Teléfono Sede:</span>
                          <span className="font-bold">{branch.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant font-medium">Capacidad:</span>
                          <span className="font-bold">
                            {branch.totalCapacity} alumnos ({branch.classroomsCount} aulas)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant font-medium">Cámaras CCTV:</span>
                          <span className="font-bold text-red-600">{branch.cctvCameras?.length || 0} conectadas</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant font-medium">Instalaciones:</span>
                          <span
                            className={`font-bold ${
                              branchCrit > 0 ? "text-red-600" : "text-emerald-600"
                            }`}
                          >
                            {branchCrit > 0 ? `${branchCrit} en revisión` : "Todo operativo"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-outline-variant flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectBranchToEdit(branch)}
                        className="flex-1 bg-primary text-on-primary hover:bg-on-primary-container font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        <span>Editar Sede</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBranchId(branch._id);
                          setActiveTab("cctv");
                        }}
                        className="bg-surface-variant hover:bg-surface-dim text-on-surface font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                        title="Ver cámaras de esta sede"
                      >
                        <span className="material-symbols-outlined text-sm text-red-600">videocam</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BRANCH EDITOR (EDITOR DE NOMBRE Y DETALLES DE SEDE) */}
        {activeTab === "editor" && editingBranch && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant">
              <div>
                <h3 className="font-title-md text-title-md font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">edit_square</span>
                  Editor de Sede: <span className="text-primary">{editingBranch.name}</span>
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Modifica el nombre, datos de contacto, personal, cobranzas locales, estado de aulas y cámaras de seguridad.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => saveBranchChanges()}
                  disabled={isSaving}
                  className="bg-primary text-on-primary hover:bg-on-primary-container px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <span className={`material-symbols-outlined text-sm ${isSaving ? "animate-spin" : ""}`}>
                    {isSaving ? "autorenew" : "save"}
                  </span>
                  <span>{isSaving ? "Guardando..." : "Guardar Cambios de Sede"}</span>
                </button>
              </div>
            </div>

            <form onSubmit={saveBranchChanges} className="space-y-6">
              {/* Sección 1: Identidad Principal */}
              <div>
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">badge</span>
                  1. Identidad y Nombre de la Sede
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold mb-1">Nombre Completo de la Sede *</label>
                    <input
                      type="text"
                      required
                      value={editingBranch.name}
                      onChange={(e) => handleBranchFieldChange("name", e.target.value)}
                      placeholder="Ej: Sede Principal Barinas (Centro)"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm font-bold focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Código Único (Slug) *</label>
                    <input
                      type="text"
                      required
                      value={editingBranch.code}
                      onChange={(e) => handleBranchFieldChange("code", e.target.value)}
                      placeholder="barinas"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm font-mono focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Ciudad *</label>
                    <input
                      type="text"
                      required
                      value={editingBranch.city}
                      onChange={(e) => handleBranchFieldChange("city", e.target.value)}
                      placeholder="Barinas"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Estado / Región</label>
                    <input
                      type="text"
                      value={editingBranch.state || ""}
                      onChange={(e) => handleBranchFieldChange("state", e.target.value)}
                      placeholder="Barinas"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Punto de Referencia</label>
                    <input
                      type="text"
                      value={editingBranch.referencePoint || ""}
                      onChange={(e) => handleBranchFieldChange("referencePoint", e.target.value)}
                      placeholder="Frente al CC El Marqués"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold mb-1">Dirección Completa *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingBranch.address}
                    onChange={(e) => handleBranchFieldChange("address", e.target.value)}
                    placeholder="Av. Industrial con Calle Camejo, Edif. CEMPROZA, Piso 1"
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Sección 2: Operaciones y Encargado */}
              <div className="pt-4 border-t border-outline-variant/60">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">support_agent</span>
                  2. Contacto, Dirección y Capacidad
                </h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Director / Encargado</label>
                    <input
                      type="text"
                      value={editingBranch.managerName || ""}
                      onChange={(e) => handleBranchFieldChange("managerName", e.target.value)}
                      placeholder="Lic. Carlos Mendoza"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Teléfono Encargado</label>
                    <input
                      type="text"
                      value={editingBranch.managerPhone || ""}
                      onChange={(e) => handleBranchFieldChange("managerPhone", e.target.value)}
                      placeholder="0424-5551122"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Teléfono Recepción Sede *</label>
                    <input
                      type="text"
                      required
                      value={editingBranch.phone}
                      onChange={(e) => handleBranchFieldChange("phone", e.target.value)}
                      placeholder="0273-5321122"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">WhatsApp de la Sede</label>
                    <input
                      type="text"
                      value={editingBranch.whatsappPhone || ""}
                      onChange={(e) => handleBranchFieldChange("whatsappPhone", e.target.value)}
                      placeholder="0414-5321122"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Horario de Atención</label>
                    <input
                      type="text"
                      value={editingBranch.openingHours || ""}
                      onChange={(e) => handleBranchFieldChange("openingHours", e.target.value)}
                      placeholder="Lun a Vie 8am-5pm | Sáb 8am-2pm"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Capacidad Total de Alumnos</label>
                    <input
                      type="number"
                      value={editingBranch.totalCapacity || 0}
                      onChange={(e) => handleBranchFieldChange("totalCapacity", Number(e.target.value))}
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Número de Aulas / Talleres</label>
                    <input
                      type="number"
                      value={editingBranch.classroomsCount || 0}
                      onChange={(e) => handleBranchFieldChange("classroomsCount", Number(e.target.value))}
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Datos de Cobranza Local */}
              <div className="pt-4 border-t border-outline-variant/60">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">account_balance</span>
                  3. Datos Bancarios / Pago Móvil de la Sede
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Banco Receptor</label>
                    <input
                      type="text"
                      value={editingBranch.paymentInfo?.bankName || ""}
                      onChange={(e) => handlePaymentFieldChange("bankName", e.target.value)}
                      placeholder="Banesco / Banco de Venezuela"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Teléfono Pago Móvil</label>
                    <input
                      type="text"
                      value={editingBranch.paymentInfo?.pagoMovilPhone || ""}
                      onChange={(e) => handlePaymentFieldChange("pagoMovilPhone", e.target.value)}
                      placeholder="0414-5321122"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Cédula o RIF Receptor</label>
                    <input
                      type="text"
                      value={editingBranch.paymentInfo?.idOrRif || ""}
                      onChange={(e) => handlePaymentFieldChange("idOrRif", e.target.value)}
                      placeholder="J-409812345"
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 4: Semáforo de Instalaciones */}
              <div className="pt-4 border-t border-outline-variant/60">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">handyman</span>
                    4. Inspección de Instalaciones y Equipos ({editingBranch.facilities.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="text-xs bg-surface-variant hover:bg-surface-dim font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                    Agregar Área / Equipo
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {editingBranch.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="p-3 bg-surface-bright rounded-xl border border-outline-variant flex items-center justify-between gap-3"
                    >
                      <div className="flex-grow">
                        <span className="text-xs font-bold text-on-surface block">{facility.area}</span>
                        {facility.notes && (
                          <span className="text-[11px] text-on-surface-variant block">{facility.notes}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={facility.status}
                          onChange={(e) =>
                            handleFacilityStatusChange(index, e.target.value as IFacilityStatus["status"])
                          }
                          className={`text-xs font-bold rounded-lg px-2 py-1 border outline-none ${
                            facility.status === "optimo"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : facility.status === "mantenimiento"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : "bg-red-50 text-red-800 border-red-300"
                          }`}
                        >
                          <option value="optimo">Óptimo</option>
                          <option value="mantenimiento">Mantenimiento</option>
                          <option value="critico">Crítico / Alerta</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(index)}
                          className="text-error hover:bg-error-container/20 p-1 rounded"
                          title="Eliminar área"
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón Final */}
              <div className="pt-6 border-t border-outline-variant flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary text-on-primary hover:bg-on-primary-container px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-md disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-sm ${isSaving ? "animate-spin" : ""}`}>
                    {isSaving ? "autorenew" : "save"}
                  </span>
                  <span>{isSaving ? "Guardando..." : "Guardar Toda la Información de Sede"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: CCTV & CÁMARAS EN VIVO */}
        {activeTab === "cctv" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <div>
                <h3 className="font-title-md text-title-md font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600">videocam</span>
                  Monitoreo de Cámaras CCTV
                  {activeBranchView && <span className="text-primary text-sm font-bold">({activeBranchView.name})</span>}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Acceso a las cámaras de seguridad IP, snapshots y feeds en vivo para supervisar aulas y pasillos.
                </p>
              </div>

              {editingBranch && (
                <button
                  type="button"
                  onClick={handleAddCamera}
                  className="bg-primary text-on-primary hover:bg-on-primary-container px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                  <span>Conectar Nueva Cámara</span>
                </button>
              )}
            </div>

            {/* Cameras Grid */}
            {editingBranch && editingBranch.cctvCameras && editingBranch.cctvCameras.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {editingBranch.cctvCameras.map((camera, index) => (
                  <div
                    key={index}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Live Video / Snapshot Simulation */}
                      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
                        <img
                          src={camera.streamUrl}
                          alt={camera.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          EN VIVO
                        </div>
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                          {new Date().toLocaleTimeString("es-VE")}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewCamera(camera)}
                          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs gap-1"
                        >
                          <span className="material-symbols-outlined">fullscreen</span>
                          Ampliar Cámara
                        </button>
                      </div>

                      <div className="p-4">
                        <h4 className="font-bold text-sm text-on-surface">{camera.name}</h4>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-xs">pin_drop</span>
                          {camera.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-surface-container border-t border-outline-variant flex justify-between items-center text-xs">
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Conectada
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCamera(index)}
                        className="text-error hover:bg-error-container/20 p-1 rounded"
                        title="Desconectar cámara"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest p-12 text-center text-on-surface-variant rounded-xl border border-outline-variant">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">videocam_off</span>
                <p className="font-bold text-sm">No hay cámaras conectadas en esta sede aún.</p>
                <p className="text-xs mt-1">
                  Usa el botón &quot;Conectar Nueva Cámara&quot; para agregar feeds IP de tu DVR o snapshots.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FACILITIES SUMMARY */}
        {activeTab === "facilities" && (
          <div className="space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="font-title-md text-title-md font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">apartment</span>
                Auditoría Global de Infraestructura y Servicios
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Monitorea el estado de mantenimiento preventivo de aulas, climatización y plantas eléctricas de todas las sedes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {branches.map((b) => (
                <div
                  key={b._id}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant">
                    <h4 className="font-bold text-base text-on-surface">{b.name}</h4>
                    <span className="text-xs text-on-surface-variant">{b.city}</span>
                  </div>

                  <div className="space-y-2">
                    {b.facilities?.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 rounded-lg bg-surface-bright text-xs"
                      >
                        <span className="font-medium">{f.area}</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            f.status === "optimo"
                              ? "bg-emerald-100 text-emerald-800"
                              : f.status === "mantenimiento"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {f.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: REGISTRAR NUEVA SEDE */}
      {showNewBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
              <h3 className="font-title-md text-title-md font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_business</span>
                Registrar Nueva Sede CEMPROZA
              </h3>
              <button
                type="button"
                onClick={() => setShowNewBranchModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={createNewBranch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Nombre de la Sede *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sede Caracas (Chacao)"
                  value={newBranchData.name}
                  onChange={(e) => setNewBranchData({ ...newBranchData, name: e.target.value })}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Código Único (Slug) *</label>
                  <input
                    type="text"
                    required
                    placeholder="caracas-chacao"
                    value={newBranchData.code}
                    onChange={(e) => setNewBranchData({ ...newBranchData, code: e.target.value })}
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Ciudad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Caracas"
                    value={newBranchData.city}
                    onChange={(e) => setNewBranchData({ ...newBranchData, city: e.target.value })}
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Dirección Completa *</label>
                <input
                  type="text"
                  required
                  placeholder="Av. Francisco de Miranda, Edif. Centro Plaza..."
                  value={newBranchData.address}
                  onChange={(e) => setNewBranchData({ ...newBranchData, address: e.target.value })}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Teléfono Recepción *</label>
                  <input
                    type="text"
                    required
                    placeholder="0212-9998877"
                    value={newBranchData.phone}
                    onChange={(e) => setNewBranchData({ ...newBranchData, phone: e.target.value })}
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">WhatsApp Sede</label>
                  <input
                    type="text"
                    placeholder="0414-9998877"
                    value={newBranchData.whatsappPhone}
                    onChange={(e) => setNewBranchData({ ...newBranchData, whatsappPhone: e.target.value })}
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Director de Sede</label>
                  <input
                    type="text"
                    placeholder="Nombre del director"
                    value={newBranchData.managerName}
                    onChange={(e) => setNewBranchData({ ...newBranchData, managerName: e.target.value })}
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Capacidad Alumnos</label>
                  <input
                    type="number"
                    value={newBranchData.totalCapacity}
                    onChange={(e) => setNewBranchData({ ...newBranchData, totalCapacity: Number(e.target.value) })}
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-sm font-bold hover:bg-on-primary-container transition-colors"
                >
                  Registrar Sede
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewBranchModal(false)}
                  className="px-4 bg-surface-variant text-on-surface-variant rounded-lg text-sm font-bold hover:bg-surface-dim"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW DE CÁMARA A PANTALLA COMPLETA */}
      {previewCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black rounded-2xl border border-white/20 p-4 max-w-4xl w-full shadow-2xl space-y-3">
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-bold text-sm">{previewCamera.name}</span>
                <span className="text-xs text-white/60">({previewCamera.location})</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCamera(null)}
                className="text-white hover:text-white/80 p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={previewCamera.streamUrl}
                alt={previewCamera.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
