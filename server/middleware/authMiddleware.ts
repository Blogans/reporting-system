import { Request, Response, NextFunction } from 'express';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

export const checkPermission = (permission: keyof typeof PERMISSIONS) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.session.userRole;
    if (userRole && hasPermission(userRole, permission)) {
      console.log(`User has permission: ${permission}`);
      next();
    } else {
      console.log(`User role ${userRole} does not have permission: ${permission}`);
      res.status(403).json({ message: 'Access denied. Insufficient permissions.', errorCode: 'PERMISSION_DENIED' });
    }
  };
};
