import { useState } from "react";
import type {Dispatch, SetStateAction }  from "react";

import {apiReplaceUrlInlineParams, appendQueryParamsToUrl} from "../http/httpHelper";

import type {FetchMethod} from "../http/httpHelper";
import type { IHasAsyncStatus } from "../interfaces/fetch/types";


export interface IFetchExplicitOperation<ResultT> extends IHasAsyncStatus {
  data: ResultT | null;
  setData: Dispatch<SetStateAction<ResultT | null>>;
  eTag: string | null;
  setETag: (value: string | null) => void;
  isPending: boolean;
  error: string | null;
  fetchData: (
    requestData: any,
    method: FetchMethod,
    eTag?: string | null
  ) => Promise<ResultT>;
  clearData: () => void;
}

export const useFetchExplicit = <ResultT>(
  url: string
): IFetchExplicitOperation<ResultT> => {
  const [data, setData] = useState<ResultT | null>(null);
  const [eTag, setETag] = useState<string | null>(null);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    requestData: any,
    method: FetchMethod = "GET",
    eTag?: string | null
  ): Promise<ResultT> => {
    setIsPending(true);
    setError(null);

    let errorDetail: any | null = null;

    try {
      const requestArgs: RequestInit = {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "If-Match": eTag ?? "",
        },
        method: method,
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
      const eTagValue = response.headers.get("ETag");

      setETag(eTagValue);
      setData(json);
      setError(null);
      setIsPending(false);

      return json;
    } catch (e: any) {
      const message = e instanceof Error ? e.message : e?.toString();

      setETag(null);
      setData(null);
      setError(`Could not Fetch Data - ${message}`);
      setIsPending(false);

      return Promise.reject(e);
    }
  };

  const clearData = () => {
    setData(null);
    setError(null);
    setIsPending(false);
  };

  return {
    data,
    eTag,
    isPending,
    error,
    fetchData,
    clearData,
    setETag,
    setData,
    isComplete: !!data,
  };
};