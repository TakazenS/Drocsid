import type { ThemePreference } from '../theme/ThemeContext.ts';
import type { IconType } from 'react-icons';

import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu';

import { useTheme } from '../theme/useTheme.ts';

import styles from './ThemeToggle.module.css';

const OPTIONS: { value: ThemePreference; Icon: IconType; }[] = [
  { value: 'system', Icon: LuMonitor },
  { value: 'light', Icon: LuSun },
  { value: 'dark', Icon: LuMoon },
];

export default function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className={styles.toggle} role="group" aria-label="Theme">
      {OPTIONS.map(({ value, Icon }) => (
        <button
          key={value}
          type="button"
          className={styles.option}
          aria-pressed={preference === value}
          onClick={() => setPreference(value)}
        >
          <Icon size={16} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
