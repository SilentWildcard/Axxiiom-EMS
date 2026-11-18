/**
 * SimulatorContext — provides a single shared instance of useHardwareSimulator
 * across the entire application so that App.tsx and HardwareSimulationLab.tsx
 * both consume the SAME state machine (fixes the dual-instance bug).
 */

import React, { createContext, useContext } from 'react';
import { useHardwareSimulator } from './useHardwareSimulator';

// Derive the shape from the hook's return type
type SimulatorContextValue = ReturnType<typeof useHardwareSimulator>;

const SimulatorContext = createContext<SimulatorContextValue | null>(null);

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sim = useHardwareSimulator();
  return <SimulatorContext.Provider value={sim}>{children}</SimulatorContext.Provider>;
};

export function useSimulator(): SimulatorContextValue {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error('useSimulator must be used within <SimulatorProvider>');
  return ctx;
}
