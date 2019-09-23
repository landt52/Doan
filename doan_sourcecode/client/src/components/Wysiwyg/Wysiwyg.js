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
        />
        <textarea
          disabled
          value={draftToHtml(
            convertToRaw(props.editorState.getCurrentContent())
          )}
        />
        {console.log(draftToHtml(convertToRaw(props.editorState.getCurrentContent())))}
      </div>
    );
}

export default Wysiwyg
