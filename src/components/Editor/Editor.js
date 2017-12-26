import React, { Component } from "react";
import {defaultEditorContent} from './DefaultEditorContent';

/// Utils
import { provideState, injectState, update } from "freactal";
import {ReactHeight} from "react-height";
import {logger} from "../../stateHelpers";

/// External components
import CodeMirror from 'react-codemirror';
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
    autoComplete = cm => {
        const codeMirror = this.refs['CodeMirror'].getCodeMirrorInstance();

        const hintOptions = {
            completeSingle: false,
            completeOnSingleClick: false
        };

        codeMirror.showHint(cm, onCompletion(codeMirror), hintOptions);
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
            <ReactHeight onHeightReady={effects.heightChanged} style={{height: "100%"}}>
                <div style={{height: '100%'}}>
                    <CodeMirror
                        ref="CodeMirror"
                        autoFocus
                        value={state.editorContent}
                        style={{height: state.editorHeight}}
                        onChange={(value, data) => {
                            // TODO Add data to version vector and validate with value.
                            effects.setEditorContent(value);
                        }}
                        options={options}
                        onCursorActivity={(editor) => {
                            // Cursor moved!
                        }}
                    />

                    {/*<Controlled*/}
                        {/*autoFocus*/}
                        {/*style={{height: state.editorHeight}}*/}
                        {/*editorDidMount={effects.editorMounted}*/}
                        {/*value={state.editorContent}*/}
                        {/*onBeforeChange={(editor, data, value) => {*/}
                            {/*effects.setEditorContent(value);*/}
                        {/*}}*/}
                        {/*options={{*/}
                            {/*mode: "stex",*/}
                            {/*theme: "material",*/}
                            {/*lineNumbers: true,*/}
                            {/*indentUnit: 4,*/}
                            {/*lineWrapping: true,*/}
                            {/*placeholder: "% Enter LaTeX code here",*/}
                            {/*rulers: [*/}
                                {/*{column: 20}*/}
                            {/*],*/}
                            {/*foldGutter: true,*/}
                            {/*gutters: ["CodeMirror-foldgutter"],*/}
                            {/*extraKeys: {*/}
                                {/*'Ctrl-Space': this.autoComplete,*/}
                                {/*'Ctrl-S': () => {},*/}
                                {/*'Cmd-S': () => {}*/}
                            {/*}*/}
                        {/*}}*/}
                        {/*onChange={(editor, data, value) => {*/}
                            {/*// console.log(data);*/}
                        {/*}}*/}
                    {/*/>*/}
                </div>
            </ReactHeight>
        );
    }
}

export default wrapComponentWithState(injectState(Editor));