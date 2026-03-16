import dataConstants from "../../shared/generic/constants/dataconstants";
import type { IdWithName } from "../interfaces/IdWithName";
import type { IFilterOption } from "../list/filterTypes";
import type {
  IDropdownOption,
  LookupTypeValue,
  LookupValue,
  LookupValues,
} from "./types";

export default class lookupUtils {

  public static getValuesForType = (
    values: LookupValues[],
    type: LookupTypeValue,
    predicate?: (value: LookupValue) => boolean
  ): LookupValue[] => {

    let filteredValues =
      values.filter(lv => lv.type == type)[0]?.values ?? [];

    if (predicate) {
      filteredValues = filteredValues.filter(predicate);
    }

    return filteredValues;
  };

  public static getValuesForTypeAsDropdownOptions = (
    values: LookupValues[],
    type: LookupTypeValue,
    predicate?: (value: LookupValue) => boolean
  ): IDropdownOption[] => {

    return lookupUtils
      .getValuesForType(values, type, predicate)
      .map(v => ({
        id: v.id,
        name: v.name,
        data: v
      }));
  };

  public static getValuesForTypeAsDropdownOptionsWithDefault = (
    values: LookupValues[],
    type: LookupTypeValue,
    defaultName: string,
    predicate?: (value: LookupValue) => boolean
  ): IDropdownOption[] => {

    const options =
      lookupUtils.getValuesForTypeAsDropdownOptions(values, type, predicate);

    options.unshift({
      id: dataConstants.defaultGuid,
      name: defaultName,
      data: null
    });

    return options;
  };

  public static getValuesForTypeAsFilterOptions = (
    values: LookupValues[],
    type: LookupTypeValue,
    predicate?: (value: LookupValue) => boolean
  ): IFilterOption<any>[] => {

    return lookupUtils
      .getValuesForType(values, type, predicate)
      .map(v => ({
        value: v.id,
        name: v.name,
        data: v
      }));
  };

  public static getDescriptionForValue = (
    lookups: LookupValues[],
    type: LookupTypeValue,
    value: any[] | any | null,
    def: string = ""
  ): string => {

    if (value == null) {
      return def;
    }

    const values = Array.isArray(value) ? value : [value];

    const options =
      lookupUtils.getValuesForTypeAsDropdownOptions(lookups, type);

    const foundValues =
      options.filter(o => values.indexOf(o.id) >= 0);

    return foundValues.length > 0
      ? foundValues.map(o => o.name).join(", ")
      : def;
  };

  public static getValuesForIdNameItemDropdownWithDefault = (
    values: IdWithName[],
    defaultName: string
  ): IDropdownOption[] => {

    const options: IDropdownOption[] =
      values.map(v => ({
        id: v.id,
        name: v.name,
        data: v
      }));

    options.unshift({
      id: dataConstants.defaultGuid,
      name: defaultName,
      data: null
    });

    return options;
  };

  public static getValuesForIdNameItem = (
    values: IdWithName[]
  ): IDropdownOption[] =>
    values.map(v => ({
      id: v.id,
      name: v.name,
      data: v
    }));

  public static modifyIdNameItemCollectionFromSelectedIds = (
    values: IdWithName[],
    selectedValues: any[]
  ): IdWithName[] => {

    return values.filter(v => selectedValues.indexOf(v.id) < 0);
  };
}