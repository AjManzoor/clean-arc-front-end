import { CircularProgress } from "@mui/material";

import loadingStyles from "../../css/loadingError.module.css"


type LoaderProps = {
  message?: string | null;
};

export default function Loader({ message }: LoaderProps) {
  return (
    <div className={loadingStyles.loader}>
      <span className={loadingStyles.loader_icon}>
        <CircularProgress title={message ?? "Loading..."} />
      </span>

      <span className={loadingStyles.loader_message}>
        {!!message && message}
      </span>
    </div>
  );
}