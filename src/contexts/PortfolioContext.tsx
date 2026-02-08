"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface PortfolioContextType {
  username: string;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
  username: string;
  children: ReactNode;
}

export function PortfolioProvider({ username, children }: PortfolioProviderProps) {
  return (
    <PortfolioContext.Provider value={{ username }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolioContext must be used within a PortfolioProvider');
  }
  return context;
}
