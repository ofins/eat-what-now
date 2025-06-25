import morgan from 'morgan';

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message: string) => console.log(message.trim()), // Custom stream to log messages
    },
  }
);

export default morganMiddleware;
