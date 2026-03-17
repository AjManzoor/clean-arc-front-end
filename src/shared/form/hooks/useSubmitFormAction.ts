import { useEffect, useRef, useState } from "react";
import moment from "moment";

import type { IFormSaveState, IFormSaveStateMutator } from "../../../lib/interfaces/form/formSaveState";
;
import { isDomEventOrNode, isJsonSerializable } from "../../../lib/utils/objUtils";
import { apiReplaceUrlInlineParams, deleteData, postData, putData, type IFetchResponse } from "../../../lib/http/httpHelper";
import type { IApiErrorResponse } from "../../../lib/interfaces/error/apiError";
import { FormSubmitAction, type ISubmitAction } from "../../../lib/interfaces/action/types";

export const useSubmitFormAction = <ParamsT, ResultT>(
    urlEndpoint: string,
    action: FormSubmitAction,
    getRequestData: () => any,
    onComplete?: ((result: IFetchResponse<ResultT>) => void) | null,
    saveState?: IFormSaveStateMutator | null
): ISubmitAction<ParamsT, ResultT> => {
    // State
    const [isPending, setIsPending] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorDetails, setErrorDetails] = useState<IApiErrorResponse | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [params, setParams] = useState<ParamsT>();
    const [result, setResult] = useState<IFetchResponse<ResultT> | null>(null);
    const [onCompleteStart, setOnCompleteStart] = useState<
        (result?: IFetchResponse<ResultT> | null) => void
    >();
    const [delayPostSubmit, setDelayPostSubmit] = useState<boolean>(true);
    const [eTag, setETag] = useState<string | null>(null);

    const request = useRef<Promise<IFetchResponse<ResultT>> | null>(null);

    // Interface
    const submit = (overrideRequestData?: any): Promise<IFetchResponse<ResultT>> => {
        if (!!request.current) {
            return request.current;
        }

        setHasError(false);
        setErrorDetails(null);
        setIsPending(true);
        setIsActive(true);
        setIsSubmitted(false);

        // If off-line no need to send request, early return with error
        if (!navigator.onLine) {
            setIsPending(false);
            setHasError(true);

            const errorDetail = {
                status: -1,
                message: "Network Request Error",
                errorDetails: [
                    {
                        propertyName: "",
                        errorMessage:
                            "Looks like we ran into a problem. Please check if you have a network connection and try again"
                    }
                ],
                isConcurrencyError: false
            };

            setErrorDetails(errorDetail);

            request.current = null;

            return Promise.reject(errorDetail);
        }

        var requestData =
            overrideRequestData &&
            !isDomEventOrNode(overrideRequestData) &&
            isJsonSerializable(overrideRequestData)
                ? overrideRequestData
                : getRequestData();

        var replacedUrl = apiReplaceUrlInlineParams(urlEndpoint, requestData);

        var requestPromise: Promise<IFetchResponse<ResultT>>;

        if (action == FormSubmitAction.Create) {
            requestPromise = postData<ResultT>(
                replacedUrl.url,
                replacedUrl.remainingParams,
                eTag
            );
        } else if (action == FormSubmitAction.Update) {
            requestPromise = putData<ResultT>(
                replacedUrl.url,
                replacedUrl.remainingParams,
                eTag
            );
        } else {
            requestPromise = deleteData<any>(
                replacedUrl.url,
                replacedUrl.remainingParams,
                eTag
            );
        }

        requestPromise
            .then(res => {
                setIsPending(false);

                // Attaches any errors e.g backend validation
                if (!!res.error) {
                    setHasError(true);
                    setErrorDetails(res.error);
                    request.current = null;
                    return res;
                }

                // Success
                setETag(res.eTag ?? null);

                request.current = null;

                complete(res);

                return res;
            })
            .catch(err => {
                setIsPending(false);
                setHasError(true);

                const error = {
                    status: -1,
                    message: err?.message?.toString(),
                    isConcurrencyError: false
                };

                setErrorDetails(error);

                request.current = null;

                return { error: error };
            });

        request.current = requestPromise;

        return requestPromise;
    };

    const start = (
        params: ParamsT,
        onComplete?: (result?: IFetchResponse<ResultT> | null) => void
    ) => {
        setResult(null);
        setIsActive(true);
        setHasError(false);
        setErrorDetails(null);
        setIsPending(false);
        setIsSubmitted(false);
        setParams(params);
        setOnCompleteStart(() => onComplete);
    };

    const complete = (result: IFetchResponse<ResultT>) => {
        setResult(result);
        setHasError(false);
        setErrorDetails(null);
        setIsPending(false);
        setIsSubmitted(true);

        if (!!saveState?.state) {
            saveState.setSaved();
        }

        if (!!onComplete) {
            onComplete(result);
        }

        if (!!onCompleteStart) {
            onCompleteStart(result);
        }

        setOnCompleteStart(undefined);
    };

    const cancel = () => {
        setResult(null);
        setIsActive(false);
        setHasError(false);
        setErrorDetails(null);
        setIsPending(false);
        setIsSubmitted(false);
        setOnCompleteStart(undefined);
    };

    // Events
    useEffect(() => {
        if (isSubmitted == true) {
            setTimeout(() => setIsActive(false), delayPostSubmit ? 2000 : 0); // Optional short delay, and then set inactive
        }
    }, [isSubmitted]);

    // Interface
    return {
        start,
        submit,
        cancel,
        complete,
        isPending,
        hasError,
        errorDetails,
        isActive,
        setIsSubmitted,
        isSubmitted,
        params,
        result,
        setDelayPostSubmit,
        eTag,
        setETag
    };
};