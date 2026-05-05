import React, { useState } from 'react'
import reactDOM from 'react-dom'
import { Editor } from '@monaco-editor/react'


function codeEditor() {
    const [value,setValue] = useState('');
  return (
    <div style={{alignContent:'right'}}>
         <Editor height="90vh"
          defaultLanguage='javascript' 
          defaultValue='//some comment'
          value={value}
          onChange={(value)=>setValue(value)}
          ></Editor>
    </div>
  )
}

export default codeEditor