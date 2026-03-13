import type { IHasAsyncStatus } from "../../../lib/interfaces/fetch/types";

import Loader from "./Loader";
import LoadError from "./LoadError";

type AsyncStatusProps = {
  status: IHasAsyncStatus;
  message?: string | null;
  retry?: (() => void) | null;

  /** Will show child elements even if isComplete is false. Useful for saving scenarios. */
  showIfIncomplete?: boolean;

  children?: React.ReactNode;
};

export default function AsyncStatus({
  status,
  message,
  retry,
  showIfIncomplete,
  children,
}: AsyncStatusProps) {
  return (
    <>
      {status.isPending && <Loader message={message} />}
      {!status.isPending && status.error && (
        <LoadError message={status.error} retry={retry} />
      )}

      {!status.isPending &&
        !status.error &&
        (!!showIfIncomplete || status.isComplete) &&
        !!children && <>{children}</>}
    </>
  );
}