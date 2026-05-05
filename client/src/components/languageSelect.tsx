import React from 'react'
import languages from '../constants'
function languageSelect() {
  return (
    <div>
        <select name="" id="" >
             {
                languages.map((language)=>(
                    <option key={language}>{language}</option>
                ))
             }
        </select>
         
    </div>
  )
}

export default languageSelect