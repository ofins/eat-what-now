import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const { lon, lat } = req.query;

  res.send({ data: `longitude:${lon} and latitude:${lat}` });
});

export default router;
