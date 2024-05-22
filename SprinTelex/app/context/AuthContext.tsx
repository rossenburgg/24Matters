import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AuthContextType {
  user: {
    profilePictureUrl: string;
  } | null;
  setUser: React.Dispatch<React.SetStateAction<{
    profilePictureUrl: string;
  } | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ profilePictureUrl: string} | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};