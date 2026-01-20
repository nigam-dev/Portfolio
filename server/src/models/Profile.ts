import mongoose, { Schema, Document } from 'mongoose';
import { IProfile, ISocialLink } from '../../../shared/src/types';

interface IProfileDocument extends Omit<IProfile, '_id'>, Document {}

const socialLinkSchema = new Schema<ISocialLink>(
  {
    platform: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    icon: String,
  },
  { _id: false }
);

const profileSchema = new Schema<IProfileDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: String,
    avatar: String,
    resume: String,
    socialLinks: [socialLinkSchema],
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

profileSchema.index({ userId: 1 });

export default mongoose.model<IProfileDocument>('Profile', profileSchema);
