import { useState } from "react";
import moment, { type Moment } from "moment";
import type { IFilterOption } from "../../../../lib/list/filterTypes";


export function useListFilterOptions<ItemT>(defaultOptionName?: string) {
    const [filterOptions, setFilterOptionsInternal] = useState<
        IFilterOption<ItemT>[]
    >([]);

    const [selectedValues, setSelectedValuesInternal] = useState<ItemT[]>([]);
    const [selectedValue, setSelectedValueInternal] = useState<ItemT | null>(null);
    const [userLastChanged, setUserLastChanged] = useState<Moment | null>(null);

    const setFilterOptions = (
        values: IFilterOption<ItemT>[],
        selectAllIfNoneSelected: boolean
    ) => {
        if (!!defaultOptionName) {
            values = [{ name: defaultOptionName, value: null! }, ...values];
        }

        setFilterOptionsInternal(values);

        if (selectAllIfNoneSelected === true && selectedValues.length == 0) {
            const selValues = values.map(fo => fo.value);
            setSelectedValuesInternal(selValues);
            setSelectedValueInternal(selValues[0] ?? null);
        } else {
            setSelectedValuesInternal([...selectedValues]);
            setSelectedValueInternal(selectedValues[0] ?? null);
        }
    };

    const getNames = (values: ItemT[]): string[] => {
        const options = filterOptions.filter(
            fo => values.indexOf(fo.value) >= 0
        );

        return options.map(fo => fo.name);
    };

    const getName = (value: ItemT): string => {
        const option = filterOptions.filter(fo => fo.value == value)[0] ?? null;
        return option?.name ?? "";
    };

    const setSelectedValues = (values: ItemT[] | null) => {
        const selValues = (values ?? []).filter(v => v != null) ?? [];

        setSelectedValuesInternal(selValues);
        setSelectedValueInternal(selValues[0] ?? null);
        setUserLastChanged(moment().utc());
    };

    const setSelectedValue = (value: ItemT | null) => {
        if (!!value && value != null) {
            setSelectedValuesInternal([value]);
            setSelectedValueInternal(value);
        } else {
            setSelectedValuesInternal([]);
            setSelectedValueInternal(null);
        }

        setUserLastChanged(moment().utc());
    };

    return {
        filterOptions,
        setFilterOptions,
        hasOptions: filterOptions.length > 0,
        selectedValues,
        setSelectedValues,
        selectedValue,
        setSelectedValue,
        userLastChanged,
        defaultOptionName,
        getNames,
        getName
    };
}