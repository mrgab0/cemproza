import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Student from "@/models/Student";

interface AttendanceRecordInput {
  studentId: string;
  status: "presente" | "ausente" | "justificado";
  notes?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, records } = body as {
      date: string;
      records: AttendanceRecordInput[];
    };

    if (!date || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: "Fecha y lista de registros son requeridos" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const bulkOps = records.map((record) => ({
      updateOne: {
        filter: { _id: record.studentId },
        update: {
          $pull: { attendance: { date } },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await Student.bulkWrite(bulkOps);

      const pushOps = records.map((record) => ({
        updateOne: {
          filter: { _id: record.studentId },
          update: {
            $push: {
              attendance: {
                date,
                status: record.status,
                notes: record.notes || "",
              },
            },
          },
        },
      }));

      await Student.bulkWrite(pushOps);
    }

    return NextResponse.json({
      message: "Asistencias registradas exitosamente",
      count: records.length,
    });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return NextResponse.json(
      { error: "Error al registrar asistencias" },
      { status: 500 }
    );
  }
}
