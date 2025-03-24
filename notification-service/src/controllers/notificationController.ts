import { Request, Response } from 'express';

export const sendNotification = (req: Request, res: Response) => {
  console.log('Notification:', req.body.message);
  res.status(200).send({ message: 'Notification sent' });
};