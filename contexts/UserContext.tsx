/**
 * UserContext - VANN App
 * Contexto de dados do usuário
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types/common';
import { Parent, Driver, Child } from '@/types/user';

interface UserContextType {
  userRole: UserRole | null;
  parentData: Parent | null;
  driverData: Driver | null;
  setUserRole: (role: UserRole) => void;
  setParentData: (data: Parent | null) => void;
  setDriverData: (data: Driver | null) => void;
  selectedChild: Child | null;
  setSelectedChild: (child: Child | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [parentData, setParentData] = useState<Parent | null>(null);
  const [driverData, setDriverData] = useState<Driver | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  return (
    <UserContext.Provider
      value={{
        userRole,
        parentData,
        driverData,
        setUserRole,
        setParentData,
        setDriverData,
        selectedChild,
        setSelectedChild,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
