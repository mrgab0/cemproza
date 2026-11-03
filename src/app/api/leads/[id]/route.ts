import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    await connectToDatabase();

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return NextResponse.json(
        { error: "Inscripción no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Error al actualizar la inscripción" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json(
        { error: "Inscripción no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Inscripción eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Error al eliminar la inscripción" },
      { status: 500 }
    );
  }
}
