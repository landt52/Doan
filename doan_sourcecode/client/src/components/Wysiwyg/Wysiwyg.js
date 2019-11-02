import React from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import classes from './Wysiwyg.css';

function Wysiwyg(props) {
    return (
      <div>
        {props.image ? (
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
                defaultSize: { height: 'auto', width: 'auto' }
              }
            }}
          />
        ) : (
          <Editor
            wrapperClassName={classes.Wysiwyg}
            editorClassName={classes.Editor}
            editorState={props.editorState}
            onEditorStateChange={props.onEditorStateChange}
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'colorPicker',
                'link',
                'embedded',
                'emoji',
                'remove',
                'history'
              ]
            }}
          />
        )}
      </div>
    );
}

export default Wysiwyg
