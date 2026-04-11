-- Allow public read access to video files in the portfolio bucket
-- This targets objects under the 'videos/' folder only.

-- Create policy only if it does not already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read portfolio videos'
  ) THEN
    CREATE POLICY "Public read portfolio videos"
      ON storage.objects
      FOR SELECT
      TO public
      USING (
        bucket_id = 'portfolio'
        AND name LIKE 'videos/%'
      );
  END IF;
END $$;
