/*
  # Add severity field to articles

  1. Changes
    - Add `severity` column to articles table with default value 'medium'
    - Possible values: critical, high, medium, low
    - Add check constraint to ensure valid values
  
  2. Purpose
    - Enable threat level calculation based on article severity
    - Allow editors to categorize articles by importance/urgency
*/

-- Add severity column with default value
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS severity text DEFAULT 'medium';

-- Add check constraint for valid severity values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'articles_severity_check'
  ) THEN
    ALTER TABLE articles 
    ADD CONSTRAINT articles_severity_check 
    CHECK (severity IN ('critical', 'high', 'medium', 'low'));
  END IF;
END $$;

-- Update existing articles with intelligent defaults based on category and breaking news status
UPDATE articles 
SET severity = CASE 
  WHEN is_breaking = true THEN 'high'
  WHEN verification_status = 'confirmed' THEN 'medium'
  ELSE 'low'
END
WHERE severity IS NULL OR severity = 'medium';
