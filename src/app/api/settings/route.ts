import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { imagekit } from "@/lib/imagekit";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Error al obtener configuraciones" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const formData = await req.formData();
    
    const heroTitle = formData.get("heroTitle") as string;
    const heroSubtitle = formData.get("heroSubtitle") as string;
    const heroVideoFile = formData.get("heroVideo") as File | null;
    
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    
    if (heroTitle) settings.heroTitle = heroTitle;
    if (heroSubtitle) settings.heroSubtitle = heroSubtitle;
    
    // Si se subió un archivo nuevo
    if (heroVideoFile && heroVideoFile.size > 0) {
      const buffer = Buffer.from(await heroVideoFile.arrayBuffer());
      
      const uploadResponse = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: buffer, // buffer
            fileName: heroVideoFile.name || "hero-video.mp4",
            folder: "/cemproza/hero",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });
      
      if (uploadResponse && (uploadResponse as any).url) {
        settings.heroVideoUrl = (uploadResponse as any).url;
      }
    }
    
    settings.updatedAt = new Date();
    await settings.save();
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Error al actualizar configuraciones" },
      { status: 500 }
    );
  }
}
