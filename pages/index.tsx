import React, { useEffect, useState } from "react";
import css from './styles/index.module.css'
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

const Home:React.FC<HomePosts> =({ posts }) => {
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
      if(width !== null)
        if (width < breakpoints.sm) {
          groupSize = 1; // sm
        } else if (width >= breakpoints.sm && width < breakpoints.xl) {
          groupSize = 2; //large
        } else {
          groupSize = 3; // xl
        }

      const tempGroupedPosts = [];
      if(typeof groupSize !== 'undefined')
      for (let i = 0; i < posts.length; i += groupSize) {
        tempGroupedPosts.push(posts.slice(i, i + groupSize));
      }

      setGroupedPosts(tempGroupedPosts);
    };

    groupPosts();
  }, [posts, width]);

  console.log(groupedPosts)
    return (
        <div className={css.wrapper}>
          <div className={css.subWrapper}>
            <NavBar />
            <div className={css.posts}>
            {groupedPosts.map((row:any) => {
              return(
                <div className={css.postWrapper}>
                  {row.map((post:any)=> {
                    return <PostPreview />
                  })}
                </div>
              ) 
            } )}
            
              

              

            </div>
            
            
          </div>
            
        </div>
    );
}

export async function getStaticProps() {
  const data = await apolloClient.query({
    query: GET_FIRST_10_POSTS,
  });

  return {
    props: { posts: data?.data?.posts?.edges },
    revalidate: 10,
  };
}

export default Home