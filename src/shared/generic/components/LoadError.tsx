import { Button } from "@mui/material";

import DivSpacer from "./DivSpacer";
import loadingStyles from "../../css/loadingError.module.css";

type LoadErrorProps = {
  message: string;
  retry?: (() => void) | null;
};

export default function LoadError({ message, retry }: LoadErrorProps) {
  return (
    <div className={loadingStyles.loader}>
      <div className={loadingStyles.loader_icon}>
      <div className={loadingStyles.loader_icon}>⚠️</div>      
  </div>

      <DivSpacer customHeight={5} />

      <div className={loadingStyles.loader_message}>{message}</div>

      <DivSpacer customHeight={15} />

      {!!retry && (
        <span className={loadingStyles.loader_action}>
          <Button onClick={retry}>Retry</Button>
        </span>
      )}
    </div>
  );
}