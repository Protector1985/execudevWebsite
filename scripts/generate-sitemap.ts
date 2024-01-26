import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";
import fetch from "cross-fetch";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import moment from "moment";

// Defined URLs to be added directly to the sitemap
const BASE_URL = "https://www.execudev-inc.com";

// Replace with your GraphQL endpoint
const GRAPHQL_ENDPOINT =
  "https://execudev-83aeea.ingress-haven.ewp.live/graphql";

// GraphQL query to get all slugs and their last modification dates
const GET_ALL_SLUGS = gql`
  query GetAllSlugs {
    posts {
      edges {
        node {
          seo {
            breadcrumbs {
              url
              text
            }
            metaDesc
            opengraphPublishedTime
            opengraphModifiedTime
          }
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
    return data.posts.edges.map(({ node }: any) => ({
      slug: node.slug,
      lastmod: node.seo.opengraphModifiedTime,
    }));
  } catch (error) {
    console.error("Error fetching slugs:", error);
    throw error;
  }
}

async function generateSitemap(slugs: any) {
  let latestDate = "";
  const sitemapUrls = [];

  slugs.forEach(({ slug, lastmod }: any) => {
    const formattedDate = moment(lastmod).format("YYYY-MM-DD");
    if (!latestDate || moment(formattedDate).isAfter(moment(latestDate))) {
      latestDate = formattedDate;
    }
    sitemapUrls.push(
      `  <url>\n    <loc>${BASE_URL}/posts/${slug}</loc>\n    <lastmod>${formattedDate}</lastmod>\n  </url>`,
    );
  });

  // Add the base URL with the latest modification date
  sitemapUrls.unshift(
    `  <url>\n    <loc>${BASE_URL}</loc>\n    <lastmod>${latestDate}</lastmod>\n  </url>`,
  );

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join("\n")}
</urlset>`;

  const sitemapPath = path.resolve(process.cwd(), "public/sitemap.xml");
  await writeFileAsync(sitemapPath, sitemapContent);
  console.log(`Sitemap generated at ${sitemapPath}`);
}

async function main() {
  try {
    const slugs = await fetchSlugs();
    await generateSitemap(slugs);
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
  }
}

main();
