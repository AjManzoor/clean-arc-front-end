import type { Moment } from "moment";

import type { IFetchResponse } from "../../http/httpHelper";
import type { IApiErrorResponse } from "../error/apiError";

export interface IActionForProvider<ParamsT, ResultT> {
    isActive: boolean;
    params?: ParamsT;
    complete: (result: ResultT) => void;
    cancel: () => void;
}

export interface IActionForOwner<ParamsT, ResultT> {
    start: (params: ParamsT, onComplete?: (result?: ResultT | null) => void) => void;
    result?: ResultT | null;
}

export interface ISubmitAction<ParamsT, ResultT>
    extends IActionForProvider<ParamsT, IFetchResponse<ResultT>>,
        IActionForOwner<ParamsT, IFetchResponse<ResultT>> {
    submit: (overrideRequestData?: any) => Promise<IFetchResponse<ResultT>>;
    isPending: boolean;
    hasError: boolean;
    errorDetails: IApiErrorResponse | null;
    setIsSubmitted: (value: boolean) => void;
    isSubmitted: boolean;
    setDelayPostSubmit: (value: boolean) => void;
    eTag: string | null;
    setETag: (value: string | null) => void;
}

export const FormSubmitAction = {
    Create: 0,
    Update: 1,
    Delete: 2
} as const;

export type FormSubmitAction =
    (typeof FormSubmitAction)[keyof typeof FormSubmitAction];
    
export interface IComponentAction<ParamsT> {
    params: ParamsT | null;
    lastCalled: Moment | null;
    run: (params: ParamsT) => void;
}