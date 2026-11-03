import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Branch from "@/models/Branch";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const branch = await Branch.findById(id);
    if (!branch) {
      return NextResponse.json({ error: "Sede no encontrada" }, { status: 404 });
    }

    return NextResponse.json(branch);
  } catch (error) {
    console.error("Error fetching branch:", error);
    return NextResponse.json({ error: "Error al obtener la sede" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();

    // If code is being changed, ensure uniqueness
    if (body.code) {
      body.code = body.code.trim().toLowerCase();
      const existing = await Branch.findOne({
        code: body.code,
        _id: { $ne: id },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Ya existe otra sede con ese código único" },
          { status: 409 }
        );
      }
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedBranch) {
      return NextResponse.json({ error: "Sede no encontrada" }, { status: 404 });
    }

    return NextResponse.json(updatedBranch);
  } catch (error) {
    console.error("Error updating branch:", error);
    return NextResponse.json({ error: "Error al actualizar la sede" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const branch = await Branch.findByIdAndDelete(id);
    if (!branch) {
      return NextResponse.json({ error: "Sede no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sede eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting branch:", error);
    return NextResponse.json({ error: "Error al eliminar la sede" }, { status: 500 });
  }
}
