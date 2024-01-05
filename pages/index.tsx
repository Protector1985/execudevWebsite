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

      if(groupSize === 1) {
        return
      } else if(groupSize === 2) {
        return <div className={css.emptyPost}></div>
      } else if (groupSize === 3) {
        return (
          <>
            <div className={css.emptyPost}></div>
            <div className={css.emptyPost}></div>
          </>
        );
      }

      
    } else if (row?.length === 2) {
      
      if(groupSize === 1) {
        return
      } else if(groupSize === 2) {
        return 
      } else if (groupSize === 3) {
        return <div className={css.emptyPost}></div>
      }
    }
  }

  return (
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
          {groupedPosts.map((row: any, index:any) => {
            return (
              <div key={`Row ${index}`} className={css.postWrapper}>
                {row.map((post: any) => {
                  return (
                    <PostPreview
                      key={post?.node?.slug}
                      slug={post?.node?.slug}
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
    </div>
  );
};

export async function getServerSideProps() {
  const data = await apolloClient.query({
    query: GET_FIRST_10_POSTS,
    fetchPolicy: "network-only",
  });

  return {
    props: { posts: data?.data?.posts?.edges },
  };
}

export default Home;
