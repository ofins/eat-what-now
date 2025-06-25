import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import logger from 'src/log/logger';

export async function serveMarkdownFile(
  filepath: string,
  res: Response
): Promise<void> {
  try {
    const absolutePath = path.resolve(__dirname, '..', '..', filepath);
    const content = await fs.promises.readFile(absolutePath, 'utf-8');
    res.set('Content-Type', 'text/markdown');
    res.send(content);
  } catch (error) {
    logger.error(`Error reading file: ${filepath}`, error);
    res.status(404).send('Error reading file');
  }
}
