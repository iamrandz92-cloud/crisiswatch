/*
  # Add Multi-Language Translation Support

  1. Schema Changes
    - Add `translations` table to store article translations
      - `id` (uuid, primary key)
      - `article_id` (uuid, foreign key to articles)
      - `language_code` (text, e.g., 'en', 'es', 'fr', 'ar', 'zh')
      - `title` (text, translated title)
      - `content` (text, translated content)
      - `summary` (text, translated summary)
      - `created_at` (timestamp)
    
    - Add `user_preferences` table to store user language preferences
      - `id` (uuid, primary key)
      - `user_id` (uuid, optional for anonymous users)
      - `session_id` (text, for tracking anonymous users)
      - `language_code` (text, preferred language)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Translations are publicly readable
    - User preferences readable by owner or session
*/

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
  language_code text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, language_code)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  language_code text NOT NULL DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_or_session_check CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_article_language ON translations(article_id, language_code);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_session_id ON user_preferences(session_id);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Translations are publicly readable
CREATE POLICY "Translations are publicly readable"
  ON translations FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can insert translations (for future admin features)
CREATE POLICY "Authenticated users can insert translations"
  ON translations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- User preferences policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO public
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() = user_id OR
    (user_id IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO public
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  )
  WITH CHECK (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );

CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  TO public
  USING (
    auth.uid() = user_id OR
    session_id IS NOT NULL
  );