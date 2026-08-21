import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Enrollment from "@/components/Enrollment";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { success } = await searchParams;
  const isSuccess = success === "true";

  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Map Section */}
        <section className="py-section-gap px-gutter max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg mb-4 text-on-surface">Encuéntranos</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Visita nuestras instalaciones y conoce de cerca el entorno donde potenciarás tu futuro.</p>
          </div>
          <div className="w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border border-outline-variant shadow-sm">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.64621379555!2d-79.09459521360144!3d-8.128795560668045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ad3d7effebba33%3A0xcb1e2a048705f429!2sTrujillo%2C%20Peru!5e0!3m2!1sen!2sus!4v1714589255000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Ubicación CEMPROZA"
            ></iframe>
          </div>
        </section>

        <Enrollment isSuccess={isSuccess} />
      </main>
      <Footer />
    </>
  );
}
