import mongoose, { Schema, Document } from 'mongoose';
import { IExperience } from '../../../shared/src/types';

interface IExperienceDocument extends Omit<IExperience, '_id'>, Document {}

const experienceSchema = new Schema<IExperienceDocument>(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
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
    description: {
      type: String,
      required: true,
    },
    responsibilities: [{
      type: String,
    }],
    achievements: [{
      type: String,
    }],
    technologies: [{
      type: String,
    }],
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

experienceSchema.index({ order: 1 });
experienceSchema.index({ startDate: -1 });

export default mongoose.model<IExperienceDocument>('Experience', experienceSchema);
