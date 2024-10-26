import { Request, Response } from 'express';
import { checkConnection } from '../utils/database';

export const testDBConnection = async (_req: Request, res: Response) => {
  try {
    const connectionStatus = checkConnection();
    
    res.json({
      connectionStatus: connectionStatus.status,
      message: connectionStatus.message,
    });
  } catch (error) {
    res.status(500).json({
      connectionStatus: 'Failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};