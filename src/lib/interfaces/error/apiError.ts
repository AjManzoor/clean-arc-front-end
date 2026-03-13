export interface IApiErrorResponse {
  status: number;
  message: string;
  errorDetails?: ApiErrorItem[] | null;
  isConcurrencyError: boolean;
  currentState?: any | null;
}

export interface ApiErrorItem {
  propertyName: string;
  errorMessage: string;
}