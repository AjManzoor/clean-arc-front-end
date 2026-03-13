import { useRef, useEffect } from "react";
import type { DependencyList, EffectCallback } from "react";

export const useEffectAfterMount = (
  cb: EffectCallback,
  dependencies: DependencyList | undefined
) => {
  const mounted = useRef(true);

  if (!!dependencies && dependencies.length === 0) {
    throw Error(
      "useEffectAfterMount should not be used with an empty dependencies list, it will never fire"
    );
  }

  useEffect(() => {
    if (!mounted.current) {
      return cb();
    }

    mounted.current = false;
  }, dependencies);
};