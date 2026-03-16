/*
  # Add Unique Index for Article URLs
  
  ## Purpose
  Prevent duplicate articles from being stored by enforcing uniqueness on source_url.
  
  ## Changes
  - Add unique index on articles.source_url to prevent RSS feed duplicates
  
  ## Notes
  This ensures the automated RSS feed collection won't create duplicate entries
  when fetching from the same sources multiple times.
*/

-- Add unique index on source_url to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_source_url_unique ON articles(source_url);
