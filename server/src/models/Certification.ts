import mongoose, { Schema, Document } from 'mongoose';
import { ICertification } from '../../../shared/src/types';

interface ICertificationDocument extends Omit<ICertification, '_id'>, Document {}

const certificationSchema = new Schema<ICertificationDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    issuer: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String,
    image: String,
    order: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

certificationSchema.index({ order: 1 });
certificationSchema.index({ issueDate: -1 });

export default mongoose.model<ICertificationDocument>('Certification', certificationSchema);
