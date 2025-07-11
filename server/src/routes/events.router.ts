// import express, { Request, Response } from 'express';

// const router = express.Router();

// router.get('/', (req: Request, res: Response) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');

//   const sendEvent = () => {
//     const message = { message: `${new Date().toLocaleTimeString()}` };
//     res.write(`data: ${JSON.stringify(message)}\n\n`);
//   };

//   const intervalId = setInterval(sendEvent, 1000);

//   req.on('close', () => {
//     clearInterval(intervalId);
//     res.end();
//   });
// });

// export default router;
