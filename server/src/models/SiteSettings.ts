import mongoose, { Schema, Document } from 'mongoose';
import { ISiteSettings } from '../../../shared/src/types';

interface ISiteSettingsDocument extends Omit<ISiteSettings, '_id'>, Document {}

const siteSettingsSchema = new Schema<ISiteSettingsDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    description: String,
    updatedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

siteSettingsSchema.index({ key: 1 });

export default mongoose.model<ISiteSettingsDocument>('SiteSettings', siteSettingsSchema);
