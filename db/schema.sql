-- =================================================================
--  Supabase DDL & RLS Script for HOYA Event System
--  Version 4: Added RBAC (Role-Based Access Control) System
-- =================================================================

-- =================================================================
--  Section 0: Clean Slate (ล้างข้อมูลเก่า)
-- =================================================================
-- Drop tables in reverse order of creation to avoid foreign key conflicts
DROP TABLE IF EXISTS public.winners CASCADE;
DROP TABLE IF EXISTS public.special_permissions CASCADE;
DROP TABLE IF EXISTS public.registrations CASCADE;
-- DROP TABLE IF EXISTS public.prize_allocations CASCADE;
-- DROP TABLE IF EXISTS public.draw_rounds CASCADE;
DROP TABLE IF EXISTS public.prizes CASCADE;
DROP TABLE IF EXISTS public.employees CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop views
DROP VIEW IF EXISTS public.v_lucky_draw_pool;
DROP VIEW IF EXISTS public.v_winner_details;
DROP VIEW IF EXISTS public.v_registration_report;

-- Drop functions
DROP FUNCTION IF EXISTS public.get_user_role();
DROP FUNCTION IF EXISTS public.has_permission(TEXT);


-- =================================================================
--  Section 1: Table Creation (การสร้างตาราง)
-- =================================================================

-- [NEW] ตารางสำหรับบทบาทผู้ใช้ (User Roles)
CREATE TABLE public.roles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE
);
COMMENT ON TABLE public.roles IS 'Defines user roles, e.g., super_admin, staff.';

-- [NEW] ตารางสำหรับสิทธิ์การใช้งาน (Permissions)
CREATE TABLE public.permissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE, -- e.g., 'users.create', 'prizes.delete'
  description TEXT
);
COMMENT ON TABLE public.permissions IS 'Defines granular permissions for actions in the system.';

-- [NEW] ตารางเชื่อมระหว่างบทบาทและสิทธิ์ (Role-Permission Junction)
CREATE TABLE public.role_permissions (
  role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);
COMMENT ON TABLE public.role_permissions IS 'Assigns permissions to roles.';

-- [UPDATED] ตารางเก็บข้อมูลเพิ่มเติมของผู้ใช้งานระบบ (Admins/Staff)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role_id BIGINT REFERENCES public.roles(id)
);
COMMENT ON TABLE public.profiles IS 'Stores additional user data linked to Supabase Auth.';

-- ตารางเก็บข้อมูลพนักงานทั้งหมด
CREATE TABLE public.employees (
  employee_id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  department TEXT,
  color TEXT
);
COMMENT ON TABLE public.employees IS 'Master list of all employees.';

-- ตารางเก็บข้อมูลของรางวัล
CREATE TABLE public.prizes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  total_quantity INT NOT NULL DEFAULT 1,
  image_url TEXT, -- URL to image in Supabase Storage
  session_name TEXT NOT NULL DEFAULT 'all', -- NEW: 'morning', 'evening', or 'all'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.prizes IS 'List of all available prizes for the lucky draw.';

-- ตารางสำหรับกำหนดรอบการจับรางวัล
-- Removed draw_rounds table

-- ตารางสำหรับจัดสรรรางวัลในแต่ละรอบ
-- Removed prize_allocations table

-- ตารางเก็บข้อมูลการลงทะเบียนเข้าร่วมงาน
CREATE TABLE public.registrations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  employee_id TEXT NOT NULL REFERENCES public.employees(employee_id),
  session TEXT NOT NULL, -- 'morning' or 'evening'
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.registrations IS 'Records each employee check-in at the event.';

-- ตารางเก็บข้อมูลพนักงานที่ได้สิทธิ์พิเศษ (ไม่ต้องมางาน)
CREATE TABLE public.special_permissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  employee_id TEXT NOT NULL REFERENCES public.employees(employee_id),
  reason TEXT, -- e.g., 'กะดึก'
  UNIQUE(employee_id)
);
COMMENT ON TABLE public.special_permissions IS 'Employees with special permission to join the lucky draw without attending.';

