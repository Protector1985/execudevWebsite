import React, { useEffect, useRef, useState } from "react";
import apolloClient from "@/graphql/lib/client";
import { GET_ONE_POST } from "@/graphql/queries/posts";
import NavBar from "@/components/Nav/NavBar";
import css from "./styles/styles.module.css";
import readingTime from "reading-time";
import moment from "moment";
import useWidth from "@/hooks/useWidth";
import { createRoot } from "react-dom/client";
import Footer from "@/components/Footer/Footer";
import Head from "next/head";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import processContent from "./utils/processCodeSnippet";

const Post: React.FC<any> = (props: any) => {
  const [stats, setStats] = useState({ minutes: 0 });

  const width = useWidth();
  
  const contentRef = useRef<HTMLDivElement>(null); // Ref to the content div

  function extractAndReplaceCodeSnippets(htmlContent: string) {
    const pythonCodeRegex =
      /<div>\*\*\*python_code\*\*\*\{<\/div>([\s\S]*?)<div>\}\*\*\*python_code\*\*\*<\/div>/g;
    const bashCodeRegex =
      /<div>\*\*\*bash\*\*\*\{<\/div>([\s\S]*?)<div>\}\*\*\*bash\*\*\*<\/div>/g;

    let index = 0;
    const snippets: any = [];
    let modifiedHtmlContent = htmlContent;

    // Extract Python code snippets
    modifiedHtmlContent = modifiedHtmlContent.replace(
      pythonCodeRegex,
      (_, codeSnippet) => {
        return processCodeSnippet(
          codeSnippet,
          "python_code",
          index++,
          snippets,
        );
      },
    );

    // Extract Bash code snippets
    modifiedHtmlContent = modifiedHtmlContent.replace(
      bashCodeRegex,
      (_, codeSnippet) => {
        return processCodeSnippet(codeSnippet, "bash", index++, snippets);
      },
    );

    return { modifiedHtmlContent, snippets };
  }

  function processCodeSnippet(
    codeSnippet: any,
    type: any,
    index: any,
    snippets: any,
  ) {
    let cleanedCodeSnippet = codeSnippet.replace(/<\/?div>/g, "").trim();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanedCodeSnippet;
    cleanedCodeSnippet = tempDiv.innerText;

    const placeholder = `code-editor-placeholder-${index}`;
    snippets.push({ code: cleanedCodeSnippet, type, placeholder });

    return `<div id="${placeholder}"></div>`; // Placeholder for the CodeEditor component
  }

  useEffect(() => {
    if (props?.post?.content) {
      const s = readingTime(props?.post?.content);
      setStats(s);

      const { modifiedHtmlContent, snippets } = extractAndReplaceCodeSnippets(
        props.post.content,
      );
      if (contentRef.current) {
        contentRef.current.innerHTML = modifiedHtmlContent;
        snippets.forEach((snippet: any) => {
          const placeholderElement = document.getElementById(
            snippet.placeholder,
          );
          if (placeholderElement) {
            const root = createRoot(placeholderElement); // Create a root.
            root.render(
              <CodeEditor
                codeSnippet={{ type: snippet.type, code: snippet.code }}
              />,
            );
          }
        });
      }
    }
  }, [props]);

  const postTitle = props?.post?.title;
  const postDescription = props?.post?.seo?.metaDesc;
  const postImageUrl = props?.post?.featuredImage?.node.sourceUrl;

  const publicationDate = moment(
    props?.post?.seo?.opengraphPublishedTime,
  ).format("YYYY-MM-DD");
  const modifiedDate = moment(props?.post?.seo?.opengraphModifiedTime).format(
    "YYYY-MM-DD",
  );

  const structuredData = {
    "@context": "http://schema.org",
    "@type": "Article",
    headline: postTitle,
    image: postImageUrl,
    datePublished: publicationDate,
    author: {
      "@type": "Person",
      name: props?.post?.author?.node?.name,
    },
    // Additional properties like "publisher" can be added here
  };

  console.log(props)

  return (
    <>
      <Head>
        <title>{postTitle}</title>
        <meta name="description" content={postDescription} />
        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:image" content={postImageUrl} />
        <meta
          property="og:url"
          content={`https://www.execudev-inc.com/${props?.post?.categories?.nodes[0]?.slug}/post/${props?.post?.slug}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:published_time" content={publicationDate} />
        <meta property="og:modified_time" content={modifiedDate} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postDescription} />
        <meta name="twitter:image" content={postImageUrl} />
        <script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className={css.wrapper}>
        <div className={css.subWrapper}>
          {/* <NavBar /> */}
          <Breadcrumbs />
          <div className={css.imgContainer}>
            <img
              alt={`${props?.post?.featuredImage?.node.altText}-blurred-background`}
              className={css.imageBlur}
              src={props?.post?.featuredImage?.node.sourceUrl}
            />
            <img
              alt={props?.post?.featuredImage?.node.altText}
              className={css.image}
              src={props?.post?.featuredImage?.node.sourceUrl}
            />
          </div>

          <div
            style={
              width! > 1100
                ? { flexDirection: "row" }
                : { flexDirection: "column" }
            }
            className={css.headlineContainer}
          >
            <div className={css.headline}>
              <p className={css.mainHeadline}>{props?.post?.title}</p>
            </div>

            <div
              style={
                width! > 1100
                  ? { marginTop: 0, marginLeft: "5%" }
                  : { marginTop: "20px" }
              }
              className={css.statsContainer}
            >
              <div className={css.readTime}>
                <p className={css.headlineContainerSubHeadline}>Read Time</p>
                <p className={css.headlineContainerSubData}>{`${Math.floor(
                  stats.minutes,
                )} min Read`}</p>
              </div>

              <div className={css.date}>
                <p className={css.headlineContainerSubHeadline}>Date</p>
                <p className={css.headlineContainerSubData}>
                  {moment(props?.post?.date).format("MMM YYYY")}
                </p>
              </div>

              <div className={css.author}>
                <p className={css.headlineContainerSubHeadline}>Author</p>
                <p className={css.headlineContainerSubData}>
                  {props?.post?.author?.node?.name}
                </p>
              </div>
            </div>
          </div>

          
            <div
              ref={contentRef}
              className={css.content}
              dangerouslySetInnerHTML={{ __html: props?.seoContent }}
            />
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Post;

export async function getServerSideProps(context:any) {
  const { slug } = context.params;
  
  try {
    const { data } = await apolloClient.query({
      query: GET_ONE_POST,
      variables: { slug },
      fetchPolicy: "no-cache",
    });

    //below is the sanitized content for SEO
    const processedContent = processContent(data.post.content);

    //The content is served twice. with markup for code snippets and without. 
    //useRef is used on the client side to swap the relevant code snippets.
    return {
      props: {
        post: data.post,
        seoContent: processedContent
      },
    };
  } catch (err) {
    console.error("Error fetching post:", err);
    return {
      notFound: true,
    };
  }
}

