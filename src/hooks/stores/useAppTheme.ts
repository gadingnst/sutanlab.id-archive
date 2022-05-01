import { useEffect } from 'react';
import useStore from '@gadingnst/store-swr';

export type Theme = 'light'|'dark';
export interface ThemeState {
  current: Theme;
  next: Theme;
}

/**
 *
 * @returns theme state
 */
function useAppTheme() {
  const [theme, setTheme] = useStore({
    key: '@app/theme',
    initial: 'light',
    persist: true
  });

  const nextTheme = theme === 'light' ? 'dark' : 'light';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(nextTheme as Theme);
    root.classList.add(theme as Theme);
  }, [theme]);

  return [
    {
      current: theme,
      next: nextTheme
    } as ThemeState,
    setTheme
  ] as const;
}

export default useAppTheme;
