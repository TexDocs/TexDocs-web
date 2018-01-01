import React, { Component } from "react";
import {defaultEditorContent} from './DefaultEditorContent';

/// Utils
import { provideState, injectState, update } from "freactal";
import {logger} from "../../stateHelpers";
import * as codemirror from 'codemirror';

/// External components
import Measure from "react-measure";
import {Controlled} from 'react-codemirror2';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/stex/stex';

import 'codemirror/addon/display/placeholder';
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

const wrapComponentWithState = provideState({
    initialState: () => ({
        editorContent: defaultEditorContent,
        editor: undefined,
        editorHeight: 300
    }),
    effects: {
        heightChanged: update((state, dimensions) => {
            if (state.editor) state.editor.setSize(null, dimensions.bounds.height);
            return { editorHeight: dimensions.bounds.height };
        }),
        editorMounted: update((state, editor) => {
            window.editor = editor;
            /// Correctly indent soft-wrapped lines
            const charWidth = editor.defaultCharWidth(), basePadding = 4;
            editor.on("renderLine", function(cm, line, elt) {
                const off = codemirror.countColumn(line.text, null, cm.getOption("tabSize")) * charWidth;
                elt.style.textIndent = "-" + off + "px";
                elt.style.paddingLeft = (basePadding + off) + "px";
            });

            /// Trigger autocompletion on cursor activity
            // TODO Trigger at more reasonable conditions
            // const hintOptions = { hint: onCompletion(codemirror) };
            // editor.on('cursorActivity', function() {
            //     editor.showHint(hintOptions);
            // });

            return { editor };
        }),
        cursorUpdate: update((state, editor) => {
            // TODO Process cursorUpdate
        }),
        setEditorContent: update((state, editor, changeSet, editorContent) => {
            // TODO Process changeset
            return {editorContent};
        }),
    },
    middleware: [logger("Editor")]
});

class Editor extends Component {
    autoComplete = cm => {
        cm.showHint({
            hint: onCompletion(codemirror)
        });
    };

    render() {
        const { state, effects } = this.props;

        const options = {
            mode: "stex",
            theme: "material",
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
        };

        return (
            <Measure bounds onResize={effects.heightChanged} style={{height: "100%"}}>
                {({measureRef}) =>
                    <div ref={measureRef} style={{height: '100%'}}>
                        <Controlled
                            autoFocus
                            style={{height: state.editorHeight}}
                            editorDidMount={effects.editorMounted}
                            onBeforeChange={effects.setEditorContent}
                            value={state.editorContent}
                            options={options}
                            onCursorActivity={effects.cursorUpdate}
                        />
                    </div>
                }
            </Measure>
        );
    }
}

export default wrapComponentWithState(injectState(Editor));