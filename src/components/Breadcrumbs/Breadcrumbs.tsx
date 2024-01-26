import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import css from "./styles/styles.module.css";

const Breadcrumbs = () => {
  const router = useRouter();
  const pathSegments = router.asPath
    .split("/")
    .filter((segment) => segment && segment !== "post" && segment !== "blog");

  // Function to format the breadcrumb text
  const formatBreadcrumb = (segment: any) => {
    return segment
      .replace(/-/g, " ")
      .replace(/^\w/, (c: any) => c.toUpperCase());
  };

  return (
    <nav className={css.wrapper}>
      <Link className={css.linkel} href="/" passHref>
        <span className={css.link}>Home</span>
      </Link>
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <span className={css.separator}>{" > "}</span>
          {index === pathSegments.length - 1 ? (
            <span className={css.target}>{formatBreadcrumb(segment)}</span>
          ) : (
            <Link
              href={"/" + pathSegments.slice(0, index + 1).join("/")}
              passHref
            >
              <span className={css.link}>{formatBreadcrumb(segment)}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
