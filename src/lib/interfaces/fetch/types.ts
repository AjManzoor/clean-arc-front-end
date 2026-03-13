
export interface IHasAsyncStatus {
  isComplete: boolean;
  isPending: boolean;
  error: string | null;
}