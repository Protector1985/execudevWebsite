"use client";
import React from "react";
import css from "./styles/styles.module.css";
import { FaArrowUp } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import imageStringParser from "./utilities/imageStringParser";

interface CategoryInterface {
  title: string;
  image: string;
  slug: string;
}

const CategoryCard: React.FC<CategoryInterface> = ({ slug, title, image }) => {
  return (
    <Link className={css.Link} href={`/${slug}`}>
      <div className={css.wrapper}>
        <div className={css.featureImageContainer}>
          <img
            alt={`${imageStringParser(image)?.altText}-blurred`}
            src={imageStringParser(image)?.src}
            className={css.featureImageBlur}
          />
          <img
            alt={`${imageStringParser(image)?.altText}`}
            src={imageStringParser(image)?.src}
            className={css.featureImage}
          />
        </div>

        <div className={css.contentContainer}>
          <h1 className={css.title}>{title}</h1>
          <FaArrowUp className={css.arrow} />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
