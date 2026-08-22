import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    await connectToDatabase();
    
    const updatedCourse = await Course.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!updatedCourse) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }
    
    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Error al actualizar el curso" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const deletedCourse = await Course.findByIdAndDelete(id);
    
    if (!deletedCourse) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Error al eliminar el curso" }, { status: 500 });
  }
}
