import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  heroVideoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema({
  heroVideoUrl: { type: String, default: "" },
  heroTitle: { type: String, default: "Domina el Algoritmo" },
  heroSubtitle: { type: String, default: "Con CEMPROZA" },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
