
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'client' | 'artist' | 'business' | 'transport';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
  rating?: number;
  completedJobs?: number;
  glowCoins?: number;
  referralCode?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, phone?: string, avatar?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('deevah_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call with role-based users
    const mockUsers: Record<string, User> = {
      'client@test.com': {
        id: '1',
        name: 'Sarah Johnson',
        email: 'client@test.com',
        role: 'client',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b739',
        glowCoins: 150,
        referralCode: 'SARAH150'
      },
      'artist@test.com': {
        id: '2',
        name: 'Maya Styles',
        email: 'artist@test.com',
        role: 'artist',
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb',
        verified: true,
        rating: 4.9,
        completedJobs: 127,
        glowCoins: 320,
        referralCode: 'MAYA320'
      },
      'business@test.com': {
        id: '3',
        name: 'Golden Beauty Salon',
        email: 'business@test.com',
        role: 'business',
        avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
        verified: true,
        glowCoins: 850,
        referralCode: 'GOLDEN850'
      }
    };

    const foundUser = mockUsers[email] || {
      id: Date.now().toString(),
      name: 'New User',
      email,
      role: 'client' as UserRole,
      glowCoins: 50,
      referralCode: `USER${Date.now().toString().slice(-4)}`
    };
    
    setUser(foundUser);
    localStorage.setItem('deevah_user', JSON.stringify(foundUser));
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, phone?: string, avatar?: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role,
      avatar: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      verified: false,
      rating: role === 'artist' ? 5.0 : undefined,
      completedJobs: 0,
      glowCoins: 50,
      referralCode: `${name.toUpperCase().slice(0, 3)}${Date.now().toString().slice(-3)}`
    };
    
    setUser(newUser);
    localStorage.setItem('deevah_user', JSON.stringify(newUser));
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('deevah_user', JSON.stringify(updatedUser));
    }
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
      isAuthenticated: !!user,
      updateUser
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
