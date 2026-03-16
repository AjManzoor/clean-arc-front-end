import type { IAutoCompleteOption } from "../../../lib/lookups/types";

export type AutoCompleteRenderOptionCallback = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: IAutoCompleteOption
) => React.ReactNode;

export type AutoCompleteResultItemRenderCallback = (
  labelId: string,
  option: IAutoCompleteOption
) => React.ReactNode;

export type AutoCompleteMapApiToOptionCallback = (
  endpointData: any
) => IAutoCompleteOption[];

export type ApiAutoCompleteCommonOptions = {
  placeholder: string;
  queryEndpoint: string;
  mapToOptions: AutoCompleteMapApiToOptionCallback;
  getFetchParams?: (query: string) => any;
  debounceWindowMs?: number;
  noOptionsText?: React.ReactNode;
  renderOption?: AutoCompleteRenderOptionCallback;
};