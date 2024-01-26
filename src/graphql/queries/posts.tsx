import { gql, useQuery } from "@apollo/client";

export const GET_ALL_SLUGS = gql`
  query AllPosts {
    posts {
      edges {
        node {
          id
          slug
          categories {
            nodes {
              categoryId
              description
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query categories {
    categories {
      nodes {
        name
        slug
        description
      }
    }
  }
`;

export const GET_ALL_POSTS_PER_CATEGORY = gql`
  query posts($category: String) {
    posts(where: { categoryName: $category }) {
      edges {
        node {
          id
          title
          excerpt
          slug
          date
          categories {
            nodes {
              slug
            }
          }
          featuredImage {
            node {
              altText
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

export const GET_ONE_POST = gql`
  query post($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      content
      title
      date
      slug
      categories {
            nodes {
              slug
            }
          }
      seo {
        breadcrumbs {
          url
          text
        }
        metaDesc
        opengraphPublishedTime
        opengraphModifiedTime
      }
      author {
        node {
          name
        }
      }
      featuredImage {
        node {
          altText
          sourceUrl
        }
      }
      seo {
        breadcrumbs {
          url
          text
        }
        metaDesc
        opengraphPublishedTime
        opengraphModifiedTime
      }
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
              altText
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
