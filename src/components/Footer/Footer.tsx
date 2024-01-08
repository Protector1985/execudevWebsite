import React from "react";
import css from "./styles/styles.module.css";

const Footer: React.FC = () => {
  return (
    <div className={css.wrapper}>
      <h5 className={css.copyrightStatement}>
        Copyright © 2024, ExecuDev-Inc. All Rights Reserved.
      </h5>
    </div>
  );
};

export default Footer;
