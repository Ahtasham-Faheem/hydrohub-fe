import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api';
import type { LoginCredentials } from '../services/api';
import { useProfile } from '../hooks/useAuth';

// TODO: Change this to false when backend is ready
export const DEMO_MODE = false;

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  setAuthDirectly: (accessToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProviderInner = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use profile query to validate token
  const { data: profileData, isLoading: profileLoading, error: profileError } = useProfile();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    if (profileData) {
      setUser(profileData);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else if (profileError) {
      // Token is invalid, clear auth state
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    } else if (!profileLoading && token) {
      setIsLoading(false);
    }
  }, [profileData, profileError, profileLoading]);

  const login = async (credentials: LoginCredentials) => {
    if (DEMO_MODE) {
      // Demo mode: Allow any login without API call
      const demoUser = {
        id: '1',
        email: credentials.email || 'demo@example.com',
        role: 'admin',
        name: credentials.email ? credentials.email.split('@')[0] : 'Demo User'
      };
      
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('userData', JSON.stringify(demoUser));
      
      setUser(demoUser);
      setIsAuthenticated(true);
      return;
    }

    // Real API mode
    try {
      const userType = import.meta.env.VITE_USER_TYPE || 'staff';
      const response = await authService.login(credentials, userType);
      
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const setAuthDirectly = (accessToken: string, user: User) => {
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('userData', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, setAuthDirectly, logout, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProviderInner>
      {children}
    </AuthProviderInner>
  );
};