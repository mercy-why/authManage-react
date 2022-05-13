import { useEffect } from 'react';

/**
 * Run an effect only once upon component mount/unmount.
 */
const useEffectOnce = (effect) =>
  useEffect(effect, []);

export default useEffectOnce;