-- ตารางเก็บข้อมูลผู้ที่ได้รับรางวัล
CREATE TABLE public.winners (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  employee_id TEXT NOT NULL REFERENCES public.employees(employee_id),
  prize_id BIGINT NOT NULL REFERENCES public.prizes(id),
  -- draw_round_id BIGINT NOT NULL REFERENCES public.draw_rounds(id), -- Removed
  drawn_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  redemption_status TEXT NOT NULL DEFAULT 'pending', -- 'pending' or 'redeemed'
  redeemed_at TIMESTAMPTZ,
  redemption_photo_path TEXT, -- Path to image in Supabase Storage
  redeemed_by_staff UUID REFERENCES auth.users(id),
  UNIQUE(employee_id) -- เงื่อนไข: 1 คนได้รับรางวัลเดียว
);
COMMENT ON TABLE public.winners IS 'Logs all prize winners from the lucky draw.';


-- =================================================================
--  Section 1.5: Default Data Insertion
-- =================================================================
-- Insert default roles
INSERT INTO public.roles (name) VALUES ('super_admin'), ('staff');

-- Insert default permissions
INSERT INTO public.permissions (name, description) VALUES
  ('users.manage', 'Manage users (create, update, delete)'),
  ('prizes.manage', 'Manage prizes (create, update, delete)'),
  ('employees.manage', 'Manage employees (create, update, delete)'),
  ('registrations.manage', 'Manage event registrations'),
  ('winners.manage', 'Manage prize winners'),
  ('reports.read', 'View reports');

-- Assign all permissions to super_admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM public.roles WHERE name = 'super_admin'),
  p.id
FROM public.permissions p;

-- Assign specific permissions to staff
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM public.roles WHERE name = 'staff'),
  p.id
FROM public.permissions p
WHERE p.name IN ('registrations.manage', 'winners.manage');


-- =================================================================
--  Section 2: Helper Functions & RLS Setup
-- =================================================================

-- [UPDATED] Helper function to get user role name
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $
DECLARE
  user_role TEXT;
BEGIN
  SELECT r.name INTO user_role
  FROM public.profiles p
  JOIN public.roles r ON p.role_id = r.id
  WHERE p.id = auth.uid();
  RETURN user_role;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- [NEW] Helper function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(p_permission_name TEXT)
RETURNS BOOLEAN AS $
DECLARE
  has_perm BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.role_permissions rp
    JOIN public.profiles pr ON pr.role_id = rp.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE pr.id = auth.uid() AND p.name = p_permission_name
  ) INTO has_perm;
  RETURN has_perm;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.draw_rounds ENABLE ROW LEVEL SECURITY; -- Removed
-- ALTER TABLE public.prize_allocations ENABLE ROW LEVEL SECURITY; -- Removed
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- Policies for 'profiles'
CREATE POLICY "Allow users to view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow super_admins to manage all profiles" ON public.profiles FOR ALL USING (public.has_permission('users.manage'));

-- Policies for 'roles', 'permissions', 'role_permissions'
CREATE POLICY "Allow super_admins to manage roles and permissions" ON public.roles FOR ALL USING (public.has_permission('users.manage'));
CREATE POLICY "Allow super_admins to manage roles and permissions" ON public.permissions FOR ALL USING (public.has_permission('users.manage'));
CREATE POLICY "Allow super_admins to manage roles and permissions" ON public.role_permissions FOR ALL USING (public.has_permission('users.manage'));
CREATE POLICY "Allow authenticated users to read roles and permissions" ON public.roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to read roles and permissions" ON public.permissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to read roles and permissions" ON public.role_permissions FOR SELECT USING (auth.role() = 'authenticated');


-- Policies for 'employees', 'prizes', etc.
CREATE POLICY "Allow authenticated users to read" ON public.employees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow only admins to manage" ON public.employees FOR ALL USING (public.has_permission('employees.manage'));

CREATE POLICY "Allow authenticated users to read" ON public.prizes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow only admins to manage" ON public.prizes FOR ALL USING (public.has_permission('prizes.manage'));

-- CREATE POLICY "Allow authenticated users to read" ON public.draw_rounds FOR SELECT USING (auth.role() = 'authenticated'); -- Removed
-- CREATE POLICY "Allow only admins to manage" ON public.draw_rounds FOR ALL USING (public.get_user_role() = 'super_admin'); -- Removed

