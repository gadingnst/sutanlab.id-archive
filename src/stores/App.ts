import type { Store } from '@gadingnst/store-swr';
import type { Theme } from 'utils/hooks/useAppTheme';

export const APP_THEME: Store<Theme> = {
  key: '@app/theme',
  initial: 'light',
  persist: true
};
