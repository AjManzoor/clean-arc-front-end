import { useId } from "react";

export interface IFormScopedId {
    id: string;
    getFieldId: (localName: string, index?: number | null) => string;
    getFieldName: (localName: string, index?: number | null) => string;
    scopeName: string;
}

export const useFormScopedId = (scopeName: string): IFormScopedId => {

    const id = useId();

    const getFieldId = (
        localName: string,
        index?: number | null
    ): string => {
        return [
            id,
            scopeName,
            localName,
            index?.toString()
        ]
            .filter(i => i != null)
            .join("-");
    };

    const getFieldName = (
        localName: string,
        index?: number | null
    ): string => {
        return [
            scopeName,
            localName,
            index?.toString()
        ]
            .filter(i => i != null)
            .join("-");
    };

    return {
        id,
        getFieldId,
        getFieldName,
        scopeName
    };
};