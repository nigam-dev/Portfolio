import mongoose, { Schema, Document } from 'mongoose';
import { IAuditLog } from '../../../shared/src/types';

interface IAuditLogDocument extends Omit<IAuditLog, '_id'>, Document {}

const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    resourceId: String,
    changes: Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: { updatedAt: false },
  }
);

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ resource: 1 });
auditLogSchema.index({ createdAt: -1 });

export default mongoose.model<IAuditLogDocument>('AuditLog', auditLogSchema);
