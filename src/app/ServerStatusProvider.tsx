"use client";

import { createContext, useContext, ReactNode } from "react";

const ServerStatusContext = createContext<{ isServerUp: boolean }>({ isServerUp: true });

export default function ServerStatusProvider({ children }: { children: ReactNode }) {
  return (
    <ServerStatusContext.Provider value={{ isServerUp: true }}>
      {children}
    </ServerStatusContext.Provider>
  );
} 