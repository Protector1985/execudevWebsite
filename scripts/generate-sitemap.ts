import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

// Replace with your GraphQL endpoint
const GRAPHQL_ENDPOINT = "https://execudev-83aeea.ingress-haven.ewp.live/graphql";

// GraphQL query to get all slugs
const GET_ALL_SLUGS = gql`
  query GetAllSlugs {
    posts {
      edges {
        node {
          slug
        }
      }
    }
  }
`;

const writeFileAsync = promisify(fs.writeFile);

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  fetch,
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

async function fetchSlugs() {
  try {
    const { data } = await apolloClient.query({ query: GET_ALL_SLUGS });
    return data.posts.edges.map(({ node }: { node: { slug: string } }) => node.slug);
  } catch (error) {
    console.error('Error fetching slugs:', error);
    throw error;
  }
}

async function generateSitemap(slugs: string[]) {
  const baseUrl = 'https://execudev-inc.com'; 
  const sitemapContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${slugs
        .map((slug) => `
          <url>
            <loc>${baseUrl}/post/${slug}</loc>
          </url>
        `)
        .join('')}
    </urlset>
  `;
  const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');
  await writeFileAsync(sitemapPath, sitemapContent);
  console.log(`Sitemap generated at ${sitemapPath}`);
}

async function main() {
  try {
    const slugs = await fetchSlugs();
    await generateSitemap(slugs);
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
  }
}

main();
