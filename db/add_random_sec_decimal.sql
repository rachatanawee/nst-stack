-- Add random_sec column as DECIMAL to allow decimal values
-- This migration changes the random_sec column from INTEGER to DECIMAL

-- First, check if the column exists and what type it is
DO $$
BEGIN
    -- Check if random_sec column exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'prizes'
        AND column_name = 'random_sec'
        AND table_schema = 'public'
    ) THEN
        -- If it exists and is INTEGER, alter it to DECIMAL
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'prizes'
            AND column_name = 'random_sec'
            AND data_type = 'integer'
        ) THEN
            ALTER TABLE public.prizes ALTER COLUMN random_sec TYPE DECIMAL(5,2);
            RAISE NOTICE 'Altered random_sec column from INTEGER to DECIMAL(5,2)';
        ELSE
            RAISE NOTICE 'random_sec column already exists with correct type';
        END IF;
    ELSE
        -- If it doesn't exist, add it as DECIMAL
        ALTER TABLE public.prizes ADD COLUMN random_sec DECIMAL(5,2) NULL;
        RAISE NOTICE 'Added random_sec column as DECIMAL(5,2)';
    END IF;
END $$;
