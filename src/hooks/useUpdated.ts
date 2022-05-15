import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

/**
 *
 * @param callback - The callback to run only when the dependency changes
 * @param deps - The dependencies to run the callback
 * @returns void
 */
function useUpdated(callback: EffectCallback, deps: DependencyList) {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return callback();
    else mounted.current = true;
  }, deps);
}

export default useUpdated;
