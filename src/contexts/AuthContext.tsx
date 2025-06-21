
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'client' | 'artist' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('deevah_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      role: 'client' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    };
    
    setUser(mockUser);
    localStorage.setItem('deevah_user', JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    // Simulate API call
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    };
    
    setUser(newUser);
    localStorage.setItem('deevah_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('deevah_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
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
