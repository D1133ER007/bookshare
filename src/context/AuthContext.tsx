import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import AuthModal from "@/components/auth/AuthModal";
import { successToast, errorToast } from "@/components/ui/custom-toast";
import { profileService } from "@/services/supabase";
import { useLocation } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: { name: string; location: string }) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalTab: "login" | "signup";
  setAuthModalTab: (tab: "login" | "signup") => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: new Error('Not implemented') }),
  signUp: async () => ({ error: new Error('Not implemented') }),
  signOut: async () => ({ error: new Error('Not implemented') }),
  showAuthModal: false,
  setShowAuthModal: () => {},
  authModalTab: "login",
  setAuthModalTab: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Redirect and show welcome back toast when user logs in
  useEffect(() => {
    const handleAuthChange = (event: string, session: Session | null) => {
      // Only redirect on sign in, not on every auth state change
      if (event === 'SIGNED_IN' && session?.user && location.pathname === '/') {
        navigate("/books");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) {
        setShowAuthModal(false);
        successToast({ message: "Welcome back! You've successfully signed in." });
      } else {
        errorToast({ message: error.message });
      }
      return { error };
    } catch (error: any) {
      errorToast({ message: error.message });
      return { error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: { name: string; location: string }
  ) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        errorToast({ message: authError.message });
        return { error: authError };
      }

      if (authData.user) {
        // Create profile for the new user
        await profileService.createProfile({
          id: authData.user.id,
          email,
          name: userData.name,
          location: userData.location,
        });

        setShowAuthModal(false);
        successToast({
          message: "Account created successfully! Please check your email to confirm your registration.",
        });
      }

      return { error: null };
    } catch (error: any) {
      errorToast({ message: error.message });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        successToast({ message: "You've been successfully signed out." });
        navigate("/");
      } else {
        errorToast({ message: error.message });
      }
      return { error };
    } catch (error: any) {
      errorToast({ message: error.message });
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    showAuthModal,
    setShowAuthModal,
    authModalTab,
    setAuthModalTab,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
        onLogin={async (data) => {
          await signIn(data.email, data.password);
        }}
        onSignup={async (data) => {
          await signUp(data.email, data.password, {
            name: data.name,
            location: data.location || "Unknown",
          });
        }}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { AuthContextType };
