import React from "react";
import css from "./styles/styles.module.css";
import { FaArrowUp } from "react-icons/fa6";
import Link from "next/link";

interface PostInterface {
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

const PostPreview: React.FC<PostInterface> = ({
  slug,
  title,
  excerpt,
  image,
}) => {
  return (
    <Link className={css.Link} href={`/blog/posts/${slug}`}>
      <div className={css.wrapper}>
        <img src={image} className={css.featureImage} />
        <div className={css.contentContainer}>
          <h1 className={css.title}>{title}</h1>
          <FaArrowUp className={css.arrow} />
        </div>
      </div>
    </Link>
  );
};

export default PostPreview;
