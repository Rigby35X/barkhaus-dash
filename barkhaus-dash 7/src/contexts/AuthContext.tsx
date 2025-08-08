import React, { createContext, useContext, useEffect, useState } from 'react';
import { xanoAPI } from '../services/xanoApi';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'volunteer';
  organizationId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, organizationName: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define valid roles array for type checking
const VALID_ROLES: User['role'][] = ['admin', 'staff', 'volunteer'];

// Helper function to validate and cast role
const validateRole = (role: string | undefined): User['role'] => {
  if (role && VALID_ROLES.includes(role as User['role'])) {
    return role as User['role'];
  }
  return 'admin'; // Default fallback
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // Check for test session first
        const testToken = localStorage.getItem('test_auth_token');
        if (testToken) {
          const testUser: User = {
            id: 'test-user-1',
            email: 'test@barkhaus.com',
            name: 'Test Admin',
            role: 'admin',
            organizationId: '1'
          };
          setUser(testUser);
          setLoading(false);
          return;
        }

        // Otherwise check for real session
        const userData = await xanoAPI.getMe();
        const mappedUser: User = {
          id: userData.id.toString(),
          email: userData.email,
          name: `${userData.first_name} ${userData.last_name}`,
          role: validateRole(userData.role),
          organizationId: userData.organization_id?.toString() || '1'
        };
        setUser(mappedUser);
      } catch (error) {
        // No valid session, user remains null
        console.log('No valid session found');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Test credentials for easy access
      if (email === 'test@barkhaus.com' && password === 'test123') {
        const testUser: User = {
          id: 'test-user-1',
          email: 'test@barkhaus.com',
          name: 'Test Admin',
          role: 'admin',
          organizationId: '1'
        };
        setUser(testUser);
        // Store test session
        localStorage.setItem('test_auth_token', 'test-token-123');
        return;
      }

      // Try actual API login
      const response = await xanoAPI.login(email, password);
      const mappedUser: User = {
        id: response.user.id.toString(),
        email: response.user.email,
        name: `${response.user.first_name} ${response.user.last_name}`,
        role: validateRole(response.user.role),
        organizationId: response.user.organization_id?.toString() || '1'
      };
      setUser(mappedUser);
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const register = async (email: string, password: string, name: string, organizationName: string) => {
    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      const response = await xanoAPI.signup(email, password, firstName, lastName, organizationName);
      const mappedUser: User = {
        id: response.user.id.toString(),
        email: response.user.email,
        name: `${response.user.first_name} ${response.user.last_name}`,
        role: validateRole(response.user.role),
        organizationId: response.user.organization_id?.toString() || '1'
      };
      setUser(mappedUser);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    xanoAPI.logout();
    localStorage.removeItem('test_auth_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};