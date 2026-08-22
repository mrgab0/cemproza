import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Error al obtener los cursos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, imageUrl, videoUrl, isActive } = body;

    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Título, descripción e imagen son requeridos" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newCourse = await Course.create({
      title,
      description,
      imageUrl,
      videoUrl,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Error al crear el curso" },
      { status: 500 }
    );
  }
}
