export default function Features() {
  return (
    <section className="py-section-gap px-gutter max-w-container-max mx-auto" id="courses">
      <div className="text-center mb-16">
        <h2 className="font-headline-lg text-headline-lg mb-4 text-on-surface">¿Por qué elegir CEMPROZA?</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Nuestra metodología combina el rigor académico con la agilidad del aprendizaje digital moderno.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 hover:shadow-[0_8px_30px_rgb(0,226,217,0.12)] transition-shadow duration-300">
          <div className="w-14 h-14 rounded-lg bg-surface-container-high flex items-center justify-center mb-6 text-primary">
            <span className="material-symbols-outlined text-3xl">school</span>
          </div>
          <h3 className="font-title-md text-title-md mb-3">Instructores Expertos</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">Aprende de profesionales activos en la industria que aportan experiencia del mundo real al aula digital.</p>
        </div>

        {/* Feature 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 hover:shadow-[0_8px_30px_rgb(0,226,217,0.12)] transition-shadow duration-300">
          <div className="w-14 h-14 rounded-lg bg-surface-container-high flex items-center justify-center mb-6 text-primary">
            <span className="material-symbols-outlined text-3xl">schedule</span>
          </div>
          <h3 className="font-title-md text-title-md mb-3">Flexibilidad Total</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">Estudia a tu propio ritmo con acceso 24/7 a nuestra plataforma moderna y recursos descargables.</p>
        </div>

        {/* Feature 3 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 hover:shadow-[0_8px_30px_rgb(0,226,217,0.12)] transition-shadow duration-300">
          <div className="w-14 h-14 rounded-lg bg-surface-container-high flex items-center justify-center mb-6 text-primary">
            <span className="material-symbols-outlined text-3xl">trending_up</span>
          </div>
          <h3 className="font-title-md text-title-md mb-3">Enfoque Práctico</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">Proyectos basados en escenarios reales que te preparan directamente para los desafíos del mercado laboral.</p>
        </div>
      </div>
    </section>
  );
}
