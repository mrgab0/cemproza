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
}

export default function AdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/courses/${editingId}` : "/api/courses";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setFormData({ title: "", description: "", imageUrl: "", videoUrl: "", isActive: true });
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

  const handleEdit = (course: Course) => {
    setEditingId(course._id);
    setFormData({
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      videoUrl: course.videoUrl || "",
      isActive: course.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return;
    
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", imageUrl: "", videoUrl: "", isActive: true });
  };

  return (
    <div className="min-h-screen bg-surface-grey font-body-md text-on-background">
      {/* Top Navbar */}
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

      <main className="max-w-container-max mx-auto px-gutter py-8 grid md:grid-cols-3 gap-8">
        {/* Form Section */}
        <section className="md:col-span-1">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6 sticky top-28">
            <h2 className="font-title-md text-title-md mb-6">{editingId ? "Editar Curso" : "Agregar Nuevo Curso"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Título</label>
                <input 
                  type="text" name="title" required value={formData.title} onChange={handleChange}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Ej: Marketing Digital"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Descripción corta</label>
                <textarea 
                  name="description" required value={formData.description} onChange={handleChange} rows={3}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Breve descripción del curso..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">URL de la Imagen</label>
                <input 
                  type="url" name="imageUrl" required value={formData.imageUrl} onChange={handleChange}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">URL del Video (Opcional)</label>
                <input 
                  type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange}
                  className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm cursor-pointer">Curso Activo (Visible en la web)</label>
              </div>

              <div className="pt-4 flex gap-2">
                <button 
                  type="submit" disabled={isSubmitting}
                  className="flex-1 bg-primary text-on-primary py-2 rounded-lg text-sm font-bold hover:bg-on-primary-container transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : (editingId ? "Actualizar Curso" : "Crear Curso")}
                </button>
                {editingId && (
                  <button 
                    type="button" onClick={handleCancelEdit}
                    className="px-4 bg-surface-variant text-on-surface-variant rounded-lg text-sm font-bold hover:bg-surface-dim transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* List Section */}
        <section className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-title-md text-title-md">Cursos Existentes</h2>
            <div className="text-sm text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
              {courses.length} Cursos
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-12">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
              <p>Aún no hay cursos creados.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {courses.map(course => (
                <div key={course._id} className={`bg-surface-container-lowest rounded-xl border ${editingId === course._id ? 'border-primary shadow-sm' : 'border-outline-variant'} p-4 flex gap-4 transition-all`}>
                  <div className="w-32 h-24 rounded-lg bg-surface-variant flex-shrink-0 overflow-hidden relative">
                    {course.imageUrl ? (
                      <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined">image</span>
                      </div>
                    )}
                    {!course.isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-error text-on-error text-[10px] uppercase font-bold px-2 py-0.5 rounded">Inactivo</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                      <p className="text-sm text-on-surface-variant line-clamp-2 mt-1">{course.description}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button 
                        onClick={() => handleEdit(course)}
                        className="text-primary hover:bg-primary-container/20 p-2 rounded-full transition-colors flex items-center justify-center"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(course._id)}
                        className="text-error hover:bg-error-container/20 p-2 rounded-full transition-colors flex items-center justify-center"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
