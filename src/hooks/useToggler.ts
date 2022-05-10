import { useReducer } from 'react';

/**
 *
 * @param initial - The initial state of the toogler
 * @returns The state of the toogler
 */
function useToggler(initial = false) {
  const [enable, toggler] = useReducer(
    (prev: boolean, passValue?: boolean|any) => (
      typeof prev !== 'boolean' ? !prev : passValue
    ),
    initial
  );
  return [enable, toggler] as const;
}

export default useToggler;
