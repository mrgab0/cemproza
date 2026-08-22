import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Enrollment from "@/components/Enrollment";
import CourseCatalog from "@/components/CourseCatalog";
import MapWidget from "@/components/MapWidget";

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
        <CourseCatalog />
        <Features />
        
        {/* Map Section */}
        <section className="py-section-gap px-gutter max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg mb-4 text-on-surface">Encuéntranos</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Visita nuestras instalaciones y conoce de cerca el entorno donde potenciarás tu futuro.</p>
          </div>
          <div className="w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border border-outline-variant shadow-sm relative z-0">
            <MapWidget />
          </div>
        </section>

        <Enrollment isSuccess={isSuccess} />
      </main>
      <Footer />
    </>
  );
}
