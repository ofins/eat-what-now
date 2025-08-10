import { Request, Response } from 'express';
import { Logger } from 'src/log/logger';
import { searchGooglePlacesByText } from 'src/utils/google';

export class GoogleController {
  constructor(private readonly logger: Logger) {}

  async searchGooglePlacesByText(req: Request, res: Response) {
    const { text, location } = req.body;

    if (!text || !location) {
      return res
        .status(400)
        .send({ error: 'Text, longitude, and latitude are required' });
    }

    try {
      const results = await searchGooglePlacesByText(text, location);
      res.send(results);
    } catch (error) {
      this.logger.error(`Error searching Google Places: ${error}`);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
