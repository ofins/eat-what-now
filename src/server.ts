import express, { Request, Response } from 'express';

import cors from 'cors';

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'CORS is working!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
