import mongoose, { Schema, Document } from 'mongoose';

export type LeadStatus = 'nuevo' | 'contactado' | 'inscrito' | 'descartado';

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  course: string;
  branchId: string;
  status: LeadStatus;
  notes?: string;
  createdAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  branchId: { type: String, default: "barinas", index: true },
  status: {
    type: String,
    enum: ['nuevo', 'contactado', 'inscrito', 'descartado'],
    default: 'nuevo',
    index: true,
  },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
