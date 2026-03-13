import {type  CSSProperties } from "react";

import styles from "../../layout/css/layout.module.css";

type DivSpacerProps = {
  customHeight?: string | number | null;
};

export default function DivSpacer({ customHeight }: DivSpacerProps) {
  const cssProps: CSSProperties = {};

  if (customHeight != null) {
    cssProps.height = customHeight;
  }

  return (
    <div
      className={styles.horizontal_spacer}
      style={cssProps}
    />
  );
}