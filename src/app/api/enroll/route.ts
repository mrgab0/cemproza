import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function POST(req: Request) {
  try {
    // If it's form data
    let name, email, phone, course;
    
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = formData.get("name") as string;
      email = formData.get("email") as string;
      phone = formData.get("phone") as string;
      course = formData.get("course") as string;
    } else {
      const body = await req.json();
      name = body.name;
      email = body.email;
      phone = body.phone;
      course = body.course;
    }

    if (!name || !email || !phone || !course) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newLead = await Lead.create({
      name,
      email,
      phone,
      course,
    });

    // In a real app we might redirect to a thank you page
    // For now we'll return a simple redirect response back to the home page with a success param
    // But since it's a form action, redirecting is the best UX without JS
    return NextResponse.redirect(new URL("/?success=true#enroll", req.url));
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar tu solicitud" },
      { status: 500 }
    );
  }
}
