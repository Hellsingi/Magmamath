import { Router } from 'express';
const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({ status: 'User Service is healthy!' });
});

export default router;
