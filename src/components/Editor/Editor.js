import React, { Component } from "react";

/// Utils
import { injectState } from "freactal";
import * as codemirror from 'codemirror';
import {wrapEditorWithState} from "./state";


/// External components [Codemirror]
import {Controlled} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/stex/stex';

// Themes
import 'codemirror/theme/material.css';

// Placeholder
import 'codemirror/addon/display/placeholder';

// Autocompletion
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import {onCompletion} from "./autoComplete/onCompletion";


// require('codemirror/addon/comment/comment');
// require('codemirror/addon/edit/closebrackets');
// require('codemirror/addon/edit/matchbrackets');

// require('codemirror/addon/fold/foldgutter.css');
// require('codemirror/addon/fold/foldcode');
// require('codemirror/addon/fold/foldgutter');
// require('codemirror/addon/fold/brace-fold');
// require('codemirror/addon/fold/comment-fold');
// require('codemirror/addon/fold/indent-fold');

// TODO Search for addons in the following folders:
// require('codemirror/addon/lint');
// require('codemirror/addon/merge');
// require('codemirror/addon/mode');
// require('codemirror/addon/runmode');
// require('codemirror/addon/scroll');
// require('codemirror/addon/search');
// require('codemirror/addon/selection');
// require('codemirror/addon/tern');
// require('codemirror/addon/wrap');


/// Styles
require('./Editor.css');


class Editor extends Component {
    autoComplete = cm => {
        cm.showHint({
            hint: onCompletion(codemirror)
        });
        
        // const cursor = cm.getCursor();
        // const doc = cm.getDoc();

        // doc.markText(cursor, {line: cursor.line, ch: cursor.ch + 5}, {
        //     css: "background-color: #fe3"
        // });

        // var div = document.createElement('span');
        // div.innerHTML = "Hello world!";
        // doc.setBookmark(cursor, {
        //     widget: div
        // });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.state.workspaceHeight !== this.props.state.workspaceHeight && this.props.state.editor)
            this.props.state.editor.setSize(null, this.props.state.workspaceHeight);
    }

    render() {
        const { state, effects } = this.props;

        const editorProps = {
            autoFocus: true,
            value: state.editorContent,
            style: { height: state.workspaceHeight },
            editorDidMount: effects.editorMounted,
            onCursorActivity: effects.cursorUpdate,
            onBeforeChange: effects.setEditorContent,
            options: {
                mode: "stex",
                // theme: "material",
                lineNumbers: true,
                indentUnit: 4,
                lineWrapping: true,
                placeholder: "% Enter LaTeX code here",
                rulers: [
                    {column: 20}
                ],
                foldGutter: true,
                gutters: ["CodeMirror-foldgutter"],
                extraKeys: {
                    'Ctrl-Space': this.autoComplete,
                    'Ctrl-S': () => {},
                    'Cmd-S': () => {}
                }
            }
        };

        return <Controlled {...editorProps} />;
    }
}

export default wrapEditorWithState(injectState(Editor));