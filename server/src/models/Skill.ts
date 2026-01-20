import mongoose, { Schema, Document } from 'mongoose';
import { ISkill, SkillCategory, SkillProficiency } from '../../../shared/src/types';

interface ISkillDocument extends Omit<ISkill, '_id'>, Document {}

const skillSchema = new Schema<ISkillDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(SkillCategory),
      required: true,
    },
    proficiency: {
      type: String,
      enum: Object.values(SkillProficiency),
      required: true,
    },
    icon: String,
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

skillSchema.index({ category: 1 });
skillSchema.index({ order: 1 });

export default mongoose.model<ISkillDocument>('Skill', skillSchema);
