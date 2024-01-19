import React, { useEffect, useState } from "react";
import css from "./styles/index.module.css";
import apolloClient from "@/graphql/lib/client";
import { GET_FIRST_10_POSTS } from "@/graphql/queries/posts";
import NavBar from "@/components/Nav/NavBar";
import PostPreview from "@/components/PostPreview/PostPreview";
import useWidth from "@/hooks/useWidth";
import Footer from "@/components/Footer/Footer";
import Head from "next/head";

interface FeaturedImage {
  node: {
    altText: string;
    sourceUrl: string;
  };
}

interface PostNode {
  slug: string;
  featuredImage: FeaturedImage;
  title: string;
  excerpt: string;
}

interface Post {
  __typename: string;
  node: PostNode;
}

interface HomeProps {
  posts: Array<Post>;
}

const Home: React.FC<HomeProps> = ({ posts }) => {
  const width = useWidth();

  const [groupedPosts, setGroupedPosts] = useState<Array<Array<Post>>>([]);

  const breakpoints = {
    sm: 923,
    large: 1400,
    xl: 1401,
  };

  useEffect(() => {
    const groupPosts = () => {
      let groupSize: number;
      if (width !== null) {
        if (width < breakpoints.sm) {
          groupSize = 1; // sm
        } else if (width >= breakpoints.sm && width < breakpoints.xl) {
          groupSize = 2; // large
        } else {
          groupSize = 3; // xl
        }

        const tempGroupedPosts: Array<Array<Post>> = [];
        for (let i = 0; i < posts.length; i += groupSize) {
          tempGroupedPosts.push(posts.slice(i, i + groupSize));
        }

        setGroupedPosts(tempGroupedPosts);
      }
    };

    groupPosts();
  }, [posts, width]);

  const pageTitle = "ExecuDev | Next Level Programming";
  const pageDescription = "Explore cutting-edge AI centered programming tutorials, industry insights, and development tips.";
  const pageImage = "https://execudev-83aeea.ingress-haven.ewp.live/wp-content/uploads/2024/01/DALL·E-2024-01-07-16.29.36-A-16_9-Matrix-styled-image-of-a-CPU-with-the-initials-ED-clearly-visible-on-it.-The-CPU-is-intricately-designed-displaying-detailed-circuitry-and-c.png";
  const pageUrl = "https://www.execudev-inc.com";

  const serverRenderedPosts = posts.map((post) => (
    <PostPreview
      key={post.node.slug}
      slug={post.node.slug}
      altText={post.node.featuredImage.node.altText}
      image={post.node.featuredImage.node.sourceUrl}
      title={post.node.title}
      excerpt={post.node.excerpt}
    />
  ));

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
          <div className={css.posts}>
            {groupedPosts.length === 0 ? serverRenderedPosts : null}
            {groupedPosts.map((row, rowIndex) => (
              <div key={`Row ${rowIndex}`} className={css.postWrapper}>
                {row.map((post) => (
                  <PostPreview
                    key={post.node.slug}
                    slug={post.node.slug}
                    altText={post.node.featuredImage.node.altText}
                    image={post.node.featuredImage.node.sourceUrl}
                    title={post.node.title}
                    excerpt={post.node.excerpt}
                  />
                ))}
              </div>
            ))}
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
};

export default Home;
