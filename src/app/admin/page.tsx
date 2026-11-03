"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  isActive: boolean;
  whatsappGroupLink?: string;
}

interface LeadItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  branchId?: string;
  status: 'nuevo' | 'contactado' | 'inscrito' | 'descartado';
  notes?: string;
  createdAt: string;
}

interface IAttendance {
  date: string;
  status: 'presente' | 'ausente' | 'justificado';
  notes?: string;
}

interface StudentItem {
  _id: string;
  name: string;
  identificationId?: string;
  email?: string;
  phone: string;
  course: string;
  academicStatus: 'cursando' | 'completado' | 'pausado' | 'retirado';
  paymentStatus: 'solvente' | 'pendiente' | 'becado';
  attendance?: IAttendance[];
  notes?: string;
  createdAt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("courses");
  
  // Courses State
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [courseFilterStatus, setCourseFilterStatus] = useState<"todos" | "activos" | "pausados">("todos");

  const [courseFormData, setCourseFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    isActive: true,
    whatsappGroupLink: "",
  });

  // Students State
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentFilterCourse, setStudentFilterCourse] = useState("todos");
  const [studentFilterAcademic, setStudentFilterAcademic] = useState("todos");
  const [studentFilterPayment, setStudentFilterPayment] = useState("todos");
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    identificationId: "",
    email: "",
    phone: "",
    course: "",
    academicStatus: "cursando" as const,
    paymentStatus: "pendiente" as const,
    notes: "",
  });

  // WhatsApp Hub State
  const [selectedWhatsappCourse, setSelectedWhatsappCourse] = useState<string>("");
  const [whatsappTemplateMessage, setWhatsappTemplateMessage] = useState(
    "Hola {nombre}, te escribimos de CEMPROZA para informarte sobre las clases de tu curso {curso}. ¡Esperamos contar con tu asistencia!"
  );
  const [courseGroupUrlInput, setCourseGroupUrlInput] = useState("");
  const [isSavingGroupLink, setIsSavingGroupLink] = useState(false);

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [leadsFilterStatus, setLeadsFilterStatus] = useState("todos");
  const [leadsSearch, setLeadsSearch] = useState("");
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Settings State
  const [settingsFormData, setSettingsFormData] = useState({
    heroTitle: "",
    heroSubtitle: "",
  });
  const [settingsVideo, setSettingsVideo] = useState<File | null>(null);
  const [isSubmittingSettings, setIsSubmittingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  useEffect(() => {
    fetchCourses();
    fetchSettings();
    fetchLeads();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handleLeadStatusChange = async (id: string, newStatus: LeadItem['status']) => {
    setUpdatingLeadId(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => (l._id === id ? updated : l)));
      } else {
        alert("Error al actualizar el estado");
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("¿Eliminar este registro de inscripción?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l._id !== id));
      } else {
        alert("Error al eliminar la inscripción");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const getWhatsAppUrl = (phone: string, name: string, course: string) => {
    let digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      digits = "58" + digits.slice(1);
    } else if (digits.length === 10 && !digits.startsWith("58")) {
      digits = "58" + digits;
    }
    const msg = `Hola ${name}, te saludamos del instituto CEMPROZA respecto a tu inscripción en el curso de ${course}.`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  };

  const exportLeadsCSV = () => {
    if (filteredLeads.length === 0) {
      alert("No hay registros para exportar.");
      return;
    }
    const headers = ["Nombre", "Email", "Teléfono", "Curso", "Estado", "Fecha"];
    const rows = filteredLeads.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`,
      `"${l.course.replace(/"/g, '""')}"`,
      `"${l.status || 'nuevo'}"`,
      `"${new Date(l.createdAt).toLocaleString('es-VE')}"`,
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inscripciones_cemproza_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettingsFormData({
        heroTitle: data.heroTitle || "",
        heroSubtitle: data.heroSubtitle || "",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCourseFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettingsFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSettingsFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSettingsVideo(e.target.files[0]);
    }
  };

  const submitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/courses/${editingId}` : "/api/courses";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseFormData),
      });
      
      if (res.ok) {
        setCourseFormData({ title: "", description: "", imageUrl: "", videoUrl: "", isActive: true });
        setEditingId(null);
        fetchCourses();
      } else {
        alert("Error al guardar el curso");
      }
    } catch (error) {
      console.error("Error saving course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSettings(true);
    setSettingsMessage("");
    
    const formData = new FormData();
    formData.append("heroTitle", settingsFormData.heroTitle);
    formData.append("heroSubtitle", settingsFormData.heroSubtitle);
    if (settingsVideo) {
      formData.append("heroVideo", settingsVideo);
    }

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        setSettingsMessage("Configuración guardada exitosamente");
        setSettingsVideo(null); // Reset file input
      } else {
        setSettingsMessage("Hubo un error al guardar");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSettingsMessage("Hubo un error de conexión");
    } finally {
      setIsSubmittingSettings(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course._id);
    setCourseFormData({
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      videoUrl: course.videoUrl || "",
      isActive: course.isActive,
      whatsappGroupLink: course.whatsappGroupLink || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const togglePauseCourse = async (course: Course) => {
    try {
      const res = await fetch(`/api/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !course.isActive }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCourses(prev => prev.map(c => (c._id === course._id ? updated : c)));
      } else {
        alert("Error al cambiar el estado del curso");
      }
    } catch (error) {
      console.error("Error toggling course status:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCourseFormData({ title: "", description: "", imageUrl: "", videoUrl: "", isActive: true, whatsappGroupLink: "" });
  };

  const handleEnrollLeadToStudent = async (lead: LeadItem) => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          course: lead.course,
          leadId: lead._id,
          academicStatus: "cursando",
          paymentStatus: "solvente",
        }),
      });
      if (res.ok) {
        alert(`¡${lead.name} fue matriculado(a) exitosamente como Alumno!`);
        fetchStudents();
        fetchLeads();
      } else {
        alert("Error al matricular alumno");
      }
    } catch (error) {
      console.error("Error enrolling lead:", error);
    }
  };

  const handleStudentAcademicStatus = async (id: string, newStatus: StudentItem['academicStatus']) => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ academicStatus: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setStudents(prev => prev.map(s => (s._id === id ? updated : s)));
      }
    } catch (error) {
      console.error("Error updating academic status:", error);
    }
  };

  const handleStudentPaymentStatus = async (id: string, newStatus: StudentItem['paymentStatus']) => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setStudents(prev => prev.map(s => (s._id === id ? updated : s)));
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("¿Eliminar este alumno del registro?")) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents(prev => prev.filter(s => s._id !== id));
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleQuickAttendance = async (studentId: string, status: 'presente' | 'ausente' | 'justificado') => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const res = await fetch("/api/students/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          records: [{ studentId, status }],
        }),
      });
      if (res.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  const submitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentFormData),
      });
      if (res.ok) {
        setShowNewStudentModal(false);
        setStudentFormData({
          name: "",
          identificationId: "",
          email: "",
          phone: "",
          course: courses[0]?.title || "",
          academicStatus: "cursando",
          paymentStatus: "pendiente",
          notes: "",
        });
        fetchStudents();
      } else {
        alert("Error al registrar alumno");
      }
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const saveCourseWhatsappGroupLink = async (courseId: string, link: string) => {
    setIsSavingGroupLink(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappGroupLink: link }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCourses(prev => prev.map(c => (c._id === courseId ? updated : c)));
        alert("Enlace de grupo de WhatsApp actualizado.");
      }
    } catch (error) {
      console.error("Error saving whatsapp group link:", error);
    } finally {
      setIsSavingGroupLink(false);
    }
  };

  const getCustomWhatsAppUrl = (phone: string, template: string, studentName: string, courseName: string) => {
    let digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      digits = "58" + digits.slice(1);
    } else if (digits.length === 10 && !digits.startsWith("58")) {
      digits = "58" + digits;
    }
    const message = template
      .replace(/{nombre}/gi, studentName)
      .replace(/{curso}/gi, courseName);
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  };

  const copyAllCoursePhones = (courseStudents: StudentItem[]) => {
    if (courseStudents.length === 0) {
      alert("No hay alumnos inscritos en este curso.");
      return;
    }
    const phones = courseStudents.map(s => {
      let d = s.phone.replace(/\D/g, "");
      if (d.startsWith("0")) d = "58" + d.slice(1);
      else if (d.length === 10 && !d.startsWith("58")) d = "58" + d;
      return "+" + d;
    });
    navigator.clipboard.writeText(phones.join(", "));
    alert(`Se copiaron ${phones.length} números telefónicos al portapapeles listos para crear o invitar al grupo.`);
  };

  const filteredLeads = leads.filter(l => {
    const currentStatus = l.status || "nuevo";
    const matchesStatus = leadsFilterStatus === "todos" || currentStatus === leadsFilterStatus;
    const searchLower = leadsSearch.toLowerCase();
    const matchesSearch = 
      !leadsSearch ||
      l.name.toLowerCase().includes(searchLower) ||
      l.email.toLowerCase().includes(searchLower) ||
      l.phone.toLowerCase().includes(searchLower) ||
      l.course.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  const leadCounts = {
    total: leads.length,
    nuevo: leads.filter(l => !l.status || l.status === "nuevo").length,
    contactado: leads.filter(l => l.status === "contactado").length,
    inscrito: leads.filter(l => l.status === "inscrito").length,
    descartado: leads.filter(l => l.status === "descartado").length,
  };

  const filteredCourses = courses.filter(c => {
    if (courseFilterStatus === "activos") return c.isActive;
    if (courseFilterStatus === "pausados") return !c.isActive;
    return true;
  });

  const filteredStudents = students.filter(s => {
    const matchesCourse = studentFilterCourse === "todos" || s.course === studentFilterCourse;
    const matchesAcademic = studentFilterAcademic === "todos" || s.academicStatus === studentFilterAcademic;
    const matchesPayment = studentFilterPayment === "todos" || s.paymentStatus === studentFilterPayment;
    const searchLower = studentSearch.toLowerCase();
    const matchesSearch =
      !studentSearch ||
      s.name.toLowerCase().includes(searchLower) ||
      (s.identificationId && s.identificationId.toLowerCase().includes(searchLower)) ||
      s.phone.toLowerCase().includes(searchLower) ||
      (s.email && s.email.toLowerCase().includes(searchLower)) ||
      s.course.toLowerCase().includes(searchLower);
    return matchesCourse && matchesAcademic && matchesPayment && matchesSearch;
  });

  const studentCounts = {
    total: students.length,
    cursando: students.filter(s => s.academicStatus === "cursando").length,
    completado: students.filter(s => s.academicStatus === "completado").length,
    pausado: students.filter(s => s.academicStatus === "pausado").length,
    retirado: students.filter(s => s.academicStatus === "retirado").length,
    solvente: students.filter(s => s.paymentStatus === "solvente").length,
    pendiente: students.filter(s => s.paymentStatus === "pendiente").length,
  };

  // Default selected course for WhatsApp hub
  const currentWhatsappCourse = courses.find(c => c.title === selectedWhatsappCourse) || courses[0];
  const whatsappCourseStudents = currentWhatsappCourse
    ? students.filter(s => s.course.toLowerCase() === currentWhatsappCourse.title.toLowerCase())
    : [];

  return (
    <div className="min-h-screen bg-surface-grey font-body-md text-on-background">
      <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            <span className="font-headline-lg text-title-md font-black text-on-surface">Panel de Administración</span>
          </div>
          <Link href="/" className="text-primary hover:underline text-sm font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Ver sitio
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-surface border-b border-outline-variant overflow-x-auto">
        <div className="max-w-container-max mx-auto px-gutter flex gap-6 min-w-max">
          <button 
            onClick={() => setActiveTab("courses")}
            className={`py-4 px-2 border-b-2 font-bold text-sm transition-colors flex items-center gap-1.5 ${activeTab === 'courses' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-sm">auto_stories</span>
            <span>Gestor de Cursos</span>
          </button>
          <button 
            onClick={() => setActiveTab("students")}
            className={`py-4 px-2 border-b-2 font-bold text-sm transition-colors flex items-center gap-1.5 ${activeTab === 'students' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-sm">school</span>
            <span>Alumnos y Asistencias</span>
            {studentCounts.total > 0 && (
              <span className="bg-surface-variant text-on-surface text-xs px-2 py-0.5 rounded-full font-bold">
                {studentCounts.total}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("whatsapp")}
            className={`py-4 px-2 border-b-2 font-bold text-sm transition-colors flex items-center gap-1.5 ${activeTab === 'whatsapp' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
            <span>Hub WhatsApp Cursos</span>
          </button>
          <button 
            onClick={() => setActiveTab("leads")}
            className={`py-4 px-2 border-b-2 font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'leads' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-sm">contact_page</span>
            <span>Inscripciones Web</span>
            {leadCounts.nuevo > 0 && (
              <span className="bg-primary text-on-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {leadCounts.nuevo}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`py-4 px-2 border-b-2 font-bold text-sm transition-colors flex items-center gap-1.5 ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Configuración Hero</span>
          </button>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-gutter py-8">
        
        {activeTab === "settings" && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6 max-w-2xl mx-auto">
            <h2 className="font-title-md text-title-md mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">settings</span>
              Configuración de la Portada (Hero)
            </h2>
            
            {settingsMessage && (
              <div className="mb-4 p-3 bg-primary-container/20 text-on-primary-container rounded border border-primary-container/30 text-sm">
                {settingsMessage}
              </div>
            )}
            
            <form onSubmit={submitSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-1">Título de la Portada</label>
                <input 
                  type="text" name="heroTitle" required value={settingsFormData.heroTitle} onChange={handleSettingsChange}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Subtítulo (Hashtag/Firma)</label>
                <input 
                  type="text" name="heroSubtitle" required value={settingsFormData.heroSubtitle} onChange={handleSettingsChange}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/50">
                <label className="block text-sm font-bold mb-2">Video de Fondo (Formato Vertical MP4)</label>
                <input 
                  type="file" name="heroVideo" accept="video/mp4,video/webm" onChange={handleSettingsFile}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary-container/80 cursor-pointer"
                />
                <p className="text-xs text-on-surface-variant mt-2">
                  Si no seleccionas ningún archivo, se mantendrá el video actual. La subida tomará unos segundos porque se envía a ImageKit.
                </p>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" disabled={isSubmittingSettings}
                  className="w-full bg-primary text-on-primary py-3 rounded-lg text-sm font-bold hover:bg-on-primary-container transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmittingSettings ? (
                    <><span className="material-symbols-outlined animate-spin text-sm">autorenew</span> Guardando y subiendo...</>
                  ) : "Guardar Configuración"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="grid md:grid-cols-3 gap-8">
            <section className="md:col-span-1">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6 sticky top-28">
                <h2 className="font-title-md text-title-md mb-6">{editingId ? "Editar Curso" : "Agregar Nuevo Curso"}</h2>
                
                <form onSubmit={submitCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Título</label>
                    <input 
                      type="text" name="title" required value={courseFormData.title} onChange={handleCourseChange}
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-1">Descripción corta</label>
                    <textarea 
                      name="description" required value={courseFormData.description} onChange={handleCourseChange} rows={3}
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">URL de la Imagen</label>
                    <input 
                      type="url" name="imageUrl" required value={courseFormData.imageUrl} onChange={handleCourseChange}
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">URL del Video (Opcional)</label>
                    <input 
                      type="url" name="videoUrl" value={courseFormData.videoUrl} onChange={handleCourseChange}
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">Enlace del Grupo de WhatsApp (Opcional)</label>
                    <input 
                      type="url" name="whatsappGroupLink" placeholder="https://chat.whatsapp.com/..." value={courseFormData.whatsappGroupLink} onChange={handleCourseChange}
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" id="isActive" name="isActive" checked={courseFormData.isActive} onChange={handleCourseChange}
                      className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary"
                    />
                    <label htmlFor="isActive" className="text-sm cursor-pointer">Curso Activo (Visible en la web)</label>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button 
                      type="submit" disabled={isSubmitting}
                      className="flex-1 bg-primary text-on-primary py-2 rounded-lg text-sm font-bold hover:bg-on-primary-container disabled:opacity-50"
                    >
                      {isSubmitting ? "Guardando..." : (editingId ? "Actualizar Curso" : "Crear Curso")}
                    </button>
                    {editingId && (
                      <button 
                        type="button" onClick={handleCancelEdit}
                        className="px-4 bg-surface-variant text-on-surface-variant rounded-lg text-sm font-bold hover:bg-surface-dim"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </section>

            <section className="md:col-span-2">
              {/* Courses Filter Bar */}
              <div className="flex items-center justify-between mb-4 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-on-surface-variant">Filtrar:</span>
                  <button
                    type="button"
                    onClick={() => setCourseFilterStatus("todos")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      courseFilterStatus === 'todos' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant hover:bg-surface-dim'
                    }`}
                  >
                    Todos ({courses.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourseFilterStatus("activos")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      courseFilterStatus === 'activos' ? 'bg-emerald-600 text-white' : 'bg-surface-variant text-on-surface-variant hover:bg-surface-dim'
                    }`}
                  >
                    Activos ({courses.filter(c => c.isActive).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourseFilterStatus("pausados")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      courseFilterStatus === 'pausados' ? 'bg-amber-600 text-white' : 'bg-surface-variant text-on-surface-variant hover:bg-surface-dim'
                    }`}
                  >
                    Pausados ({courses.filter(c => !c.isActive).length})
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center p-12"><span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span></div>
              ) : filteredCourses.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center text-on-surface-variant">
                  <p>No se encontraron cursos con este filtro.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredCourses.map(course => (
                    <div key={course._id} className={`bg-surface-container-lowest rounded-xl border ${editingId === course._id ? 'border-primary shadow-sm' : 'border-outline-variant'} p-4 flex flex-col sm:flex-row gap-4 transition-all`}>
                      <div className="w-full sm:w-36 h-28 rounded-lg bg-surface-variant flex-shrink-0 overflow-hidden relative">
                        {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />}
                        {!course.isActive && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                            <span className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                              Pausado
                            </span>
                            <span className="text-[10px] text-white/90">Oculto en web</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                              course.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {course.isActive ? 'Activo' : 'Pausado'}
                            </span>
                          </div>
                          <p className="text-sm text-on-surface-variant line-clamp-2 mt-1">{course.description}</p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-outline-variant/40">
                          <div className="flex items-center gap-2">
                            {/* 1-Click Pause Toggle */}
                            <button
                              type="button"
                              onClick={() => togglePauseCourse(course)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                                course.isActive
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              }`}
                              title={course.isActive ? "Pausar curso (ocultar de la landing)" : "Reanudar curso (mostrar en la landing)"}
                            >
                              <span className="material-symbols-outlined text-xs">
                                {course.isActive ? 'pause_circle' : 'play_circle'}
                              </span>
                              <span>{course.isActive ? 'Pausar' : 'Activar'}</span>
                            </button>

                            {course.whatsappGroupLink ? (
                              <a
                                href={course.whatsappGroupLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                                title="Abrir grupo de WhatsApp"
                              >
                                <span className="material-symbols-outlined text-xs">groups</span>
                                <span>Grupo WhatsApp</span>
                              </a>
                            ) : (
                              <span className="text-[11px] text-on-surface-variant italic">Sin grupo de WhatsApp</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEdit(course)} className="text-primary hover:bg-primary-container/20 p-2 rounded-full" title="Editar"><span className="material-symbols-outlined text-sm">edit</span></button>
                            <button onClick={() => handleDelete(course._id)} className="text-error hover:bg-error-container/20 p-2 rounded-full" title="Eliminar"><span className="material-symbols-outlined text-sm">delete</span></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "leads" && (
          <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <div>
                <h2 className="font-title-md text-title-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">how_to_reg</span>
                  Gestión de Inscripciones y Prospectos
                </h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Revisa los prospectos registrados desde la landing, contáctalos por WhatsApp y gestiona su estado de inscripción.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={fetchLeads}
                  disabled={isLoadingLeads}
                  className="px-3 py-2 bg-surface-variant text-on-surface-variant hover:bg-surface-dim rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors"
                  title="Refrescar lista"
                >
                  <span className={`material-symbols-outlined text-sm ${isLoadingLeads ? 'animate-spin' : ''}`}>sync</span>
                  <span>Refrescar</span>
                </button>
                <button
                  type="button"
                  onClick={exportLeadsCSV}
                  disabled={filteredLeads.length === 0}
                  className="px-4 py-2 bg-primary text-on-primary hover:bg-on-primary-container rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Registrados</span>
                  <span className="material-symbols-outlined text-primary text-xl">groups</span>
                </div>
                <p className="text-2xl font-black mt-2 text-on-surface">{leadCounts.total}</p>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Nuevos (Sin Contactar)</span>
                  <span className="material-symbols-outlined text-amber-500 text-xl">mark_email_unread</span>
                </div>
                <p className="text-2xl font-black mt-2 text-amber-600 dark:text-amber-300">{leadCounts.nuevo}</p>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Contactados</span>
                  <span className="material-symbols-outlined text-blue-500 text-xl">support_agent</span>
                </div>
                <p className="text-2xl font-black mt-2 text-blue-600 dark:text-blue-300">{leadCounts.contactado}</p>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Inscritos</span>
                  <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                </div>
                <p className="text-2xl font-black mt-2 text-emerald-600 dark:text-emerald-300">{leadCounts.inscrito}</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
                <input
                  type="text"
                  placeholder="Buscar por estudiante, teléfono, correo o curso..."
                  value={leadsSearch}
                  onChange={(e) => setLeadsSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-surface-bright border border-outline-variant rounded-lg text-sm focus:border-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-on-surface-variant whitespace-nowrap">Filtrar Estado:</label>
                <select
                  value={leadsFilterStatus}
                  onChange={(e) => setLeadsFilterStatus(e.target.value)}
                  className="bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none font-medium"
                >
                  <option value="todos">Todos ({leads.length})</option>
                  <option value="nuevo">Nuevos ({leadCounts.nuevo})</option>
                  <option value="contactado">Contactados ({leadCounts.contactado})</option>
                  <option value="inscrito">Inscritos ({leadCounts.inscrito})</option>
                  <option value="descartado">Descartados ({leadCounts.descartado})</option>
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
              {isLoadingLeads ? (
                <div className="flex justify-center p-12">
                  <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">person_off</span>
                  <p className="font-bold">No se encontraron inscripciones</p>
                  <p className="text-xs mt-1">
                    {leads.length === 0 ? "Aún no hay prospectos registrados desde la página web." : "Ningún registro coincide con los filtros aplicados."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container border-b border-outline-variant text-xs text-on-surface-variant uppercase font-bold">
                      <tr>
                        <th className="py-3 px-4">Estudiante</th>
                        <th className="py-3 px-4">Curso Solicitado</th>
                        <th className="py-3 px-4">Contacto / WhatsApp</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {filteredLeads.map((lead) => {
                        const status = lead.status || "nuevo";
                        const isUpdating = updatingLeadId === lead._id;

                        return (
                          <tr key={lead._id} className="hover:bg-surface-bright/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-on-surface">{lead.name}</div>
                              <div className="text-xs text-on-surface-variant">{lead.email}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="inline-block px-2.5 py-1 rounded-md bg-primary-container/20 text-on-primary-container font-semibold text-xs border border-primary-container/40">
                                {lead.course}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{lead.phone}</span>
                                <a
                                  href={getWhatsAppUrl(lead.phone, lead.name, lead.course)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded text-xs font-bold transition-colors"
                                  title="Abrir chat de WhatsApp"
                                >
                                  <span className="material-symbols-outlined text-xs">chat</span>
                                  WhatsApp
                                </a>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-xs text-on-surface-variant whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleDateString("es-VE", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <select
                                  value={status}
                                  disabled={isUpdating}
                                  onChange={(e) => handleLeadStatusChange(lead._id, e.target.value as LeadItem["status"])}
                                  className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer transition-colors ${
                                    status === "nuevo"
                                      ? "bg-amber-50 text-amber-800 border-amber-300"
                                      : status === "contactado"
                                      ? "bg-blue-50 text-blue-800 border-blue-300"
                                      : status === "inscrito"
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                      : "bg-neutral-100 text-neutral-600 border-neutral-300"
                                  }`}
                                >
                                  <option value="nuevo">Nuevo</option>
                                  <option value="contactado">Contactado</option>
                                  <option value="inscrito">Inscrito</option>
                                  <option value="descartado">Descartado</option>
                                </select>
                                {isUpdating && (
                                  <span className="material-symbols-outlined animate-spin text-xs text-primary">autorenew</span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {status !== "inscrito" ? (
                                  <button
                                    type="button"
                                    onClick={() => handleEnrollLeadToStudent(lead)}
                                    className="inline-flex items-center gap-1 bg-primary text-on-primary hover:bg-on-primary-container px-2.5 py-1 rounded-md text-xs font-bold transition-colors"
                                    title="Matricular como Alumno Oficial"
                                  >
                                    <span className="material-symbols-outlined text-xs">school</span>
                                    <span>Matricular</span>
                                  </button>
                                ) : (
                                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 mr-1">
                                    <span className="material-symbols-outlined text-xs">verified</span>
                                    Matriculado
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLead(lead._id)}
                                  className="text-error hover:bg-error-container/20 p-1.5 rounded-full transition-colors"
                                  title="Eliminar registro"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STUDENTS & ATTENDANCE TAB */}
        {activeTab === "students" && (
          <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <div>
                <h2 className="font-title-md text-title-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">school</span>
                  Gestión de Alumnos y Asistencias
                </h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Control académico integral: estudiantes activos, egresados, estado de solvencia y toma de asistencia presencial.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={fetchStudents}
                  disabled={isLoadingStudents}
                  className="px-3 py-2 bg-surface-variant text-on-surface-variant hover:bg-surface-dim rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors"
                  title="Refrescar listado"
                >
                  <span className={`material-symbols-outlined text-sm ${isLoadingStudents ? 'animate-spin' : ''}`}>sync</span>
                  <span>Refrescar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewStudentModal(true)}
                  className="px-4 py-2 bg-primary text-on-primary hover:bg-on-primary-container rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  <span>Nuevo Alumno</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Alumnos</span>
                  <span className="material-symbols-outlined text-primary text-xl">group</span>
                </div>
                <p className="text-2xl font-black mt-2 text-on-surface">{studentCounts.total}</p>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Cursando Actualmente</span>
                  <span className="material-symbols-outlined text-blue-500 text-xl">menu_book</span>
                </div>
                <p className="text-2xl font-black mt-2 text-blue-600 dark:text-blue-300">{studentCounts.cursando}</p>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Completados / Egresados</span>
                  <span className="material-symbols-outlined text-emerald-500 text-xl">workspace_premium</span>
                </div>
                <p className="text-2xl font-black mt-2 text-emerald-600 dark:text-emerald-300">{studentCounts.completado}</p>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pagos Pendientes</span>
                  <span className="material-symbols-outlined text-amber-500 text-xl">pending_actions</span>
                </div>
                <p className="text-2xl font-black mt-2 text-amber-600 dark:text-amber-300">{studentCounts.pendiente}</p>
              </div>
            </div>

            {/* Modal: Nuevo Alumno */}
            {showNewStudentModal && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 max-w-lg w-full shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-title-md text-title-md font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">person_add</span>
                      Registrar Nuevo Alumno
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewStudentModal(false)}
                      className="text-on-surface-variant hover:text-on-surface p-1 rounded-full"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <form onSubmit={submitStudent} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Juan Pérez"
                        value={studentFormData.name}
                        onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                        className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-1">Cédula / DNI</label>
                        <input
                          type="text"
                          placeholder="V-12345678"
                          value={studentFormData.identificationId}
                          onChange={(e) => setStudentFormData({ ...studentFormData, identificationId: e.target.value })}
                          className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Teléfono / WhatsApp *</label>
                        <input
                          type="text"
                          required
                          placeholder="0414-1234567"
                          value={studentFormData.phone}
                          onChange={(e) => setStudentFormData({ ...studentFormData, phone: e.target.value })}
                          className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        placeholder="alumno@ejemplo.com"
                        value={studentFormData.email}
                        onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
                        className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">Curso Asignado *</label>
                      <select
                        required
                        value={studentFormData.course}
                        onChange={(e) => setStudentFormData({ ...studentFormData, course: e.target.value })}
                        className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                      >
                        <option value="">Selecciona un curso...</option>
                        {courses.map((c) => (
                          <option key={c._id} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-1">Estado Académico</label>
                        <select
                          value={studentFormData.academicStatus}
                          onChange={(e) =>
                            setStudentFormData({
                              ...studentFormData,
                              academicStatus: e.target.value as StudentItem["academicStatus"],
                            })
                          }
                          className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                        >
                          <option value="cursando">Cursando</option>
                          <option value="completado">Completado</option>
                          <option value="pausado">Pausado</option>
                          <option value="retirado">Retirado</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">Estado de Pago</label>
                        <select
                          value={studentFormData.paymentStatus}
                          onChange={(e) =>
                            setStudentFormData({
                              ...studentFormData,
                              paymentStatus: e.target.value as StudentItem["paymentStatus"],
                            })
                          }
                          className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="solvente">Solvente</option>
                          <option value="becado">Becado</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-sm font-bold hover:bg-on-primary-container transition-colors"
                      >
                        Guardar Alumno
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewStudentModal(false)}
                        className="px-4 bg-surface-variant text-on-surface-variant rounded-lg text-sm font-bold hover:bg-surface-dim"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula, teléfono o curso..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-surface-bright border border-outline-variant rounded-lg text-sm focus:border-primary outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={studentFilterCourse}
                  onChange={(e) => setStudentFilterCourse(e.target.value)}
                  className="bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-xs focus:border-primary outline-none font-bold"
                >
                  <option value="todos">Todos los Cursos</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>

                <select
                  value={studentFilterAcademic}
                  onChange={(e) => setStudentFilterAcademic(e.target.value)}
                  className="bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-xs focus:border-primary outline-none font-bold"
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="cursando">Cursando ({studentCounts.cursando})</option>
                  <option value="completado">Completados ({studentCounts.completado})</option>
                  <option value="pausado">Pausados ({studentCounts.pausado})</option>
                  <option value="retirado">Retirados ({studentCounts.retirado})</option>
                </select>

                <select
                  value={studentFilterPayment}
                  onChange={(e) => setStudentFilterPayment(e.target.value)}
                  className="bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-xs focus:border-primary outline-none font-bold"
                >
                  <option value="todos">Todos los Pagos</option>
                  <option value="solvente">Solventes ({studentCounts.solvente})</option>
                  <option value="pendiente">Pendientes ({studentCounts.pendiente})</option>
                  <option value="becado">Becados</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
              {isLoadingStudents ? (
                <div className="flex justify-center p-12">
                  <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">school</span>
                  <p className="font-bold">No se encontraron alumnos</p>
                  <p className="text-xs mt-1">
                    {students.length === 0
                      ? "Aún no hay alumnos matriculados. Puedes matricular prospectos desde la pestaña 'Inscripciones Web' o registrar uno nuevo."
                      : "Ningún alumno coincide con los filtros de búsqueda."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container border-b border-outline-variant text-xs text-on-surface-variant uppercase font-bold">
                      <tr>
                        <th className="py-3 px-4">Alumno / Cédula</th>
                        <th className="py-3 px-4">Curso Asignado</th>
                        <th className="py-3 px-4">Contacto / WhatsApp</th>
                        <th className="py-3 px-4">Estado Académico</th>
                        <th className="py-3 px-4">Solvencia</th>
                        <th className="py-3 px-4 text-center">Asistencia Hoy</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {filteredStudents.map((student) => {
                        const todayStr = new Date().toISOString().slice(0, 10);
                        const todayAttendance = student.attendance?.find((a) => a.date === todayStr);

                        return (
                          <tr key={student._id} className="hover:bg-surface-bright/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-on-surface">{student.name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {student.identificationId ? (
                                  <span className="text-xs font-mono bg-surface-variant px-1.5 py-0.5 rounded text-on-surface">
                                    {student.identificationId}
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-on-surface-variant italic">Sin cédula</span>
                                )}
                                {student.email && (
                                  <span className="text-xs text-on-surface-variant truncate max-w-[140px]" title={student.email}>
                                    {student.email}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="inline-block px-2.5 py-1 rounded-md bg-primary-container/20 text-on-primary-container font-semibold text-xs border border-primary-container/40">
                                {student.course}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{student.phone}</span>
                                <a
                                  href={getWhatsAppUrl(student.phone, student.name, student.course)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded text-xs font-bold transition-colors"
                                  title="Chatear por WhatsApp"
                                >
                                  <span className="material-symbols-outlined text-xs">chat</span>
                                  WhatsApp
                                </a>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <select
                                value={student.academicStatus}
                                onChange={(e) =>
                                  handleStudentAcademicStatus(
                                    student._id,
                                    e.target.value as StudentItem["academicStatus"]
                                  )
                                }
                                className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer transition-colors ${
                                  student.academicStatus === "cursando"
                                    ? "bg-blue-50 text-blue-800 border-blue-300"
                                    : student.academicStatus === "completado"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    : student.academicStatus === "pausado"
                                    ? "bg-amber-50 text-amber-800 border-amber-300"
                                    : "bg-neutral-100 text-neutral-600 border-neutral-300"
                                }`}
                              >
                                <option value="cursando">Cursando</option>
                                <option value="completado">Completado</option>
                                <option value="pausado">Pausado</option>
                                <option value="retirado">Retirado</option>
                              </select>
                            </td>

                            <td className="py-3.5 px-4">
                              <select
                                value={student.paymentStatus}
                                onChange={(e) =>
                                  handleStudentPaymentStatus(
                                    student._id,
                                    e.target.value as StudentItem["paymentStatus"]
                                  )
                                }
                                className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer transition-colors ${
                                  student.paymentStatus === "solvente"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    : student.paymentStatus === "becado"
                                    ? "bg-purple-50 text-purple-800 border-purple-300"
                                    : "bg-amber-50 text-amber-800 border-amber-300"
                                }`}
                              >
                                <option value="solvente">Solvente</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="becado">Becado</option>
                              </select>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex items-center gap-1 bg-surface-variant p-1 rounded-lg">
                                <button
                                  type="button"
                                  onClick={() => handleQuickAttendance(student._id, "presente")}
                                  className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                                    todayAttendance?.status === "presente"
                                      ? "bg-emerald-600 text-white shadow-sm"
                                      : "hover:bg-surface-bright text-on-surface-variant"
                                  }`}
                                  title="Marcar Presente"
                                >
                                  P
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAttendance(student._id, "ausente")}
                                  className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                                    todayAttendance?.status === "ausente"
                                      ? "bg-error text-white shadow-sm"
                                      : "hover:bg-surface-bright text-on-surface-variant"
                                  }`}
                                  title="Marcar Ausente"
                                >
                                  A
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAttendance(student._id, "justificado")}
                                  className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                                    todayAttendance?.status === "justificado"
                                      ? "bg-amber-600 text-white shadow-sm"
                                      : "hover:bg-surface-bright text-on-surface-variant"
                                  }`}
                                  title="Marcar Justificado"
                                >
                                  J
                                </button>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(student._id)}
                                className="text-error hover:bg-error-container/20 p-1.5 rounded-full transition-colors"
                                title="Eliminar alumno"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WHATSAPP HUB TAB */}
        {activeTab === "whatsapp" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-title-md text-title-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">forum</span>
                  Hub de WhatsApp por Curso
                </h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Gestiona las comunicaciones masivas y directas con los alumnos de cada curso para la secretaría académica.
                </p>
              </div>

              {/* Course Selector */}
              <div className="w-full md:w-auto flex items-center gap-2">
                <label className="text-xs font-bold text-on-surface-variant whitespace-nowrap">Curso:</label>
                <select
                  value={selectedWhatsappCourse || currentWhatsappCourse?.title || ""}
                  onChange={(e) => {
                    setSelectedWhatsappCourse(e.target.value);
                    const found = courses.find((c) => c.title === e.target.value);
                    setCourseGroupUrlInput(found?.whatsappGroupLink || "");
                  }}
                  className="bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm font-bold focus:border-primary outline-none"
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {currentWhatsappCourse ? (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Course WhatsApp Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Group Link Card */}
                  <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-600 text-sm">groups</span>
                        Grupo de WhatsApp
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-variant">
                        {whatsappCourseStudents.length} alumnos
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">
                        Enlace de Invitación al Grupo:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://chat.whatsapp.com/..."
                          value={courseGroupUrlInput || currentWhatsappCourse.whatsappGroupLink || ""}
                          onChange={(e) => setCourseGroupUrlInput(e.target.value)}
                          className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-xs focus:border-primary outline-none font-mono"
                        />
                        <button
                          type="button"
                          disabled={isSavingGroupLink}
                          onClick={() => saveCourseWhatsappGroupLink(currentWhatsappCourse._id, courseGroupUrlInput)}
                          className="bg-primary text-on-primary px-3 py-2 rounded-lg text-xs font-bold hover:bg-on-primary-container disabled:opacity-50"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>

                    {currentWhatsappCourse.whatsappGroupLink && (
                      <div className="pt-2 flex flex-col gap-2">
                        <a
                          href={currentWhatsappCourse.whatsappGroupLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Abrir Grupo de WhatsApp
                        </a>
                      </div>
                    )}

                    <div className="pt-2 border-t border-outline-variant">
                      <button
                        type="button"
                        onClick={() => copyAllCoursePhones(whatsappCourseStudents)}
                        className="w-full bg-surface-variant hover:bg-surface-dim text-on-surface-variant font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                        Copiar Todos los Teléfonos ({whatsappCourseStudents.length})
                      </button>
                      <p className="text-[11px] text-on-surface-variant mt-1.5 text-center">
                        Copia los números con prefijo +58 para agregarlos en lote al grupo.
                      </p>
                    </div>
                  </div>

                  {/* Template Message Card */}
                  <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-sm">edit_note</span>
                        Plantilla de Mensaje Individual
                      </span>
                    </div>

                    <textarea
                      rows={4}
                      value={whatsappTemplateMessage}
                      onChange={(e) => setWhatsappTemplateMessage(e.target.value)}
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2.5 text-xs focus:border-primary outline-none"
                    ></textarea>

                    <div className="flex flex-wrap gap-1 text-[11px] text-on-surface-variant">
                      <span>Variables:</span>
                      <code className="bg-surface-variant px-1.5 py-0.5 rounded font-bold">&#123;nombre&#125;</code>
                      <code className="bg-surface-variant px-1.5 py-0.5 rounded font-bold">&#123;curso&#125;</code>
                    </div>
                  </div>
                </div>

                {/* Course Enrolled Students Table */}
                <div className="lg:col-span-2 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">groups</span>
                        Alumnos de {currentWhatsappCourse.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        Haz clic en &quot;Enviar Mensaje&quot; para abrir el chat con la plantilla personalizada.
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-container/30 text-on-primary-container">
                      {whatsappCourseStudents.length} matriculados
                    </span>
                  </div>

                  {whatsappCourseStudents.length === 0 ? (
                    <div className="p-8 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">person_off</span>
                      <p className="font-bold text-sm">No hay alumnos matriculados en este curso aún.</p>
                      <p className="text-xs mt-1">
                        Matricula prospectos desde &quot;Inscripciones Web&quot; o regístralos en la pestaña &quot;Alumnos y Asistencias&quot;.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-surface-container border-b border-outline-variant text-xs text-on-surface-variant uppercase font-bold">
                          <tr>
                            <th className="py-2.5 px-3">Alumno</th>
                            <th className="py-2.5 px-3">Teléfono</th>
                            <th className="py-2.5 px-3">Estado</th>
                            <th className="py-2.5 px-3 text-right">Acción WhatsApp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                          {whatsappCourseStudents.map((student) => (
                            <tr key={student._id} className="hover:bg-surface-bright/50 transition-colors">
                              <td className="py-3 px-3">
                                <div className="font-bold text-xs">{student.name}</div>
                                {student.identificationId && (
                                  <div className="text-[10px] text-on-surface-variant font-mono">
                                    {student.identificationId}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-3 text-xs font-medium">
                                {student.phone}
                              </td>

                              <td className="py-3 px-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  student.academicStatus === "cursando"
                                    ? "bg-blue-100 text-blue-800"
                                    : student.academicStatus === "completado"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-neutral-100 text-neutral-600"
                                }`}>
                                  {student.academicStatus}
                                </span>
                              </td>

                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <a
                                    href={getCustomWhatsAppUrl(
                                      student.phone,
                                      whatsappTemplateMessage,
                                      student.name,
                                      student.course
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-xs font-bold transition-colors shadow-sm"
                                    title="Enviar mensaje personalizado por WhatsApp"
                                  >
                                    <span className="material-symbols-outlined text-xs">send</span>
                                    <span>Enviar Mensaje</span>
                                  </a>

                                  {currentWhatsappCourse.whatsappGroupLink && (
                                    <a
                                      href={getCustomWhatsAppUrl(
                                        student.phone,
                                        `Hola ${student.name}, te invitamos a unirte al grupo oficial de WhatsApp del curso de ${student.course}: ${currentWhatsappCourse.whatsappGroupLink}`,
                                        student.name,
                                        student.course
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 bg-surface-variant hover:bg-surface-dim text-on-surface-variant px-2 py-1 rounded text-xs font-bold transition-colors"
                                      title="Enviar invitación al grupo de WhatsApp"
                                    >
                                      <span className="material-symbols-outlined text-xs">group_add</span>
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest p-12 text-center text-on-surface-variant rounded-xl border border-outline-variant">
                <p>Crea primero cursos en el Gestor de Cursos para habilitar el Hub de WhatsApp.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
