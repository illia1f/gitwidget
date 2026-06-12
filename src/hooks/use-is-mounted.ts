import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Return false during SSR/hydration and true on the client, without an
 * effect-driven extra render. Use for values the server can't know
 * (e.g. localStorage-backed theme).
 */
export const useIsMounted = (): boolean =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
