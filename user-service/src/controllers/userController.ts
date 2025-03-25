import { Request, Response, NextFunction, RequestHandler } from 'express';
import { User } from '../models/userModel';
import { validateUser } from '../utils/validation';
import logger from '../utils/logger';
import { publishEvent } from '../utils/publisher';

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('Creating user: %s', req.body.name);
    const { error } = validateUser(req.body);
    if (error) {
      logger.error('Error: %s', error.details[0].message);
      res.status(400).json({ error: error.details[0].message });
      return next();
    }

    const user = new User(req.body);
    await user.save();
    await publishEvent('USER_CREATED', user);

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req: Request, res: Response , next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

      res.send(users);
    } catch (err) {
      next(err);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return next();
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      res.status(404).send('User not found');
      return next();
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    await publishEvent('USER_DELETED', user);
    res.send(user);
  } catch (err) {
    next(err);
  }
};