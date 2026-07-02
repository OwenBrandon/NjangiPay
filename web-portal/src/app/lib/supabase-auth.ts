import { supabase } from './supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User, UserRole } from '../types';

export async function signIn(email: string, password: string): Promise<User | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return null;
  return await fetchUserProfile(data.user);
}

export async function signUp(
  email: string,
  password: string,
  metadata: { name: string; role: UserRole; phone?: string; region?: string; tin?: string; address?: string }
): Promise<User | null> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  if (error || !data.user) return null;
  // The DB trigger auto-creates user + taxpayer rows
  // Wait briefly for the trigger to execute
  await new Promise((r) => setTimeout(r, 500));
  return await fetchUserProfile(data.user);
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) return null;
  return await fetchUserProfile(data.session.user);
}

export async function fetchUserProfile(authUser: SupabaseUser): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUser.id)
    .single();

  if (error || !data) {
    // Fallback: construct from auth metadata if DB row isn't ready yet
    const meta = authUser.user_metadata;
    return {
      id: authUser.id,
      name: meta?.name || meta?.full_name || authUser.email?.split('@')[0] || '',
      email: authUser.email || '',
      role: (meta?.role as UserRole) || 'taxpayer',
      region: meta?.region,
    };
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as UserRole,
    region: data.region || undefined,
    avatar: data.avatar_url || undefined,
  };
}

