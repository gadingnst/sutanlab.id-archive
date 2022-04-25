import { useState } from 'react';

function useToggler(initial = false) {
  const [toggle, setToggle] = useState(initial);

  const toggler = () => setToggle(!toggle);

  return [toggle, toggler] as const;
}

export default useToggler;
