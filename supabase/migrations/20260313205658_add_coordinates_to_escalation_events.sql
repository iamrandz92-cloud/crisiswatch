/*
  # Add Geographic Coordinates to Escalation Events

  1. Changes
    - Add `latitude` column (decimal) to escalation_events table
    - Add `longitude` column (decimal) to escalation_events table
    - Both fields are nullable to support existing data
    - Add index on latitude and longitude for efficient geographic queries

  2. Notes
    - Coordinates will enable plotting events on interactive map
    - Format: Standard WGS84 decimal degrees (e.g., lat: 50.4501, lon: 30.5234)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'escalation_events' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE escalation_events ADD COLUMN latitude decimal(10, 7);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'escalation_events' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE escalation_events ADD COLUMN longitude decimal(10, 7);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_escalation_events_coordinates 
  ON escalation_events(latitude, longitude) 
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;