import mongoose, { Schema, Document } from 'mongoose';
import { IAchievement, AchievementCategory } from '../../../shared/src/types';

interface IAchievementDocument extends Omit<IAchievement, '_id'>, Document {}

const achievementSchema = new Schema<IAchievementDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(AchievementCategory),
      required: true,
    },
    image: String,
    url: String,
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

achievementSchema.index({ category: 1 });
achievementSchema.index({ order: 1 });
achievementSchema.index({ date: -1 });

export default mongoose.model<IAchievementDocument>('Achievement', achievementSchema);
