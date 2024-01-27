function processContent(content: string) {
  // Regex patterns for code snippets

  if (typeof content !== "string") {
    console.error("Code snippet is not a string:", content);
    return null;
  }

  const pythonCodeRegex =
    /<div>\*\*\*python_code\*\*\*\{<\/div>([\s\S]*?)<div>\}\*\*\*python_code\*\*\*<\/div>/g;
  const bashCodeRegex =
    /<div>\*\*\*bash\*\*\*\{<\/div>([\s\S]*?)<div>\}\*\*\*bash\*\*\*<\/div>/g;

  let index = 0;

  // Function to process each code snippet
  function processCodeSnippet(codeSnippet: any, type: any) {
    // Since we're server-side, we don't need to create DOM elements to extract text
    // Instead, we directly use the codeSnippet
    const cleanedCodeSnippet = codeSnippet.replace(/<\/?div>/g, "").trim();

    const placeholder = `code-editor-placeholder-${index++}`;
    // Instead of pushing to an array, we directly replace the content in the HTML
    return `<div id="${placeholder}">${cleanedCodeSnippet}</div>`;
  }

  // Replace Python code snippets
  content = content.replace(pythonCodeRegex, (_, codeSnippet) => {
    return processCodeSnippet(codeSnippet, "python_code");
  });

  // Replace Bash code snippets
  content = content.replace(bashCodeRegex, (_, codeSnippet) => {
    return processCodeSnippet(codeSnippet, "bash");
  });

  return content;
}

export default processContent;
