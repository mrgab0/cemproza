import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-surface-grey overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhnA4GHohhamV9Ita-4OeQkgO8CxLpAEO4SANBRRlchs6cBouwpw_F2FK5-gM7vH7jDCuizSlgu9jfsqgZATOuTrIprkBa15jGComqoChcHLCNRw3enNxwQq6VqnuF1MqmjR0w92d2EUCGoLNO6XTH8-VP1QtNXxaAopGa9cWRWVas_BJoeupNWmFTofBxZvJ3XcK0Q0IKMqDzFcOKLcvOBZkIRlqc1DS8WklBZhGj7JRYbe5FMYe-')" }}
      ></div>
      
      <div className="relative z-10 px-gutter max-w-container-max mx-auto py-16 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start">
          <div className="inline-flex items-center gap-2 bg-secondary-container/20 text-on-secondary-fixed-variant px-4 py-1.5 rounded-full font-label-sm border border-secondary-container/30">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
            Nuevos Cursos Disponibles
          </div>
          
          <h1 className="font-display-lg text-display-lg text-on-surface">
            Potencia tu Futuro con <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-inverse-primary leading-tight">CEMPROZA</span>
          </h1>
          
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
            Programas de formación profesional diseñados para el mundo moderno. Aprende habilidades prácticas y obtén certificación.
          </p>
          
          <div className="flex gap-4 mt-4 w-full md:w-auto">
            <Link href="#enroll" className="w-full md:w-auto bg-primary text-on-primary font-title-md text-title-md px-8 py-4 rounded-lg hover:bg-on-primary-container transition-colors duration-300 shadow-[0_4px_14px_0_rgba(0,226,217,0.2)] text-center">
              Explorar Cursos
            </Link>
          </div>

          {/* Quick Stats (Mobile visible, Desktop hidden or adjusted) */}
          <div className="flex gap-4 w-full max-w-sm mt-8 md:hidden">
            <div className="flex-1 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 text-center">
              <div className="font-headline-lg-mobile text-headline-lg-mobile text-primary-container font-bold">10k+</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">Alumnos</div>
            </div>
            <div className="flex-1 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 text-center">
              <div className="font-headline-lg-mobile text-headline-lg-mobile text-secondary-container font-bold">50+</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">Cursos</div>
            </div>
          </div>
        </div>

        {/* Visual Content (Video Thumbnail Mock from code.html) */}
        <div className="relative flex justify-center md:justify-end">
          <div className="relative w-full aspect-[9/16] max-w-[320px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-surface-container-lowest transform md:-rotate-2 md:hover:rotate-0 transition-transform duration-500">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBs5a-sA3XYZwFq45dDtlxjxCtAs_8gdU77WijEFWEHp_eLzjILQH753zKEXj9UV40AwpqjRzrOMK-M9bSoqns5DHNsC2nW_--KbLlqAT02CQJqTv60dpv5cDcojcUeCy9ZtcC1y-OMf04R_ONdP7K74QlXS_LOs2LphUyvwHW8dx7tp74fzKPSr5NKjbRhF7aQUujrl_EALNKqieK_OqBrXh-NgURBDzfa-i2xAJapQFWLIz-3IBHQ')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-tiktok-black/80 to-transparent flex flex-col justify-end p-6 text-left">
              <span className="material-symbols-outlined text-white text-4xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              <h3 className="font-title-md text-title-md text-white">Domina el Algoritmo</h3>
              <p className="font-body-md text-body-md text-surface-variant">Con @CreatorPro</p>
            </div>
          </div>

          {/* Desktop Floating Badge */}
          <div className="hidden md:block absolute -bottom-6 -left-6 bg-surface p-4 rounded-xl border border-outline-variant shadow-lg z-20">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                 <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
               </div>
               <div>
                 <h3 className="font-title-md text-title-md text-sm">Certificación Oficial</h3>
                 <p className="font-label-sm text-label-sm text-on-surface-variant">Reconocida internacionalmente</p>
               </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
