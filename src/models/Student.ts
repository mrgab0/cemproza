import mongoose, { Schema, Document } from 'mongoose';

export type AcademicStatus = 'cursando' | 'completado' | 'pausado' | 'retirado';
export type PaymentStatus = 'solvente' | 'pendiente' | 'becado';
export type AttendanceStatus = 'presente' | 'ausente' | 'justificado';

export interface IAttendance {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
}

export interface IStudent extends Document {
  name: string;
  identificationId?: string; // Cédula o DNI
  email?: string;
  phone: string;
  course: string;
  academicStatus: AcademicStatus;
  paymentStatus: PaymentStatus;
  attendance: IAttendance[];
  notes?: string;
  branchId: string;
  createdAt: Date;
}

const AttendanceSchema = new Schema(
  {
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ['presente', 'ausente', 'justificado'],
      default: 'presente',
    },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  identificationId: { type: String, default: '', index: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  course: { type: String, required: true, index: true },
  academicStatus: {
    type: String,
    enum: ['cursando', 'completado', 'pausado', 'retirado'],
    default: 'cursando',
    index: true,
  },
  paymentStatus: {
    type: String,
    enum: ['solvente', 'pendiente', 'becado'],
    default: 'pendiente',
    index: true,
  },
  attendance: [AttendanceSchema],
  notes: { type: String, default: '' },
  branchId: { type: String, default: 'barinas', index: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
