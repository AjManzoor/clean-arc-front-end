import type { IApiErrorResponse } from "../interfaces/error/apiError";


export type FetchMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface IFetchResponse<ResultT> {
  result?: ResultT | null;
  error?: IApiErrorResponse | null;
  eTag?: string | null;
}

export const getData = async <ResultT>(
  url: string
): Promise<IFetchResponse<ResultT>> => {
  const response = await fetch(url, { cache: "no-store" });

  return await handleResponse<ResultT>(response);
};

export const postData = async <ResultT>(
  url: string,
  data: any,
  eTag?: string | null
): Promise<IFetchResponse<ResultT>> => {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "If-Match": eTag ?? "",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<any>(response);
  } catch (e: any) {
    return {
      result: null,
      error: {
        status: -1,
        message: e?.message ?? e.toString(),
        isConcurrencyError: false,
      },
    };
  }
};

export const putData = async <ResultT>(
  url: string,
  data: any,
  eTag?: string | null
): Promise<IFetchResponse<ResultT>> => {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "If-Match": eTag ?? "",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<any>(response);
  } catch (e: any) {
    return {
      result: null,
      error: {
        status: -1,
        message: e?.message ?? e.toString(),
        isConcurrencyError: false,
      },
    };
  }
};

export const deleteData = async <ResultT>(
  url: string,
  data: any,
  eTag?: string | null
): Promise<IFetchResponse<ResultT>> => {
  try {
    url = appendQueryParamsToUrl(url, data);

    const response = await fetch(url, {
      cache: "no-store",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "If-Match": eTag ?? "",
      },
    });

    return await handleResponse<any>(response);
  } catch (e: any) {
    return {
      result: null,
      error: {
        status: -1,
        message: e?.message ?? e.toString(),
        isConcurrencyError: false,
      },
    };
  }
};

const handleResponse = async <ResultT>(
  response: Response
): Promise<IFetchResponse<ResultT>> => {
  const eTag = response.headers.get("ETag") ?? null;

  if (!response.ok) {
    const errorDetail = extractApiErrorResponse(
      response.status,
      await response.text(),
      response.statusText
    );

    return {
      result: null,
      error: errorDetail,
      eTag,
    };
  }

  if (response.status === 204) {
    return { result: null, eTag };
  }

  return {
    result: (await response.json()) as ResultT,
    eTag,
  };
};

function extractApiErrorResponse(
  status: number,
  res: any,
  defaultErrorMessage: string
): IApiErrorResponse {
  const resObj = typeof res === "string" ? JSON.parse(res) : res;

  const errorDetail: IApiErrorResponse = {
    status: status,
    message:
      resObj?.message?.toString() ??
      (!!resObj?.errors ? Object.values(resObj.errors)[0] : null) ??
      defaultErrorMessage,
    errorDetails: resObj?.errorDetails ?? null,
    isConcurrencyError: resObj.status == 412,
    currentState: resObj?.currentState ?? null,
  };

  return errorDetail;
}

export function appendQueryParamsToUrl(url: string, params: any): string {
  if (isEmptyObject(params) == true) {
    return url;
  }

  const searchParams = buildURLSearchParams(params);
  return url + (url.indexOf("?") > 0 ? "&" : "?") + searchParams.toString();
}

export function apiReplaceUrlInlineParams(
  url: string,
  params: any
): { url: string; remainingParams: string[] } {
  const paramsCopy = { ...params };

  Object.entries(paramsCopy).forEach(([key, value]) => {
    if (
      !isValueNullOrUndefined(value) &&
      !Array.isArray(value) &&
      url.indexOf(`[${key}]`) >= 0
    ) {
      url = url.replace(`[${key}]`, encodeURIComponent((value as any).toString()));
      delete paramsCopy[key];
    }
  });

  return { url, remainingParams: paramsCopy };
}

function isEmptyObject(obj: any) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true;
}

function isValueNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

function buildURLSearchParams(params: any): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (isValueNullOrUndefined(value)) {
      // No-op, skip
    } else if (Array.isArray(value)) {
      value
        .filter((av) => !isValueNullOrUndefined(av))
        .forEach((av) => searchParams.append(key, av.toString()));
    } else {
      searchParams.append(key, (value as any).toString());
    }
  });

  return searchParams;
}