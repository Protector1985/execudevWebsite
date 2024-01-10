import React, { useEffect, useState } from 'react';
import AceEditor from "react-ace";

// Import the modes you need
import "ace-builds/src-noconflict/mode-python"; // Import python mode
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-monokai";

import "ace-builds/src-noconflict/ext-language_tools"; // Import language tools for autocomplete, snippets, etc.

interface CodeEditorInterface {
    codeSnippet: {
        type: string,
        code: string,
    }
}

const CodeEditor: React.FC<CodeEditorInterface> = ({ codeSnippet }) => {
    const [editorMode, setEditorMode] = useState<string>("text");

    useEffect(() => {
        if(codeSnippet.type === "python_code") {
            setEditorMode("python");
        }
        // Add other conditions for different code types if necessary
    }, [codeSnippet.type]);

    return (
        <AceEditor
            mode={editorMode}
            theme="dracula"
            name="codeEditor"
            readOnly={true}
            value={codeSnippet.code}
            editorProps={{ $blockScrolling: true }}
            
            setOptions={{
                displayIndentGuides: false,
                showLineNumbers: true,
                tabSize: 4,
                useWorker: false, // Disable syntax checking
                showInvisibles: false // Disable whitespace visualization
            }}
        />
    );
}

export default CodeEditor;
