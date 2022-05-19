import { useState } from 'react';

/**
 *
 * @param initial - The initial state of the toogler
 * @returns - The state of the toogler
 */
function useToggler(initial = false) {
  const [toggle, setToggle] = useState(initial);

  const toggler = (value?: boolean|any) => setToggle(
    typeof value !== 'boolean'
      ? !toggle
      : value
  );

  return [toggle, toggler] as const;
}

export default useToggler;
