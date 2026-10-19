import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * False during server rendering and hydration, true once on the client.
 * Use it to hold back UI that depends on browser-only state (the resolved
 * theme, document.body for portals) without a hydration mismatch.
 */
export function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}
