import apolloClient from "@/graphql/lib/client";
import { GET_ALL_CATEGORIES, GET_ALL_POSTS_PER_CATEGORY } from "@/graphql/queries/posts";




export default function Sitemap() {
    return null
}

function generateSiteMap(subDomains:string[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://execudev-inc.com</loc>
    </url>
    ${subDomains.map((item:any) => {
    return (`
    <url>
        <loc>${`https://execudev-inc.com${item}`}</loc>
    </url>
    `);    
    }).join('').trim()}
  </urlset>`;
  }

export async function getServerSideProps({res}:any) {
    
    const { data } = await apolloClient.query({
        query: GET_ALL_CATEGORIES,
        fetchPolicy: "no-cache",
      });


      const doms = data.categories.nodes.map(async (item:any) => {
        const allDomains:any[] = []
        item.name !== "Uncategorized" ?? allDomains.push(`/${item.slug}`) 
        
        const {data} = await apolloClient.query({
            query: GET_ALL_POSTS_PER_CATEGORY,
            variables: {category: item.name},
            fetchPolicy: "no-cache"
        })
        const subDomains = data.posts.edges.map((subItem:any) => {
            const subDomain = `/${item.slug}/${subItem.node.slug}`
            return subDomain
        })
        subDomains.forEach((domain:any) => allDomains.push(domain))

        return allDomains
      })

      const preparedDomains = await Promise.all(doms)

      

    const sitemap = generateSiteMap(preparedDomains.flat())
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
    
    
    return {
        props:{}
    }
}
