# Hoja de Ruta y Plan de Acción (CEMPROZA Cursos)

El proyecto base (MVP) está terminado con una Landing Page funcional, captura de leads, conexión a base de datos y un panel de administración básico para crear cursos.

A continuación, se detalla el **Roadmap Estratégico** para escalar la plataforma de manera profesional, integrando las nuevas solicitudes.

## Roadmap (Hoja de Ruta General)

*   **Fase 1 & 2: MVP y Catálogo Dinámico** `[Completado]`
    *   Landing page, captura de leads, base de datos, panel admin CRUD de cursos.
*   **Fase 3: Gestión Profesional de Multimedia** `[Completado]`
    *   Integración con ImageKit para almacenamiento en la nube de imágenes y videos pesados.
    *   Gestor de contenido dinámico para el *Hero* (Sección principal de la Landing Page).
*   **Fase 4: Panel Administrativo Avanzado, CRM & Hub WhatsApp** `[Completado]`
    *   Dashboard de estadísticas y métricas KPI de prospectos y alumnos. `[Completado]`
    *   Gestión de Inscripciones y Leads (contacto WhatsApp directo, actualización de estados, exportación CSV). `[Completado]`
    *   Botón "Matricular como Alumno" para pasar prospectos a estudiantes oficiales en 1 clic. `[Completado]`
    *   Gestor de Cursos mejorado: Pausar/Activar en 1 clic, filtros por estado y vinculación de enlace de Grupo de WhatsApp. `[Completado]`
    *   Módulo Académico de Alumnos: Buscador en tiempo real por nombre, cédula, teléfono y filtros por Curso, Estado Académico (Cursando, Completado, Pausado, Retirado) y Solvencia. `[Completado]`
    *   Control de Asistencia Presencial: Registro rápido de asistencia diaria (Presente / Ausente / Justificado) integrado por alumno. `[Completado]`
    *   Hub de WhatsApp de Cursos: Selector por curso, apertura/enlace de grupo, copiado masivo de teléfonos (+58) y plantilla de difusión individual personalizada. `[Completado]`
*   **Fase 5: Expansión y E-commerce (Futuro)**
    *   Pasarela de pagos (Stripe / MercadoPago / Pago Móvil).
    *   Carritos abandonados y automatización de correos (Resend o SendGrid).
    *   App Móvil en React Native consumiendo las mismas APIs.

---

# Plan de Implementación: Fase 3 (Gestión de Multimedia)

Este es el plan de acción técnico para implementar las funcionalidades que acabas de solicitar (ImageKit y Editor del Hero).

> [!IMPORTANT]
> **User Review Required**
> Por favor, revisa este plan. Si estás de acuerdo, responde con tu aprobación para comenzar a programarlo. Ten en cuenta que necesitarás crear una cuenta gratuita en **ImageKit.io** para obtener tus credenciales (Public Key, Private Key y URL Endpoint).

## Proposed Changes

### Integración con ImageKit (Nube de Multimedia)
Vamos a reemplazar los enlaces de imágenes estáticas y subir los archivos reales a un CDN profesional para que la web cargue súper rápido.

#### [NEW] `src/lib/imagekit.ts`
- Configuraremos el SDK oficial de ImageKit para Node.js.
- Proveerá funciones para subir, borrar y optimizar imágenes/videos directamente desde nuestro panel de administrador.

#### [MODIFY] `.env.local`
- Agregaremos las variables de entorno de ImageKit (`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`).

---

### Gestor Dinámico del Hero (Sección Principal)
Ya no dependeremos de subir videos a la carpeta `public/videos`. Todo se controlará desde el panel `/admin`.

#### [NEW] `src/models/SiteSettings.ts`
- Un nuevo esquema en MongoDB para guardar configuraciones globales de la página.
- Guardaremos el `heroVideoUrl`, `heroTitle`, y `heroSubtitle`.

#### [NEW] `src/app/api/settings/route.ts`
- Ruta API para obtener (GET) y actualizar (PUT) la configuración del sitio (como el video del Hero).

#### [MODIFY] `src/app/admin/page.tsx`
- Agregaremos una nueva pestaña o sección llamada **"Configuración del Sitio"**.
- Incluirá un formulario para subir un archivo de video desde tu computadora.
- Al seleccionar el video, se subirá automáticamente a ImageKit y se guardará el link en la base de datos.

#### [MODIFY] `src/components/Hero.tsx`
- En lugar de usar una ruta estática (`/videos/hero-video.mp4`), el componente obtendrá la URL del video desde la base de datos.
- Si no hay un video configurado, mostrará uno por defecto o una imagen bonita de "fallback".

---

### Mejoras en el Editor de Cursos (Catálogo)
Aprovechando ImageKit, mejoraremos cómo se crean los cursos.

#### [MODIFY] `src/app/api/courses/route.ts` & `src/app/api/courses/[id]/route.ts`
- Modificaremos la API para que intercepte los archivos de imagen subidos.

#### [MODIFY] Formularios del Panel de Admin
- Cambiaremos los campos de texto plano (donde pegabas una URL de imagen) por un botón real de "Subir Archivo".

## Verification Plan

### Manual Verification
1. Ingresaremos las credenciales de ImageKit en el entorno local.
2. Entraremos al panel `/admin`.
3. Subiremos un video para el "Hero" desde la computadora.
4. Verificaremos en ImageKit que el video subió correctamente.
5. Verificaremos en la página principal (`http://localhost:3000`) que el nuevo video se reproduce automáticamente.
6. Subiremos la imagen de un curso para asegurar que la integración funciona en múltiples partes del sitio.
