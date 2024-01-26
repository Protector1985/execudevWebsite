import React, { useEffect, useState } from "react";
import css from "./styles/index.module.css";
import apolloClient from "@/graphql/lib/client";
import {
  GET_ALL_CATEGORIES,
  GET_FIRST_10_POSTS,
} from "@/graphql/queries/posts";
import NavBar from "@/components/Nav/NavBar";
import PostPreview from "@/components/PostPreview/PostPreview";
import useWidth from "@/hooks/useWidth";
import Footer from "@/components/Footer/Footer";
import Head from "next/head";
import CategoryCard from "@/components/CategoryCard/CategoryCard";

interface FeaturedImage {
  node: {
    altText: string;
    sourceUrl: string;
  };
}

// interface PostNode {
//   slug: string;
//   featuredImage: FeaturedImage;
//   title: string;
//   excerpt: string;
// }

// interface Post {
//   __typename: string;
//   node: PostNode;
// }

interface HomeProps {
  categories: {
    nodes: Array<any>;
  };
}

const Home: React.FC<HomeProps> = ({ categories }) => {
  const width = useWidth();
  const { nodes } = categories;
  const [groupedCategories, setGroupedCategories] = useState<Array<Array<any>>>(
    [],
  );

  const breakpoints = {
    sm: 923,
    large: 1400,
    xl: 1401,
  };
  
  useEffect(() => {
    const groupCategories = () => {
      const filteredCategories = nodes.filter(
        (item) => item !== "Uncategorized",
      );
      let groupSize: number;
      if (width !== null) {
        if (width < breakpoints.sm) {
          groupSize = 1; // sm
        } else if (width >= breakpoints.sm && width < breakpoints.xl) {
          groupSize = 2; // large
        } else {
          groupSize = 3; // xl
        }

        const tempGroupedCategories: Array<Array<any>> = [];
        for (let i = 0; i < filteredCategories.length; i += groupSize) {
          tempGroupedCategories.push(
            filteredCategories.slice(i, i + groupSize),
          );
        }

        setGroupedCategories(tempGroupedCategories);
      }
    };

    groupCategories();
  }, [nodes, width]);

  const pageTitle = "ExecuDev | Next Level Programming";
  const pageDescription =
    "Explore cutting-edge AI centered programming tutorials, industry insights, and development tips.";
  const pageImage =
    "https://execudev-83aeea.ingress-haven.ewp.live/wp-content/uploads/2024/01/DALL·E-2024-01-07-16.29.36-A-16_9-Matrix-styled-image-of-a-CPU-with-the-initials-ED-clearly-visible-on-it.-The-CPU-is-intricately-designed-displaying-detailed-circuitry-and-c.png";
  const pageUrl = "https://www.execudev-inc.com";

  //for seo otherwise no display due to js above
  const serverRenderedCategories = nodes.map((category) => {
    if (category.name === "Uncategorized") {
      return null;
    } else {
      return (
        <CategoryCard
          slug={category.slug}
          title={category.name}
          image={category.description}
        />
      );
    }
  });

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
            {groupedCategories.length === 0 ? serverRenderedCategories : null}
            {groupedCategories.map((row, rowIndex) => (
              <div key={`Row ${rowIndex}`} className={css.postWrapper}>
                {row.map((category) => {
                  if (category.name === "Uncategorized") {
                    return null;
                  } else {
                    return (
                      <CategoryCard
                        slug={category.slug}
                        title={category.name}
                        image={category.description}
                      />
                    );
                  }
                })}
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
  try {
    const { data } = await apolloClient.query({
      query: GET_ALL_CATEGORIES,
      fetchPolicy: "no-cache",
    });

    // If data is fetched successfully, return it as props
    return {
      props: {
        ...data, // Make sure you are accessing the correct property from 'data'
      },
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

// export async function getServerSideProps() {
//   const data = await apolloClient.query({
//     query: GET_FIRST_10_POSTS,
//     fetchPolicy: "no-cache",
//   });

//   return {
//     props: { posts: data?.data?.posts?.edges },
//   };
// };

export default Home;
