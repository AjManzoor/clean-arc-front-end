import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { IHasAsyncStatus } from "../interfaces/fetch/types";
import {
    apiReplaceUrlInlineParams,
    appendQueryParamsToUrl,
    type FetchMethod
} from "../http/httpHelper";
import { addOrOverwriteObjectForRouterValues } from "../utils/dataModifiers";
import type { fetchProp } from "../interfaces/fetch/fetchProps";

export interface IFetchOperation<ResultT> extends IHasAsyncStatus {
    data: ResultT | null;
    eTag: string | null;
    isPending: boolean;
    error: string | null;
    setData: (result: ResultT, etTag?: string | null) => void;
    retry: () => Promise<any>;
}

export const useFetch = <ResultT>(
    url: string,
    requestData: any,
    urlProps?: fetchProp[],
    method: FetchMethod = "GET"
): IFetchOperation<ResultT> => {
    const [data, setData] = useState<ResultT | null>(null);
    const [eTag, setETag] = useState<string | null>(null);

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();

    const fetchData = async (): Promise<any> => {
        setETag(null);
        setIsPending(true);
        setError(null);

        let errorDetail: any | null = null;

        try {
            const requestArgs: RequestInit = {
                cache: "no-store",
                headers: { "Content-Type": "application/json" },
                method
            };

            const replacedUrl = apiReplaceUrlInlineParams(url, requestData);
            let urlWithParams = replacedUrl.url;

            if (["GET", "DELETE"].indexOf(method) >= 0) {
                urlWithParams = appendQueryParamsToUrl(
                    urlWithParams,
                    replacedUrl.remainingParams
                );
            }

            if (["POST", "PUT", "PATCH"].indexOf(method) >= 0) {
                requestArgs.body = JSON.stringify(replacedUrl.remainingParams);
            }

            const response = await fetch(urlWithParams, requestArgs);

            if (!response.ok) {
                try {
                    errorDetail = await response.json();
                } catch {
                    // Best effort
                }

                setETag(null);
                setData(null);
                setError(`Could not Fetch Data - ${response.statusText}`);
                setIsPending(false);

                return Promise.reject(errorDetail);
            }

            const json = response.status === 204 ? null : await response.json();
            const eTagValue = response.headers.get("Etag");

            setETag(eTagValue);
            setData(json);
            setError(null);
            setIsPending(false);

            return json;
        } catch (e: any) {
            return Promise.reject(e);
        }
    };

    const getParamsAndFetch = async () => {
        if (urlProps) {
            requestData = addOrOverwriteObjectForRouterValues(
                requestData,
                urlProps,
                params
            );
        }

        await fetchData().catch((e) => {
            const message = e instanceof Error ? e.message : e.toString();

            setETag(null);
            setData(null);
            setError(`Could not Fetch Data - ${message}`);
            setIsPending(false);
        });
    };

    useEffect(() => {
        (async () => {
            await getParamsAndFetch();
        })();
    }, [url]);

    const setDataAndEtag = (data: ResultT, eTag?: string | null) => {
        setETag(eTag ?? null);
        setData(data);
    };

    return {
        data,
        eTag,
        isComplete: !!data,
        isPending,
        error,
        setData: setDataAndEtag,
        retry: getParamsAndFetch
    };
};