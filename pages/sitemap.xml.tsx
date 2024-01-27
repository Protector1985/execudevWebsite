import apolloClient from "@/graphql/lib/client";
import {
  GET_ALL_CATEGORIES,
  GET_ALL_POSTS_PER_CATEGORY,
} from "@/graphql/queries/posts";

export default function Sitemap() {
  return null;
}

function generateSiteMap(subDomains: string[], categories:string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://execudev-inc.com</loc>
    </url>
    ${categories
      .map((item: any) => {
        return `
        <url>
            <loc>${`https://execudev-inc.com/${item.slug}`}</loc>
        </url>
    `;
      }).join("").trim()}


    ${subDomains
      .map((item: any) => {
        return `
        <url>
            <loc>${`https://execudev-inc.com/${item.node.categories.nodes[0].slug}/post/${item.node.slug}`}</loc>
        </url>
    `;
      }).join("").trim()}
  </urlset>`;
}

export async function getServerSideProps({ res }: any) {
  
    const { data } = await apolloClient.query({
      query: GET_ALL_POSTS_PER_CATEGORY,
      fetchPolicy: "no-cache",
    });

   
    const dta = await apolloClient.query({
      query: GET_ALL_CATEGORIES,
      fetchPolicy: "no-cache",
    })
    
    const categories = dta.data.categories.nodes.filter((item:any) => item.name !== "Uncategorized")
    
  const sitemap = generateSiteMap(data.posts.edges, categories);
  
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}
