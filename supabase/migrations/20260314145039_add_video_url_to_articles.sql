/*
  # Add video support to articles

  1. Changes
    - Add `video_url` column to articles table to support video content
    - Column is nullable as not all articles will have videos
  
  2. Notes
    - Uses IF NOT EXISTS to safely add column if it doesn't exist
    - No data loss or destructive operations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE articles ADD COLUMN video_url text;
  END IF;
END $$;