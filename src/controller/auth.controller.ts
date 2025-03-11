import { Request, Response } from 'express';
import { User } from '../db/schema';
import { ValidationError } from 'sequelize';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password } = req.body;
    
    if (!email || !name || !password) {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
      return;
    }
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'El correo ya está registrado' });
      return;
    }
    
    const user = await User.create({ email, name, password });
    const token = user.generateAuthToken();
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationError) {
      res.status(400).json({ 
        message: 'Error de validación',
        errors: error.errors.map(err => err.message)
      });
      return;
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ message: 'Correo y contraseña son requeridos' });
      return;
    }
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }
    
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }
    
    const token = user.generateAuthToken();
    
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user ya está establecido por el middleware authenticate
    const user = req.user;
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};