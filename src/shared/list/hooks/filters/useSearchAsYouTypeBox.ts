import { useEffect, useState } from "react";
import { useDebouncedState } from "../../../../lib/hooks/useDebouncedState";
import { MIN_SEARCHBOX_QUERY_LENGTH } from "../../../../lib/list/searchType";

export interface SearchAsYouTypeBoxProps {
  id?: string;
  onSearch?: (query: string) => void;
  initialQuery?: string;
  label?: string;
  debounceWindowMs?: number;
  minQueryLength?: number;
  disabled?: boolean;
  className?: string;
}

export function useSearchAsYouTypeBox(props: SearchAsYouTypeBoxProps) {
  const minQueryLength =
    !!props.minQueryLength &&
    props.minQueryLength >= MIN_SEARCHBOX_QUERY_LENGTH
      ? props.minQueryLength
      : MIN_SEARCHBOX_QUERY_LENGTH;

  const debounceMs = props.debounceWindowMs ?? 500; // Default

  // Interface
  const [internalQueryValue, setInternalQueryValue] = useState(
    props.initialQuery ?? ""
  );
  const [queryValue, setQueryValue] = useState(props.initialQuery ?? "");

  const getLabel = (): string => {
    return props.label ?? "Search";
  };

  const getPlaceholder = (): string => {
    return !!minQueryLength
      ? `Enter ${minQueryLength} or more characters to search...`
      : "Search...";
  };

  const handleQueryValueChange = (queryValue: string) => {
    setInternalQueryValue(queryValue);
  };

  const clear = () => {
    setQueryValue("");
    setInternalQueryValue("");
  };

  // Internals
  const doSearch = (query: string) => {
    if (props.onSearch) {
      if (!!query && query.length >= minQueryLength) {
        props.onSearch(query);
      } else if (!query || query.length == 0) {
        props.onSearch("");
      }
    }
  };

  const debouncedInternalQueryValue = useDebouncedState(
    internalQueryValue,
    debounceMs
  );

  useEffect(() => {
    setQueryValue(internalQueryValue);
    doSearch(internalQueryValue);
  }, [debouncedInternalQueryValue]);

  useEffect(() => {
    setInternalQueryValue(props.initialQuery ?? "");
    setQueryValue(props.initialQuery ?? "");
  }, [props.initialQuery]);

  return {
    queryValue,
    internalQueryValue,
    handleQueryValueChange,
    getLabel,
    getPlaceholder,
    clear,
  };
}