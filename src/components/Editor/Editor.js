import React, { Component } from "react";

/// Utils
import { injectState } from "freactal";
import * as CodeMirror from 'codemirror';
import {wrapEditorWithState} from "./state";


/// External components [Codemirror]
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


require('codemirror/addon/display/rulers');
require('codemirror/addon/selection/active-line');
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
    constructor(args) {
        super(args);

        this.cursors = {};
    }

    addCursor = (cm, sessionID, cursor) => {
        const doc = cm.getDoc();

        const headPos = doc.posFromIndex(cursor.head);
        const anchorPos = doc.posFromIndex(cursor.anchor);

        if (this.cursors.hasOwnProperty(sessionID)) {
            const previousDocumentCursor = this.cursors[sessionID];
            if (previousDocumentCursor.selection) previousDocumentCursor.selection.clear();
            if (previousDocumentCursor.head) previousDocumentCursor.head.clear();
        }

        const documentCursor = {
            selection: undefined,
            head: undefined
        };

        if (headPos !== anchorPos) {
            documentCursor.selection = doc.markText(anchorPos, headPos, {
                css: "background-color: #fe3"
            });
        }

        const div = document.createElement('span');
        div.className = "collab-caret";
        documentCursor.head = doc.setBookmark(headPos, {
            widget: div,
        });

        this.cursors[sessionID] = documentCursor;
    };

    autoComplete = cm => {
        cm.showHint({
            hint: onCompletion(CodeMirror)
        });

        this.addCursor(cm, "someCursorID", {
            anchor: Math.floor(Math.random()*(200-30+1)+30),
            head: Math.floor(Math.random()*(200-30+1)+30),
        });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.state.workspaceHeight !== this.props.state.workspaceHeight && this.props.state.editor) {
            this.props.state.editor.setSize(null, this.props.state.workspaceHeight);
            // console.log("Setting content");
        }
    }

    componentDidMount() {
        const { state, effects } = this.props;

        const options = {
            value: state.editorContent,
            mode: "stex",
            // theme: "material",
            lineNumbers: true,
            indentUnit: 4,
            lineWrapping: true,
            placeholder: "% Enter LaTeX code here",
            styleActiveLine: true,
            rulers: [
                {column: 120}
            ],
            foldGutter: true,
            gutters: ["CodeMirror-foldgutter"],
            extraKeys: {
                'Ctrl-Space': this.autoComplete,
                'Ctrl-S': () => {},
                'Cmd-S': () => {
                    const doc = this.props.state.editor.getDoc();
                    const pos = doc.posFromIndex(10);
                    doc.replaceRange("Hello world!", pos, pos);
                }
            }
        };

        const editor = CodeMirror(this.editor, options);

        editor.on('change', console.log);

        effects.editorMounted(editor);
    }

    render() {
        return <div ref={(input) => { this.editor = input; }} />;
    }
}

export default wrapEditorWithState(injectState(Editor));