import { Request, Response } from 'express';
import { Logger } from 'src/log/logger';
import { AuthService } from 'src/services/auth.service';
import { UsersService } from 'src/services/users.service';
import { searchGooglePlacesByText, verifyGoogleAuth } from 'src/utils/google';

export class GoogleController {
  constructor(
    private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

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

  async googleAuth(req: Request, res: Response): Promise<void> {
    const { credential } = req.body;

    if (!credential) {
      res.status(400).send({ error: 'Google token is required' });
      return;
    }

    try {
      const userData = await verifyGoogleAuth(credential);

      if (!userData || !userData.email) {
        res.status(401).send({ error: 'Invalid Google token' });
        return;
      }

      // check if user exists
      const user = await this.usersService.findUserByEmail(userData.email);

      if (!user) {
        let username = userData.email.split('@')[0];
        const existingUser =
          await this.usersService.findUserByUsername(username);
        if (existingUser) {
          username += '_' + Date.now();
        }

        // If user doesn't exist, create a new one
        const newUser = await this.usersService.createUser({
          email: userData.email,
          full_name: userData.name,
          username,
        });

        // Generate JWT token
        const token = this.authService.signToken({ user_id: newUser.id });

        res.json({ data: newUser, token });
        return;
      }

      const token = this.authService.signToken({ user_id: user.id });

      res.json({ data: userData, token });
    } catch (error) {
      this.logger.error(`Error verifying Google token: ${error}`);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
