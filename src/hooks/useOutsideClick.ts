import { RefObject, useCallback } from 'react';
import useMounted from './useMounted';

/**
 * React hook that listens for clicks outside of a given ref.
 * @param callback - The callback to run when user clicks outside of the element
 * @param ref - The ref of the element to listen to
 * @returns {void} - void
 */
function useOutsideClick<T extends Node>(callback: () => void, ref: RefObject<T>): void {
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    const refElement = ref?.current;
    if (refElement && !refElement?.contains(event?.target as Node)) {
      callback();
    }
  }, []);
  useMounted(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  });
}

export default useOutsideClick;
