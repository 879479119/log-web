import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

function onChange(newValue) {
  console.log('change',newValue);
}

export default function() {
  return (
    <div className="ant-input" style={{height: 'auto', padding: 0}}>

      <AceEditor
        mode="json"
        theme="github"
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{$blockScrolling: true}}
        width="auto"
        height={300}
      />
    </div>

  )
}
