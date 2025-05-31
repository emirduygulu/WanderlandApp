import { User } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseConfig';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth durumunu izle - basitleştirilmiş versiyon
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Get initial session
    const initSession = async () => {
      try {
        console.log("Fetching initial session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        console.log("Session data:", data.session ? "Session exists" : "No session");
        
        if (data.session?.user) {
          console.log("User found in session:", data.session.user.email);
          setUser(data.session.user);
          setIsAuthenticated(true);
        } else {
          console.log("No user in session");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "User session active" : "No user session");
        
        if (session?.user) {
          console.log("User in new session:", session.user.email);
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          console.log("No user in new session");
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting login...", { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error.message);
        throw new Error(error.message);
      }
      
      console.log("Login successful:", data.user?.id);
      
      setUser(data.user);
      setIsAuthenticated(true);
      return;
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log("Attempting logout...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error.message);
        throw new Error(error.message);
      }
      
      console.log("Logout successful");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw new Error(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      console.log("Attempting registration...", { email, name });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: name ? { name } : undefined
        }
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        throw new Error(error.message);
      }
      
      console.log("Registration data:", data);
      
      if (data.user) {
        // If auto-confirm is disabled in Supabase, the user won't be fully registered until confirming email
        if (data.session) {
          console.log("User registered and logged in:", data.user.id);
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // Email confirmation required
          console.log("Registration successful, email confirmation required");
        }
      }
      
      return;
    } catch (error: any) {
      console.error('Registration error:', error.message);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log("Attempting password reset...", { email });
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        console.error("Password reset error:", error.message);
        throw new Error(error.message);
      }
      
      console.log("Password reset email sent");
    } catch (error: any) {
      console.error('Password reset error:', error.message);
      throw new Error(error.message || 'Password reset failed');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 