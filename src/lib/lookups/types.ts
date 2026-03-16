export const LookupType = {
  Genre: 100,
} as const;

export type LookupTypeValue = typeof LookupType[keyof typeof LookupType];

export type LookupValue = {
  id: string;
  name: string;
  data?: any | null;
};

export type LookupValues = {
  type: LookupTypeValue;
  values: LookupValue[];
};

export interface IDropdownOption{
    id: any;
    name : string;
    data? : any | null
}

export interface IAutoCompleteOption{
    value : string,
    label : string,
    rawValue? : any
}