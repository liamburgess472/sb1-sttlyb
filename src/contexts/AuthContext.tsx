import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { signIn, signUp, signOut as authSignOut } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await signIn(email, password);
      setUser(user);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await signUp(email, password);
      setUser(user);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authSignOut();
      setUser(null);
      navigate('/');
      toast({
        title: "Signed out successfully"
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signIn: handleSignIn, 
        signUp: handleSignUp, 
        signOut: handleSignOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}