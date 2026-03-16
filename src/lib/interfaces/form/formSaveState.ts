import moment from "moment";
import type { Dispatch, SetStateAction } from "react";

export interface IFormSaveState {
    modified: boolean;
    savedDateTime?: moment.Moment;
    skipChangeCheckOnClose: boolean;
}

export interface IFormSaveStateMutator {
    state: IFormSaveState;
    setModified: () => void;
    setSaved: () => void;
    setSavedSkipChangeCheckOnClose: (value: boolean) => void;
    getStateSetter: <S>(
        setter: Dispatch<SetStateAction<S>>
    ) => (value: S) => void;
}