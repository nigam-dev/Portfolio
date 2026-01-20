import mongoose, { Schema, Document } from 'mongoose';
import { IProject, ProjectCategory, ContentStatus, IProjectMetrics } from '../../../shared/src/types';

interface IProjectDocument extends Omit<IProject, '_id'>, Document {}

const projectMetricsSchema = new Schema<IProjectMetrics>(
  {
    views: {
      type: Number,
      default: 0,
    },
    stars: Number,
    forks: Number,
  },
  { _id: false }
);

const projectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    technologies: [{
      type: String,
    }],
    category: {
      type: String,
      enum: Object.values(ProjectCategory),
      required: true,
    },
    images: [{
      type: String,
    }],
    liveUrl: String,
    githubUrl: String,
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(ContentStatus),
      default: ContentStatus.DRAFT,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    metrics: projectMetricsSchema,
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ slug: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ featured: 1 });

export default mongoose.model<IProjectDocument>('Project', projectSchema);
