import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../db/schema';

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'Autenticación requerida' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt') as any;
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Token inválido' });
    return;
  }
};