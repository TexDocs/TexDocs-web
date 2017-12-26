import React, { Component } from "react";
import {defaultEditorContent} from './DefaultEditorContent';

/// Utils
import { provideState, injectState, update } from "freactal";
import {ReactHeight} from "react-height";
import {logger} from "../../stateHelpers";

/// External components
import {Controlled as CodeMirror} from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/stex/stex');

/// Styles
require('./Editor.css');

const wrapComponentWithState = provideState({
    initialState: () => ({
        editorContent: defaultEditorContent,
        editor: undefined,
        editorHeight: 300
    }),
    effects: {
        heightChanged: update((state, editorHeight) => {
            // TODO This doesn't get called on window resize
            if (state.editor) state.editor.setSize(null, editorHeight);
            return { editorHeight };
        }),
        editorMounted: update((state, editor) => {
            // TODO Setup editor
            return { editor };
        }),
        setEditorContent: update((state, editorContent) => ({editorContent})),
    },
    middleware: [logger("Editor")]
});

class Editor extends Component {
    render() {
        const { state, effects } = this.props;

        return (
            <ReactHeight onHeightReady={effects.heightChanged} style={{height: "100%"}}>
                <div style={{height: '100%'}}>
                    <CodeMirror
                        autoFocus
                        style={{height: state.editorHeight}}
                        editorDidMount={effects.editorMounted}
                        value={state.editorContent}
                        onBeforeChange={(editor, data, value) => {
                            effects.setEditorContent(value);
                        }}
                        options={{
                            mode: "stex",
                            theme: "material",
                            lineNumbers: true,
                            indentUnit: 4,
                            lineWrapping: true,

                        }}
                        onChange={(editor, data, value) => {
                            console.log(data);
                        }}
                    />
                </div>
            </ReactHeight>
        );
    }
}

export default wrapComponentWithState(injectState(Editor));