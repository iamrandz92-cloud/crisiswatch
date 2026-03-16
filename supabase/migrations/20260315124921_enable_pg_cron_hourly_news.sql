/*
  # Enable pg_cron and Schedule Hourly News Collection

  1. Purpose
    - Enable pg_cron extension for scheduled jobs
    - Create hourly cron job to collect RSS feeds automatically
    - Ensure news is always fresh and up-to-date

  2. Changes
    - Enable pg_cron extension
    - Create cron job that runs every hour at minute 0
    - Calls collect-rss-feeds edge function to fetch latest news

  3. Schedule
    - Runs: Every hour at :00 (e.g., 1:00, 2:00, 3:00, etc.)
    - Action: Fetches RSS feeds from all active sources
    - Result: New articles automatically added to database

  4. Monitoring
    - Check cron.job_run_details for execution history
    - Monitor sources.last_fetched_at for successful updates
*/

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule hourly news collection (runs at :00 of every hour)
SELECT cron.schedule(
  'hourly-news-collection',
  '0 * * * *',
  $$
    SELECT
      net.http_post(
        url := 'https://qlhfjqrniyudeqtbmuop.supabase.co/functions/v1/collect-rss-feeds',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGZqcXJuaXl1ZGVxdGJtdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjUxODMsImV4cCI6MjA4OTAwMTE4M30.aLjpbPFWI7MQLFXrUHhzapZHqS4oYtCUxwY7O4wJ21k'
        )
      ) AS request_id;
  $$
);
