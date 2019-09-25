import React from 'react'
import { convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
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
        <textarea
          style={{ width: '50%', height: '200px' }}
          disabled
          value={draftToHtml(
            convertToRaw(props.editorState.getCurrentContent())
          )}
        />
      </div>
    );
}

export default Wysiwyg
