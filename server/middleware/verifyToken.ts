import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/users';
import { AuthenticatedRequest, DecodedToken } from '../types';

const verifyToken =
  (JWT_SECRET: string) => async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
      const user = await UserModel.findOne({ _id: decodedToken.userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

export default verifyToken;
