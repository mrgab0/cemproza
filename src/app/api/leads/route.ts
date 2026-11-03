import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const course = searchParams.get("course");
    
    const query: Record<string, unknown> = {};
    if (status && status !== "todos") {
      query.status = status;
    }
    if (course && course !== "todos") {
      query.course = course;
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Error al obtener las inscripciones" },
      { status: 500 }
    );
  }
}
