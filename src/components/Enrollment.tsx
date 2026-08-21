export default function Enrollment({ isSuccess }: { isSuccess?: boolean }) {
  return (
    <section className="py-section-gap bg-surface-grey" id="enroll">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant flex flex-col lg:flex-row">
          
          {/* Form Side */}
          <div className="p-8 md:p-12 lg:w-1/2 flex flex-col justify-center">
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6 text-on-primary-container">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg mb-4 text-on-surface">¡Registro Exitoso!</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Gracias por tu interés. Un asesor académico se pondrá en contacto contigo en breve para guiarte en tu proceso de inscripción.</p>
              </div>
            ) : (
              <>
                <h2 className="font-headline-lg text-headline-lg mb-2 text-on-surface">Inscríbete Ahora</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8">Déjanos tus datos y un asesor académico se contactará contigo en breve para guiarte en tu proceso.</p>
                
                <form action="/api/enroll" method="POST" className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block font-label-sm text-label-sm text-on-surface mb-2">Nombre Completo</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      placeholder="Ej. Juan Pérez" 
                      required
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block font-label-sm text-label-sm text-on-surface mb-2">Correo Electrónico</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        placeholder="tu@email.com" 
                        required
                        className="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block font-label-sm text-label-sm text-on-surface mb-2">Teléfono</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        placeholder="+34 000 000 000" 
                        required
                        className="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="course" className="block font-label-sm text-label-sm text-on-surface mb-2">Curso de Interés</label>
                    <select 
                      id="course" 
                      name="course"
                      defaultValue=""
                      required
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface-variant"
                    >
                      <option value="" disabled>Selecciona un programa...</option>
                      <option value="marketing">Marketing Digital Avanzado</option>
                      <option value="design">Diseño Gráfico Profesional</option>
                      <option value="programming">Desarrollo Web Full-Stack</option>
                      <option value="business">Gestión de Proyectos</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-primary text-on-primary font-title-md text-title-md py-4 rounded-lg hover:bg-on-primary-container transition-colors duration-300 mt-4 shadow-[0_4px_14px_0_rgba(0,226,217,0.2)]"
                  >
                    Solicitar Información
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Visual Side */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5wvbnK9VIxGrhTwrpb-XCtGlMFrAsfhNzrNcNt5ggw5iOCAZMVHiURgmi5Bz7Qs8bx5Z34fvV_upOXUE_uKTfzKbOu937ixN8pQpScOcYWq8ym4Us9QHQSvGTiZ8QoyHY9oAnzYSS_GB8DI2rI81lcD5Y2jtB3pWTnt3D0Cob4fKiwPtlWuj4_d1-vhCxs1plGS3URCfGv0r-IxN4vmCDO21K7MA8G072U-HgmdExeNsrInmAhBlx')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest to-transparent"></div>
            
            {/* Floating Element */}
            <div className="absolute bottom-12 right-12 bg-surface p-6 rounded-xl border border-outline-variant shadow-lg max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">Respuesta Rápida</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">Nuestro equipo responde a las solicitudes de información en menos de 2 horas hábiles.</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
