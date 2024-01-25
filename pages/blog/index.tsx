import React from 'react';
import apolloClient from "@/graphql/lib/client";
import { GET_ALL_SLUGS, GET_ALL_CATEGORIES } from "@/graphql/queries/posts";

const CategoryPage:React.FC<any> = (props) => {

    console.log(props.categories.nodes)
    return (
        <h1>Hello World!</h1>
    )
}

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

// export async function getStaticPaths() {
//     const data = await apolloClient.query({
//       query: GET_ALL_SLUGS,
//       fetchPolicy: "no-cache",
//     });
  
  
//     const paths = data.data.posts.edges.map(({ node }: any) => {
//       return {
//         params: {category: node?.categories?.nodes[0].name.replace(/\s+/g, '_').toLowerCase(), slug: node.slug },
//       };
//     });
  
  
//     return {
//       paths: paths,
//       fallback: true,
//     };
// }

export default CategoryPage