import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export default async function Hero() {
  await connectToDatabase();
  const settings = await SiteSettings.findOne({});
  
  // Default values si no hay nada en la BD
  const videoUrl = settings?.heroVideoUrl || "/videos/hero-video.mp4";
  const title = settings?.heroTitle || "Domina el Algoritmo";
  const subtitle = settings?.heroSubtitle || "Con CEMPROZA";

  return (
    <section className="bg-surface relative overflow-hidden" id="hero">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-container/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-container-max mx-auto px-gutter py-section-gap min-h-[calc(100vh-80px)] flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Text Content */}
        <div className="flex-1 max-w-2xl text-center md:text-left pt-12 md:pt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold tracking-wider uppercase">Inscripciones Abiertas</span>
          </div>
          
          <h1 className="font-display-lg text-display-lg font-black text-on-surface mb-6 leading-tight">
            Educación profesional con la energía del <span className="text-primary relative inline-block">mundo digital<span className="absolute bottom-1 left-0 w-full h-3 bg-primary-container -z-10 rounded-sm"></span></span>
          </h1>
          
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl">
            Aprende las habilidades más demandadas del mercado con cursos prácticos, directos al grano y diseñados para que empieces a crear desde el primer día.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <a href="#courses" className="w-full sm:w-auto bg-primary text-on-primary font-title-md py-4 px-8 rounded-lg shadow-md hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors text-center font-bold">
              Explorar Cursos
            </a>
            <a href="#enroll" className="w-full sm:w-auto bg-surface text-on-surface border-2 border-outline-variant font-title-md py-4 px-8 rounded-lg hover:bg-surface-variant transition-colors text-center font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">school</span> Contactar Asesor
            </a>
          </div>
        </div>

        {/* Visual Content (Video Thumbnail Mock from code.html) */}
        <div className="relative flex justify-center md:justify-end">
          <div className="relative w-full aspect-[9/16] max-w-[320px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-surface-container-lowest transform md:-rotate-2 md:hover:rotate-0 transition-transform duration-500">
            {/* Local/Dynamic Video loop */}
            <video 
              className="absolute inset-0 w-full h-full object-cover" 
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src={videoUrl} type="video/mp4" />
              Tu navegador no soporta videos.
            </video>
            
            {/* Overlay Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-tiktok-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-left pointer-events-none">
              <h3 className="font-title-md text-title-md text-white drop-shadow-md">{title}</h3>
              <p className="font-body-md text-body-md text-surface-variant drop-shadow-md">{subtitle}</p>
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
