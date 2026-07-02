-- ============================================================
-- AUTO-CREATE USER PROFILE ON AUTH SIGNUP
-- ============================================================

-- When a user signs up via Supabase Auth, automatically create
-- their profile in the users table with metadata from the signup.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_val user_role;
  user_name TEXT;
BEGIN
  -- Extract role from signup metadata (default: taxpayer)
  user_role_val := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'taxpayer'
  );

  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  -- Insert into public.users
  INSERT INTO public.users (auth_id, name, email, phone, role, region)
  VALUES (
    NEW.id,
    user_name,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    user_role_val,
    NEW.raw_user_meta_data->>'region'
  );

  -- If taxpayer, also create a taxpayer profile
  IF user_role_val = 'taxpayer' THEN
    INSERT INTO public.taxpayers (
      user_id, name, tin, email, phone, address, region, status
    )
    SELECT
      u.id,
      user_name,
      COALESCE(NEW.raw_user_meta_data->>'tin', 'TIN-' || LEFT(NEW.id::TEXT, 8)),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'address', ''),
      COALESCE(NEW.raw_user_meta_data->>'region', 'Southwest (Sud-Ouest)'),
      'pending'
    FROM public.users u
    WHERE u.auth_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- AUDIT LOG HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION log_audit(
  p_action TEXT,
  p_resource TEXT,
  p_details TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'success'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (user_id, user_name, action, resource, details, status)
  SELECT
    u.id,
    u.name,
    p_action,
    p_resource,
    p_details,
    p_status
  FROM users u
  WHERE u.auth_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
