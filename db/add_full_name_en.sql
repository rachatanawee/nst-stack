-- Add full_name_en column to employees table
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS full_name_en TEXT;

-- Add comment
COMMENT ON COLUMN employees.full_name_en IS 'Employee full name in English';
