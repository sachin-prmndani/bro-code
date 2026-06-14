import { useRef, useState } from 'react'
import { Editor, type OnMount } from '@monaco-editor/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import languages from '../constants'

function LanguageSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {Object.keys(languages).map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

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
