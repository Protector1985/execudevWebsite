import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import css from "./styles/styles.module.css";
import Script from "next/script";

interface BreadcrumbProps {
  slug: string;
  path: string;
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({ slug, path }) => {
  const formattedSlugForURL = slug.toLowerCase().replace(/\s+/g, "-");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.execudev-inc.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: slug,
        item: `https://www.execudev-inc.com/blog/posts/${formattedSlugForURL}`,
      },
    ],
  };

  return (
    <>
      <Script id="breadcrumbs" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <nav className={css.wrapper}>
        <Link className={css.link} href="https://www.execudev-inc.com">
          <span>Home</span>
        </Link>
        <p>{`>`}</p>
        <span className={css.target}>{slug}</span>
      </nav>
    </>
  );
};

export default Breadcrumbs;
