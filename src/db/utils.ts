import { IDatabase } from 'pg-promise';

export const initializeDatabase = async (
  db: IDatabase<unknown>
): Promise<void> => {
  try {
    const { rows } = await db.one('SELECT NOW() as current_time');
    console.log('Database connection successful:', rows[0].current_time);
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw new Error(
      `Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

export const verifyDatabaseStructure = async (
  db: IDatabase<unknown>,
  tableName: string
) => {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)`,
      [tableName]
    );

    if (!rows[0].exists) {
      console.warn(
        'Restaurant table does not exist, attempting to create it...'
      );
    }
  } catch (error) {
    console.error('Error verifying database structure:', error);
    throw error;
  }
};
