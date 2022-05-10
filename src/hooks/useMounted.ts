import { EffectCallback, useEffect } from 'react';

/**
 *
 * @param callback - The callback to run when the component is mounted
 * @returns void
 */
function useMounted(callback: EffectCallback) {
  useEffect(callback, []);
}

export default useMounted;
