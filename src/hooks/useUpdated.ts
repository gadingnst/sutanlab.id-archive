import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

/**
 *
 * @param callback - The callback to run only when the dependency changes
 * @param deps - The dependencies to run the callback
 * @returns void
 */
function useUpdated(callback: EffectCallback, deps: DependencyList) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) return callback();
    else didMount.current = true;
  }, deps);
}

export default useUpdated;
