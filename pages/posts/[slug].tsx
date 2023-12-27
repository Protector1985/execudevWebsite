import React from "react";
import apolloClient from "@/graphql/lib/client";
import { GET_ALL_SLUGS, GET_ONE_POST } from "@/graphql/queries/posts";

export default function Test(props: any) {
  console.log(props.content);

  function createMarkup(htmlContent: string) {
    return { __html: htmlContent };
  }
  return (
    <div>
      <div dangerouslySetInnerHTML={createMarkup(props?.post?.content)} />
    </div>
  );
}

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
