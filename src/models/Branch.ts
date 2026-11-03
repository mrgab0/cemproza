import mongoose, { Schema, Document } from 'mongoose';

export interface ICctvCamera {
  name: string;
  location: string;
  streamUrl: string;
  isActive: boolean;
}

export interface IFacilityStatus {
  area: string;
  status: 'optimo' | 'mantenimiento' | 'critico';
  lastInspection?: string;
  notes?: string;
}

export interface IBranchPaymentInfo {
  bankName?: string;
  pagoMovilPhone?: string;
  idOrRif?: string;
  notes?: string;
}

export interface IBranch extends Document {
  name: string;
  code: string;
  city: string;
  state?: string;
  address: string;
  referencePoint?: string;
  phone: string;
  whatsappPhone?: string;
  email?: string;
  managerName?: string;
  managerPhone?: string;
  openingHours?: string;
  totalCapacity?: number;
  classroomsCount?: number;
  paymentInfo?: IBranchPaymentInfo;
  facilities: IFacilityStatus[];
  cctvCameras: ICctvCamera[];
  isActive: boolean;
  createdAt: Date;
}

const CctvCameraSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, default: '' },
    streamUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const FacilityStatusSchema = new Schema(
  {
    area: { type: String, required: true },
    status: {
      type: String,
      enum: ['optimo', 'mantenimiento', 'critico'],
      default: 'optimo',
    },
    lastInspection: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const BranchSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, index: true },
  city: { type: String, required: true },
  state: { type: String, default: 'Barinas' },
  address: { type: String, required: true },
  referencePoint: { type: String, default: '' },
  phone: { type: String, required: true },
  whatsappPhone: { type: String, default: '' },
  email: { type: String, default: '' },
  managerName: { type: String, default: '' },
  managerPhone: { type: String, default: '' },
  openingHours: { type: String, default: 'Lun a Vie 8:00 AM - 5:00 PM | Sáb 8:00 AM - 2:00 PM' },
  totalCapacity: { type: Number, default: 60 },
  classroomsCount: { type: Number, default: 3 },
  paymentInfo: {
    bankName: { type: String, default: '' },
    pagoMovilPhone: { type: String, default: '' },
    idOrRif: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  facilities: [FacilityStatusSchema],
  cctvCameras: [CctvCameraSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Branch || mongoose.model<IBranch>('Branch', BranchSchema);
