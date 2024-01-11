import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import {tomorrowNightBlue} from '@uiw/codemirror-theme-tomorrow-night-blue'
import css from './styles/styles.module.css'


interface CodeEditorInterface {
    codeSnippet: {
        type: string,
        code: string,
    }
}

const CodeEditor: React.FC<CodeEditorInterface> = ({ codeSnippet }) => {
    const [editorMode, setEditorMode] = useState<string>("text/plain");
    console.log(langs.shell)
    
    useEffect(() => {
        if (codeSnippet.type === "python_code") {
            setEditorMode("text/x-python");
        } else if(codeSnippet.type ==="bash") {
            setEditorMode("text/bash");
        }
        // Add other conditions for different code types if necessary
    }, [codeSnippet.type]);


    function returnEditor() {
        if(editorMode === "text/x-python") {
            return <CodeMirror theme={tomorrowNightBlue} readOnly={true} value={codeSnippet.code} height="auto" extensions={[ langs.python()]}  />
        } else if (editorMode === "text/bash") {
            return <CodeMirror theme={tomorrowNightBlue} readOnly={true} value={codeSnippet.code} height="auto" extensions={[langs.shell()]}  />
        }
    }
  
        return (
            <div className={css.wrapper}>
                {returnEditor()}
            </div>
        )
        
            
        

}

export default CodeEditor;

