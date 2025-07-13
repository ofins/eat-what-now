import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Enable PostGIS extension if not already enabled
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS postgis;`);

  // Add geometry column
  await knex.raw(`
    ALTER TABLE restaurants
    ADD COLUMN IF NOT EXISTS geom GEOMETRY(Point, 4326);
  `);

  // Update existing records with valid coordinates only
  await knex.raw(`
    UPDATE restaurants
    SET geom = ST_SetSRID(ST_Point(longitude, latitude), 4326)
    WHERE longitude IS NOT NULL 
      AND latitude IS NOT NULL
      AND longitude BETWEEN -180 AND 180
      AND latitude BETWEEN -90 AND 90;
  `);

  // Create spatial index
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_restaurants_geom 
    ON restaurants USING GIST(geom);        
  `);

  // Create trigger function
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_restaurant_geom()
    RETURNS TRIGGER AS $$
    BEGIN
        IF NEW.longitude IS NOT NULL AND NEW.latitude IS NOT NULL 
           AND NEW.longitude BETWEEN -180 AND 180
           AND NEW.latitude BETWEEN -90 AND 90 THEN
            NEW.geom := ST_SetSRID(ST_Point(NEW.longitude, NEW.latitude), 4326);
        ELSE
            NEW.geom := NULL;
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Create trigger
  await knex.raw(`
    DROP TRIGGER IF EXISTS trg_update_restaurant_geom ON restaurants;
    CREATE TRIGGER trg_update_restaurant_geom
    BEFORE INSERT OR UPDATE ON restaurants
    FOR EACH ROW 
    EXECUTE FUNCTION update_restaurant_geom();
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop trigger first
  await knex.raw(`
    DROP TRIGGER IF EXISTS trg_update_restaurant_geom ON restaurants;
  `);

  // Drop function
  await knex.raw(`
    DROP FUNCTION IF EXISTS update_restaurant_geom();
  `);

  // Drop index
  await knex.raw(`
    DROP INDEX IF EXISTS idx_restaurants_geom;
  `);

  // Drop column
  await knex.raw(`
    ALTER TABLE restaurants
    DROP COLUMN IF EXISTS geom;
  `);
}
