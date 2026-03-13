import { useState, useEffect } from "react";

export const useDebouncedState = <ValueT>(
  value: ValueT,
  timeoutMs: number = 500
) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeoutMs);

    return () => clearTimeout(handler);
  }, [value, timeoutMs]);

  return state;
};