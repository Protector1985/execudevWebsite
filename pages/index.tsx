import React, { useEffect, useState } from "react";
import css from "./styles/index.module.css";
import apolloClient from "@/graphql/lib/client";
import {
  GET_ALL_SLUGS,
  GET_FIRST_10_POSTS,
  GET_ONE_POST,
} from "@/graphql/queries/posts";
import NavBar from "@/components/Nav/NavBar";
import PostPreview from "@/components/PostPreview/PostPreview";
import useWidth from "@/hooks/useWidth";
import Footer from "@/components/Footer/Footer";
import Head from "next/head";

interface Post {
  __typename: string;
  node: {};
}

interface HomePosts {
  posts: Array<Post>;
}

const Home: React.FC<HomePosts> = ({ posts }) => {
  const width = useWidth();

  // State to store grouped posts
  const [groupedPosts, setGroupedPosts] = useState<any>([]);

  // Breakpoints for responsive design
  const breakpoints = {
    sm: 923,
    large: 1400,
    xl: 1401,
  };

  useEffect(() => {
    const groupPosts = () => {
      let groupSize;
      if (width !== null)
        if (width < breakpoints.sm) {
          groupSize = 1; // sm
        } else if (width >= breakpoints.sm && width < breakpoints.xl) {
          groupSize = 2; //large
        } else {
          groupSize = 3; // xl
        }

      const tempGroupedPosts = [];
      if (typeof groupSize !== "undefined")
        for (let i = 0; i < posts?.length; i += groupSize) {
          tempGroupedPosts.push(posts.slice(i, i + groupSize));
        }

      setGroupedPosts(tempGroupedPosts);
    };

    groupPosts();
  }, [posts, width]);

  function addEmptyPost(row: Array<any>) {
    let groupSize;

    if (width !== null)
      if (width < breakpoints.sm) {
        groupSize = 1; // sm
      } else if (width >= breakpoints.sm && width < breakpoints.xl) {
        groupSize = 2; //large
      } else {
        groupSize = 3; // xl
      }

    if (row?.length === 1) {
      if (groupSize === 1) {
        return;
      } else if (groupSize === 2) {
        return <div className={css.emptyPost}></div>;
      } else if (groupSize === 3) {
        return (
          <>
            <div className={css.emptyPost}></div>
            <div className={css.emptyPost}></div>
          </>
        );
      }
    } else if (row?.length === 2) {
      if (groupSize === 1) {
        return;
      } else if (groupSize === 2) {
        return;
      } else if (groupSize === 3) {
        return <div className={css.emptyPost}></div>;
      }
    }
  }

  const pageTitle = "ExecuDev | Next Level Programming";
  const pageDescription =
    "Explore cutting-edge AI centered programming tutorials, industry insights, and development tips.";
  const pageImage =
    "https://execudev-83aeea.ingress-haven.ewp.live/wp-content/uploads/2024/01/DALL·E-2024-01-07-16.29.36-A-16_9-Matrix-styled-image-of-a-CPU-with-the-initials-ED-clearly-visible-on-it.-The-CPU-is-intricately-designed-displaying-detailed-circuitry-and-c.png"; // URL to an image representing the content
  const pageUrl = "https://www.execudev-inc.com"; // The current page's URL

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className={css.wrapper}>
        <div className={css.subWrapper}>
          {/* <NavBar /> */}

          {/* <div className={css.headBanner}>
        
              <div className={css.imageSub}>
                <img className={css.image} src={'./head3.png'} />
                <img className={css.imageBlur} src={'./head3.png'} />
              </div>
              
        </div> */}

          <div className={css.posts}>
            {groupedPosts.map((row: any, index: any) => {
              return (
                <div key={`Row ${index}`} className={css.postWrapper}>
                  {row.map((post: any) => {
                    return (
                      <PostPreview
                        key={post?.node?.slug}
                        slug={post?.node?.slug}
                        altText={post?.node?.featuredImage?.node?.altText}
                        image={post?.node?.featuredImage?.node?.sourceUrl}
                        title={post?.node?.title}
                        excerpt={post?.node?.excerpt}
                      />
                    );
                  })}
                  {addEmptyPost(row)}
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const data = await apolloClient.query({
    query: GET_FIRST_10_POSTS,
    fetchPolicy: "no-cache",
  });

  return {
    props: { posts: data?.data?.posts?.edges },
  };
}

export default Home;
