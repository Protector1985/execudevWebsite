export default function imageStringParser(htmlString: string) {
  //dom parser can only run on client.
  if (typeof window !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const image = doc.querySelector("img");
    return image ? { src: image.src, altText: image.alt } : null;
  } else {
    return null;
  }
}
