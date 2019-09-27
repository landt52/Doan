import React from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import classes from './Wysiwyg.css';

function Wysiwyg(props) {
    return (
      <div>
        <Editor
          wrapperClassName={classes.Wysiwyg}
          editorClassName={classes.Editor}
          editorState={props.editorState}
          onEditorStateChange={props.onEditorStateChange}
          toolbar={{
            image: {
              uploadCallback: props.uploadCallback,
              alt: { present: true, mandatory: false },
              previewImage: true,
              defaultSize: {height: 'auto', width: 'auto'}
            }
          }}
        />
      </div>
    );
}

export default Wysiwyg
