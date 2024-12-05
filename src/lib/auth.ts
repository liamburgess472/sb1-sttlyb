import { supabase } from '@/lib/supabase';

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `https://creatorinspired.netlify.app/auth/v1/callback`
    }
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Sign-in failed: ${error.message}`);
  return {
    user: {
      id: data.user?.id,
      email: data.user?.email,
      user_metadata: {
        avatar_url: data.user?.user_metadata?.avatar_url,
        full_name: data.user?.user_metadata?.full_name
      }
    }
  };
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        avatar_url: null,
        full_name: email.split('@')[0]
      }
    }
  });
  if (error) throw new Error(`Sign-up failed: ${error.message}`);
  return {
    user: {
      id: data.user?.id,
      email: data.user?.email,
      user_metadata: data.user?.user_metadata
    }
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function isAdmin(user: { id: string; email: string } | null): boolean {
  return !!user && user.email === 'admin@creatorinspired.com';
}

export function getDefaultUserSettings() {
  return {
    theme: 'system',
    emailNotifications: true,
    weeklyDigest: true,
    mealPlanReminders: true,
    measurementUnit: 'metric',
    dietaryPreferences: []
  };
}