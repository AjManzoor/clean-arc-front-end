import { useEffect, useState } from "react";

import { useFetchExplicit } from "../../../lib/hooks/useFetchExplicit";
import { useDebouncedState } from "../../../lib/hooks/useDebouncedState";
import type { IAutoCompleteOption } from "../../../lib/lookups/types";

import type { AutoCompleteMapApiToOptionCallback } from "../types/types";

export function useApiAutoComplete(
  onChange: (value: string | null, option: IAutoCompleteOption | null) => void,
  queryEndpoint: string,
  mapToOptions: AutoCompleteMapApiToOptionCallback,
  debounceWindowMs?: number,
  minQueryChars?: number,
  initialSelectedValue?: IAutoCompleteOption | null,
  getFetchParams?: (query: string) => any
) {
  const normMinQueryChars = minQueryChars ?? 3;
  const debounceMs = debounceWindowMs ?? 500; // Default

  const [queryValue, setQueryValue] = useState<string>("");
  const debouncedQueryValue = useDebouncedState(queryValue, debounceMs);

  const [optionsAreOpen, setOptionsAreOpen] = useState(false);
  const [options, setOptions] = useState<readonly IAutoCompleteOption[]>([]);

  const [selectedValue, setSelectedValue] =
    useState<IAutoCompleteOption | null>(initialSelectedValue ?? null);

  const fetchOpOptions = useFetchExplicit<any | null>(queryEndpoint);

  // Event handlers
  useEffect(() => {
    fetchOptions(debouncedQueryValue);
  }, [debouncedQueryValue]);

  // Internals
  const fetchOptions = async (query: string) => {
    if (!optionsAreOpen) return;
    if (query.length < normMinQueryChars) return;
    if (query.trim().length == 0) return;

    const fetchParams = getFetchParams
      ? getFetchParams(query)
      : { query: query };

    await fetchOpOptions.fetchData(fetchParams, "GET").then((fetchResult) => {
      setOptions(mapToOptions(fetchResult));
    });
  };

  // Interface
  const getOptionLabel = (option: any): any => {
    return (
      option?.label ??
      options.find((o) => isOptionEqualToValue(o, option))?.label ??
      ""
    );
  };

  const isOptionEqualToValue = (option: any, value: any) => {
    return option.value == value.value;
  };

  const handleOnChange = (_event: any, newValue: IAutoCompleteOption | null) => {
    const selValue = newValue?.value ?? null;
    const selOption = options.find((o) => o.value == selValue) ?? null;

    setSelectedValue(newValue);
    onChange(selValue, selOption);
  };

  return {
    options,
    isPending: fetchOpOptions.isPending,
    error: fetchOpOptions.error,
    setQueryValue,
    optionsAreOpen,
    setOptionsAreOpen,
    getOptionLabel,
    isOptionEqualToValue,
    handleOnChange,
    selectedValue,
    minQueryChars,
  };
}