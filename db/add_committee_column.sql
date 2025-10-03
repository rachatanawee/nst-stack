-- This script adds the is_committee column to your employees table.

ALTER TABLE public.employees
ADD COLUMN is_committee BOOLEAN DEFAULT FALSE;


-- After running this, you can mark employees as committee members using an UPDATE statement.
-- For example:
-- UPDATE public.employees SET is_committee = true WHERE employee_id = 'some_employee_id';
