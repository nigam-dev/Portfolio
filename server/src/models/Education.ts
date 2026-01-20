import mongoose, { Schema, Document } from 'mongoose';
import { IEducation } from '../../../shared/src/types';

interface IEducationDocument extends Omit<IEducation, '_id'>, Document {}

const educationSchema = new Schema<IEducationDocument>(
  {
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    current: {
      type: Boolean,
      default: false,
    },
    grade: String,
    description: String,
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

educationSchema.index({ order: 1 });
educationSchema.index({ startDate: -1 });

export default mongoose.model<IEducationDocument>('Education', educationSchema);
