import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

// Defined URLs to be added directly to the sitemap
const BASE_URLS = [
  "https://www.execudev-inc.com",
  "https://execudev-inc.com",
  "http://www.execudev-inc.com",
  "http://execudev-inc.com"
];

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
    return data.posts.edges.map(({ node }:any) => node.slug);
  } catch (error) {
    console.error('Error fetching slugs:', error);
    throw error;
  }
}

async function generateSitemap(slugs:any) {
  // Add the predefined URLs as full paths to the sitemap
  const sitemapUrls = BASE_URLS.map(url => `  <url>\n    <loc>${url}</loc>\n  </url>`);

  // Append the base url to the slugs
  slugs.forEach((slug:any) => {
    sitemapUrls.push(`  <url>\n    <loc>${BASE_URLS[0]}/blog/posts/${slug}</loc>\n  </url>`);
  });
  
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

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