-- CREATE POLICY "Allow authenticated users to read" ON public.prize_allocations FOR SELECT USING (auth.role() = 'authenticated'); -- Removed
-- CREATE POLICY "Allow only admins to manage" ON public.prize_allocations FOR ALL USING (public.get_user_role() = 'super_admin'); -- Removed

CREATE POLICY "Allow staff/admins to manage" ON public.registrations FOR ALL USING (public.has_permission('registrations.manage'));

CREATE POLICY "Allow only admins to manage" ON public.special_permissions FOR ALL USING (public.get_user_role() = 'super_admin'); -- Or a new permission

CREATE POLICY "Allow authenticated users to read" ON public.winners FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow staff/admins to update redemption" ON public.winners FOR UPDATE USING (public.has_permission('winners.manage')) WITH CHECK (redemption_status IN ('pending', 'redeemed'));
CREATE POLICY "Allow only admins to insert/delete" ON public.winners FOR ALL USING (public.has_permission('winners.manage'));


-- =================================================================
--  Section 3: Views
-- =================================================================

-- View สำหรับแสดงข้อมูลผู้ได้รับรางวัลแบบสมบูรณ์
CREATE OR REPLACE VIEW public.v_winner_details AS
SELECT
  w.id AS winner_id,
  w.drawn_at,
  w.redemption_status,
  w.redeemed_at,
  w.redemption_photo_path,
  e.employee_id,
  e.full_name,
  e.department,
  p.name AS prize_name,
  p.image_url AS prize_image_url,
  -- dr.name as draw_round_name, -- Removed
  s.full_name AS staff_name
FROM
  public.winners w
  JOIN public.employees e ON w.employee_id = e.employee_id
  JOIN public.prizes p ON w.prize_id = p.id
  -- JOIN public.draw_rounds dr ON w.draw_round_id = dr.id -- Removed
  LEFT JOIN public.profiles s ON w.redeemed_by_staff = s.id;
COMMENT ON VIEW public.v_winner_details IS 'A comprehensive view joining winners with employee, prize, and round details.';


-- View สำหรับรายงานการลงทะเบียน
CREATE OR REPLACE VIEW public.v_registration_report AS
SELECT
  r.id,
  r.employee_id,
  e.full_name,
  e.department,
  r.session,
  r.registered_at
FROM
  public.registrations r
  JOIN public.employees e ON r.employee_id = e.employee_id;
COMMENT ON VIEW public.v_registration_report IS 'Provides data for registration reports, joining registration records with employee details.';


-- View สำหรับดึงรายชื่อผู้มีสิทธิ์ลุ้นรางวัลทั้งหมด
CREATE OR REPLACE VIEW public.v_lucky_draw_pool AS
SELECT employee_id, 'morning' AS session FROM public.registrations WHERE session = 'morning'
UNION
SELECT employee_id, 'evening' AS session FROM public.registrations WHERE session = 'evening'
UNION
SELECT employee_id, 'evening' AS session FROM public.special_permissions;
COMMENT ON VIEW public.v_lucky_draw_pool IS 'Consolidated list of all employees eligible for the lucky draw, separated by session.';


-- New view for lucky draw participants
CREATE OR REPLACE VIEW public.v_lucky_draw AS
SELECT
  r.registered_at,
  e.full_name,
  r.session AS session_name, -- Added alias
  e.employee_id,
  e.department
FROM
  public.registrations r
INNER JOIN -- Changed to INNER JOIN
  public.employees e ON r.employee_id = e.employee_id;
COMMENT ON VIEW public.v_lucky_draw IS 'Consolidated view of registered employees for lucky draw.';


-- =================================================================
--  Section 4: Storage Policies
-- =================================================================

CREATE POLICY "Allow super_admins to manage prize images"
ON storage.objects FOR ALL
USING (bucket_id = 'prizes' AND public.has_permission('prizes.manage'))
WITH CHECK (bucket_id = 'prizes' AND public.has_permission('prizes.manage'));

CREATE POLICY "Allow authenticated users to view prize images"
ON storage.objects FOR SELECT
USING (bucket_id = 'prizes');
