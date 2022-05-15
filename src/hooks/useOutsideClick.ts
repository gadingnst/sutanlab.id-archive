import { RefObject } from 'react';
import useUpdated from './useUpdated';

/**
 *
 * @param callback - The callback to run only when user clicks outside of the element
 * @param ref - The ref of the element to listen to
 */
function useOutsideClick<T extends Node>(callback: () => void, ref: RefObject<T>) {
  useUpdated(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref?.current && !ref.current.contains(event?.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideClick;
