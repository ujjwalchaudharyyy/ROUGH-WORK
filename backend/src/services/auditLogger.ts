import prisma from '../prisma';

export interface AuditParams {
  action: string;
  entityType: string;
  entityId: string;
  performedById?: string;
  details: Record<string, any>;
  ipAddress?: string;
}

export const logAudit = async (params: AuditParams) => {
  try {
    return await prisma.auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        performedById: params.performedById,
        details: JSON.stringify(params.details),
        ipAddress: params.ipAddress,
      },
    });
  } catch (err) {
    console.error('Audit log write error:', err);
    return null;
  }
};
