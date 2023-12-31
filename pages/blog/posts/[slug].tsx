import React, { useEffect, useState } from "react";
import apolloClient from "@/graphql/lib/client";
import { GET_ALL_SLUGS, GET_ONE_POST } from "@/graphql/queries/posts";
import NavBar from "@/components/Nav/NavBar";
import css from "./styles/styles.module.css";
import readingTime from "reading-time";
import moment from "moment";
import useWidth from "@/hooks/useWidth";
import Image from "next/image";

const Post: React.FC<any> = (props: any) => {
  const [stats, setStats] = useState({minutes:0});
  const width = useWidth();
  function createMarkup(htmlContent: string) {
    return { __html: htmlContent };
  }
  

  useEffect(() => {

    if(props.post?.content) {
      const s = readingTime(props?.post?.content);
      setStats(s)
    }

  },[props])
  
  

  return (
    <div className={css.wrapper}>
      <div className={css.subWrapper}>
        {/* <NavBar /> */}
     
      <div className={css.imgContainer}>
      <img alt={"tst"}
            className={css.imageBlur}
            src={props.post.featuredImage.node.sourceUrl}
          />
        <img alt={"tst"}
            className={css.image}
            src={props.post.featuredImage.node.sourceUrl}
          />

      </div>
       

        <div
          style={
            width! > 1100
              ? { flexDirection: "row" }
              : { flexDirection: "column" }
          }
          className={css.headlineContainer}
        >
          <div className={css.headline}>
            <p className={css.mainHeadline}>{props.post.title}</p>
          </div>

          <div
            style={
              width! > 1100
                ? { marginTop: 0, marginLeft: "5%" }
                : { marginTop: "20px" }
            }
            className={css.statsContainer}
          >
            <div className={css.readTime}>
              <p className={css.headlineContainerSubHeadline}>Read Time</p>
              <p className={css.headlineContainerSubData}>{`${Math.floor(
                stats.minutes,
              )} min Read`}</p>
            </div>

            <div className={css.date}>
              <p className={css.headlineContainerSubHeadline}>Date</p>
              <p className={css.headlineContainerSubData}>
                {moment(props.post.date).format("MMM YYYY")}
              </p>
            </div>

            <div className={css.author}>
              <p className={css.headlineContainerSubHeadline}>Author</p>
              <p className={css.headlineContainerSubData}>
                {props.post.author.node.name}
              </p>
            </div>
          </div>
        </div>

        <div
          className={css.content}
          dangerouslySetInnerHTML={createMarkup(props?.post?.content)}
        />
      </div>
    </div>
  );
};

export default Post;

export async function getStaticProps({ params }: any) {
  const { slug } = params;
  console.log("Fetching post with slug:", slug);

  try {
    const { data } = await apolloClient.query({
      query: GET_ONE_POST,
      variables: { slug },
    });

    // If data is fetched successfully, return it as props
    return {
      props: {
        post: data.post, // Make sure you are accessing the correct property from 'data'
      },
      revalidate: 10,
    };
  } catch (err) {
    console.error("Error fetching post:", err);

    // Handle error appropriately, maybe return notFound or an error prop
    return {
      props: {},
      notFound: true, // If there's an error, you might want to show a 404 page
    };
  }
}

export async function getStaticPaths() {
  const data = await apolloClient.query({
    query: GET_ALL_SLUGS,
  });

  const paths = data.data.posts.edges.map(({ node }: any) => {
    return {
      params: { slug: node.slug },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
}
