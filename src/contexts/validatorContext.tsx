import { createContext } from "react";
import { useValidator, ValidateOnChangeBehaviour } from "../shared/validation/hooks/useValidator";
import type { IValidator } from "../shared/validation/interfaces/IValidation";

export interface ValidatorContextProps extends IValidator {
    id?: string;
}

export const ValidatorContext = createContext<ValidatorContextProps | undefined>(undefined);

export interface ValidatorContextProviderProps {
    children: React.ReactNode;
    changeBehaviour?: ValidateOnChangeBehaviour;
    id?: string;
}

export function ValidatorContextProvider({
    children,
    changeBehaviour = ValidateOnChangeBehaviour.OnlyAfterFirstValidate,
    id
}: ValidatorContextProviderProps) {
    const validator = useValidator(changeBehaviour);

    const contextValue: ValidatorContextProps = {
        ...validator,
        id
    };

    return (
        <ValidatorContext.Provider value={contextValue}>
            {children}
        </ValidatorContext.Provider>
    );
}