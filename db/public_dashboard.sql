-- File: db/public_dashboard.sql (New Version)
-- This script sets up the database for a secure, real-time public dashboard
-- without using a summary table.

-- 1. Create a secure function to get registration data for the public dashboard.
--    Only non-sensitive columns (color, department, session) are returned.
--    SECURITY DEFINER makes it run with the permissions of the creator,
--    bypassing the calling user's RLS, which is necessary for public access.
CREATE OR REPLACE FUNCTION public.get_public_registrations()
RETURNS TABLE(color TEXT, department TEXT, session TEXT, is_committee BOOLEAN) AS $$
BEGIN
  RETURN QUERY SELECT
    e.color,
    e.department,
    r.session,
    CASE WHEN e.is_committee = true THEN true ELSE false END AS is_committee
  FROM
    public.registrations r
  JOIN
    public.employees e ON r.employee_id = e.employee_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Grant permission for public (anon) users to call this function.
GRANT EXECUTE ON FUNCTION public.get_public_registrations() TO anon;

-- 3. Create a dummy table to signal real-time updates.
--    The dashboard will listen for changes to this table.
DROP TABLE IF EXISTS public.dashboard_updater;
CREATE TABLE public.dashboard_updater (id int primary key, last_updated timestamptz);

--    Enable RLS and allow public read access to this updater table.
ALTER TABLE public.dashboard_updater ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.dashboard_updater FOR SELECT USING (true);

--    Insert the single row that will be updated to trigger notifications.
INSERT INTO public.dashboard_updater (id, last_updated) VALUES (1, now());

-- 4. Create a function that updates the dummy table.
CREATE OR REPLACE FUNCTION public.trigger_dashboard_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the 'last_updated' column to trigger a real-time event.
  UPDATE public.dashboard_updater SET last_updated = now() WHERE id = 1;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. Create a trigger on the 'registrations' table.
--    This trigger calls the update function whenever a registration is added, changed, or removed.
DROP TRIGGER IF EXISTS on_registration_change ON public.registrations;
CREATE TRIGGER on_registration_change
  AFTER INSERT OR UPDATE OR DELETE ON public.registrations
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.trigger_dashboard_update();

-- IMPORTANT:
-- After running this script, you must enable "Realtime" for two tables
-- in your Supabase project's dashboard (Database -> Replication):
--   1. dashboard_updater
--   2. registrations (The trigger reads from this, so it needs to be enabled)


-- 6. Create a secure function to get the count of committee members.
CREATE OR REPLACE FUNCTION public.get_committee_count()
RETURNS INT AS $
DECLARE
  committee_count INT;
BEGIN
  SELECT COUNT(*) INTO committee_count FROM public.employees WHERE is_committee = true;
  RETURN committee_count;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant permission for public users to call this function.
GRANT EXECUTE ON FUNCTION public.get_committee_count() TO anon;
