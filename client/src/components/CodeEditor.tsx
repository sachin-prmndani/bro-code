import { useRef, useState } from 'react'
import { Editor, type OnMount } from '@monaco-editor/react'
import LanguageSelect from './LanguageSelect.jsx'

function CodeEditor() {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)

  const onMount: OnMount = (editor) => {
    editorRef.current = editor
    editor.focus()
  }

  const [value, setValue] = useState('')

  return (
   

    <div style={{ textAlign: 'right' }}>
       <LanguageSelect/>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="//some comment"
        // theme="vs-dark"
        value={value}
        onMount={onMount}
        onChange={(value) => setValue(value ?? '')}
      />
    </div>
  )
}

export default CodeEditor
