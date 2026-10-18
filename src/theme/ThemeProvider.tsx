import type { ThemePreference } from './ThemeContext';
import type { ReactNode } from 'react';

import { useEffect, useState } from 'react';

import { ThemeContext } from './ThemeContext';

const STORAGE_KEY = 'drocsid-theme';

function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(readStoredPreference);

  useEffect(() => {
    const root = document.documentElement;

    if (preference === 'system') {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = preference;
    }

    try {
      if (preference === 'system') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, preference);
      }
    } catch {
      // Storage not reachable
    }
  }, [preference]);

  return (
    <ThemeContext value={{ preference, setPreference }}>
      {children}
    </ThemeContext>
  );
}
