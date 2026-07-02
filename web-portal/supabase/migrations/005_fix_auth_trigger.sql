-- ============================================================
-- FIX: Auth trigger — handle Dashboard-created users safely
-- The trigger was failing when creating users from the Dashboard
-- because metadata is empty/null in that context.
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_val user_role;
  user_name TEXT;
  role_text TEXT;
BEGIN
  -- Safely extract role, handling null/empty metadata
  role_text := NULL;
  IF NEW.raw_user_meta_data IS NOT NULL AND NEW.raw_user_meta_data::TEXT != '{}' THEN
    role_text := NEW.raw_user_meta_data->>'role';
  END IF;

  -- Cast to enum with fallback
  BEGIN
    IF role_text IS NOT NULL AND role_text != '' THEN
      user_role_val := role_text::user_role;
    ELSE
      user_role_val := 'taxpayer';
    END IF;
  EXCEPTION WHEN OTHERS THEN
    user_role_val := 'taxpayer';
  END;

  -- Extract name
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  -- Insert into public.users
  BEGIN
    INSERT INTO public.users (auth_id, name, email, phone, role, region)
    VALUES (
      NEW.id,
      user_name,
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      user_role_val,
      NEW.raw_user_meta_data->>'region'
    );
  EXCEPTION WHEN unique_violation THEN
    -- User row already exists (e.g. re-confirmation), skip
    NULL;
  END;

  -- If taxpayer, also create a taxpayer profile
  IF user_role_val = 'taxpayer' THEN
    BEGIN
      INSERT INTO public.taxpayers (
        user_id, name, tin, email, phone, address, region, status
      )
      SELECT
        u.id,
        user_name,
        COALESCE(NEW.raw_user_meta_data->>'tin', 'TIN-' || LEFT(NEW.id::TEXT, 8)),
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'address', ''),
        COALESCE(NEW.raw_user_meta_data->>'region', 'Southwest (Sud-Ouest)'),
        'pending'
      FROM public.users u
      WHERE u.auth_id = NEW.id;
    EXCEPTION WHEN OTHERS THEN
      -- Don't let taxpayer creation failure block user creation
      NULL;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger (drop first to avoid duplicate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
