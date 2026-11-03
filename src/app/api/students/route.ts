import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Student from "@/models/Student";
import Lead from "@/models/Lead";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const course = searchParams.get("course");
    const academicStatus = searchParams.get("academicStatus");
    const paymentStatus = searchParams.get("paymentStatus");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};

    if (course && course !== "todos") {
      query.course = course;
    }

    if (academicStatus && academicStatus !== "todos") {
      query.academicStatus = academicStatus;
    }

    if (paymentStatus && paymentStatus !== "todos") {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [
        { name: regex },
        { identificationId: regex },
        { phone: regex },
        { email: regex },
        { course: regex },
      ];
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Error al obtener los alumnos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      identificationId,
      email,
      phone,
      course,
      academicStatus,
      paymentStatus,
      notes,
      leadId,
    } = body;

    if (!name || !phone || !course) {
      return NextResponse.json(
        { error: "Nombre, teléfono y curso son requeridos" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newStudent = await Student.create({
      name,
      identificationId: identificationId || "",
      email: email || "",
      phone,
      course,
      academicStatus: academicStatus || "cursando",
      paymentStatus: paymentStatus || "pendiente",
      notes: notes || "",
    });

    // If enrolling from a lead, mark the lead as 'inscrito'
    if (leadId) {
      await Lead.findByIdAndUpdate(leadId, {
        status: "inscrito",
        notes: `Matriculado como alumno oficial (${new Date().toLocaleDateString('es-VE')})`,
      });
    }

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Error al registrar el alumno" },
      { status: 500 }
    );
  }
}
