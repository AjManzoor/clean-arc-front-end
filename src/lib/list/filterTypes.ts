export interface IFilterOption<ValueT> {
  value: ValueT;
  name: string;
  iconUrl?: string;
}

export function mapToFilterOptions<RawT, ValueT>(
  rawItems: RawT[],
  fnMap: (raw: RawT) => IFilterOption<ValueT>,
  includeAllOption: boolean = true,
  allValue: ValueT,
  allLabel: string = "All"
): IFilterOption<ValueT>[] {

  const filterOptions: IFilterOption<ValueT>[] =
    rawItems?.map(fnMap) ?? [];

  if (includeAllOption === true) {
    filterOptions.unshift({
      value: allValue,
      name: allLabel ?? "All",
    });
  }

  return filterOptions;
}