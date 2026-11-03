import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Branch from "@/models/Branch";

export async function GET() {
  try {
    await connectToDatabase();

    let branches = await Branch.find({}).sort({ createdAt: 1 });

    // Auto-seed initial default branch if database has none
    if (branches.length === 0) {
      const defaultBranch = await Branch.create({
        name: "Sede Principal Barinas (Centro)",
        code: "barinas",
        city: "Barinas",
        state: "Barinas",
        address: "Av. Industrial con Calle Camejo, Edif. CEMPROZA, Piso 1",
        referencePoint: "Frente al Centro Comercial El Marqués",
        phone: "0273-5321122",
        whatsappPhone: "0414-5321122",
        email: "barinas@cemproza.com",
        managerName: "Lic. Carlos Mendoza",
        managerPhone: "0424-5551122",
        openingHours: "Lun a Vie: 8:00 AM - 5:00 PM | Sáb: 8:00 AM - 2:00 PM",
        totalCapacity: 80,
        classroomsCount: 4,
        paymentInfo: {
          bankName: "Banco Banesco / Banco de Venezuela",
          pagoMovilPhone: "0414-5321122",
          idOrRif: "J-409812345",
          notes: "Enviar captura de comprobante con número de referencia",
        },
        facilities: [
          { area: "Aulas Teóricas 1 y 2", status: "optimo", notes: "Capacidad para 25 alumnos cada una" },
          { area: "Laboratorio de Computación / IA", status: "optimo", notes: "18 PCs con conexión de fibra óptica" },
          { area: "Taller Técnico / Prácticas", status: "mantenimiento", notes: "Revisión programada de cableado y tomas eléctricas" },
          { area: "Planta Eléctrica de Respaldo", status: "optimo", notes: "Autonomía de 8 horas con combustible full" },
          { area: "Sistema de Climatización (Aires)", status: "optimo", notes: "Mantenimiento preventivo reciente" },
        ],
        cctvCameras: [
          {
            name: "Cámara 01 - Recepción y Entrada",
            location: "Acceso Principal",
            streamUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
            isActive: true,
          },
          {
            name: "Cámara 02 - Laboratorio de Computación",
            location: "Piso 1 - Lab IA",
            streamUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
            isActive: true,
          },
          {
            name: "Cámara 03 - Pasillo y Aulas",
            location: "Pasillo Central",
            streamUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
            isActive: true,
          },
        ],
        isActive: true,
      });

      branches = [defaultBranch];
    }

    return NextResponse.json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    return NextResponse.json(
      { error: "Error al obtener las sedes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, code, city, address, phone } = body;

    if (!name || !code || !city || !address || !phone) {
      return NextResponse.json(
        { error: "Nombre, código, ciudad, dirección y teléfono son requeridos" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check duplicate code
    const existing = await Branch.findOne({ code: code.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una sede con ese código único (ej: barinas, caracas)" },
        { status: 409 }
      );
    }

    const newBranch = await Branch.create({
      ...body,
      code: code.trim().toLowerCase(),
      facilities: body.facilities || [
        { area: "Aulas", status: "optimo" },
        { area: "Laboratorio / Taller", status: "optimo" },
        { area: "Aires Acondicionados", status: "optimo" },
      ],
      cctvCameras: body.cctvCameras || [],
    });

    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error("Error creating branch:", error);
    return NextResponse.json(
      { error: "Error al crear la sede" },
      { status: 500 }
    );
  }
}
