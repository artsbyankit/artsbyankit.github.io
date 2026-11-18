import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// False during the build-time pre-render and the hydration pass, true after.
// Gate anything that needs `document` in render (portals) on it, so the first
// client render matches the pre-rendered HTML exactly.
export default function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
