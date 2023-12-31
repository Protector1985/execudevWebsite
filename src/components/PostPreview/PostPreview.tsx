import React from "react";
import css from "./styles/styles.module.css";
import { FaArrowUp } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";

interface PostInterface {
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  altText: string;
}

const PostPreview: React.FC<PostInterface> = ({
  slug,
  title,
  altText,
  image,
}) => {
  return (
    <Link className={css.Link} href={`/blog/posts/${slug}`}>
      <div className={css.wrapper}>
        <div className={css.featureImageContainer}>
          <img
            alt={`${altText}-blurred`}
            src={image}
            className={css.featureImageBlur}
          />
          <img alt={`${altText}`} src={image} className={css.featureImage} />
        </div>

        <div className={css.contentContainer}>
          <h1 className={css.title}>{title}</h1>
          <FaArrowUp className={css.arrow} />
        </div>
      </div>
    </Link>
  );
};

export default PostPreview;
