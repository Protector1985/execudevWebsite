
import React from 'react';
import css from './styles/styles.module.css'
import { FaArrowUp } from "react-icons/fa6";

interface PostInterface {
    title: string,
    excerpt: string
    image: string
}

const PostPreview:React.FC<PostInterface> = ({title, excerpt, image}) => {
    
    return (
        <div className={css.wrapper}>
            <img src={image} className={css.featureImage} />
            <div className={css.contentContainer}>
                <h1 className={css.title}>{title}</h1>
                <FaArrowUp className={css.arrow} />
            </div>
            
        </div>
    )
}

export default PostPreview;