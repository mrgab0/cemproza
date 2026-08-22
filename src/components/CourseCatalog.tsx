import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";

export default async function CourseCatalog() {
  await connectToDatabase();
  // Fetch active courses
  const coursesData = await Course.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  
  // Convert _id to string for serialization
  const courses = coursesData.map(course => ({
    _id: course._id.toString(),
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    videoUrl: course.videoUrl,
  }));

  if (courses.length === 0) {
    return null; // Don't show the section if there are no courses
  }

  return (
    <section className="py-section-gap px-gutter max-w-container-max mx-auto" id="courses">
      <div className="text-center mb-16">
        <h2 className="font-headline-lg text-headline-lg mb-4 text-on-surface">Nuestros Programas</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Explora los cursos diseñados para impulsar tu carrera profesional al siguiente nivel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course._id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant hover:shadow-[0_8px_30px_rgb(0,226,217,0.12)] transition-shadow duration-300 flex flex-col">
            
            {/* Image / Video Container */}
            <div className="relative aspect-video w-full bg-surface-variant group">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {course.videoUrl && (
                <a 
                  href={course.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-white text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </a>
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-title-md text-title-md mb-2">{course.title}</h3>
              <p className="font-body-md text-on-surface-variant mb-6 flex-grow">{course.description}</p>
              
              <a 
                href={`#enroll`} 
                className="w-full py-3 border-2 border-primary text-primary font-bold rounded-lg text-center hover:bg-primary hover:text-on-primary transition-colors"
              >
                Solicitar Información
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
