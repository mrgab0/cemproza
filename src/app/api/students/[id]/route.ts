import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Student from "@/models/Student";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json({ error: "Error al obtener el alumno" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json({ error: "Error al actualizar el alumno" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Alumno eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: "Error al eliminar el alumno" }, { status: 500 });
  }
}
