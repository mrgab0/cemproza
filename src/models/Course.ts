import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  isActive: boolean;
  whatsappGroupLink?: string;
  branchId: string;
  createdAt: Date;
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  videoUrl: { type: String },
  isActive: { type: Boolean, default: true },
  whatsappGroupLink: { type: String, default: "" },
  branchId: { type: String, default: "barinas", index: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
