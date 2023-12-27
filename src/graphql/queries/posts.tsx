import { gql, useQuery } from "@apollo/client";

export const GET_ALL_SLUGS = gql`
  query AllPosts {
    posts {
      edges {
        node {
          id
          slug
        }
      }
    }
  }
`;

export const GET_ONE_POST = gql`
  query post($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      content
      title
      comments {
        edges {
          node {
            date
            content
            approved
          }
        }
      }
    }
  }
`;

export const GET_FIRST_10_POSTS = gql`
  query AllPosts {
    posts(first: 10) {
      edges {
        node {
          id
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
            }
          }
          author {
            node {
              name
              firstName
              lastName
              avatar {
                url
              }
            }
          }
        }
      }
    }
  }
`;
