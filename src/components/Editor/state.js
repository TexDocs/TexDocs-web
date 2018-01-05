import { provideState, update } from "freactal";
import * as codemirror from 'codemirror';

import {logger} from "../../stateHelpers";
import {defaultEditorContent} from './DefaultEditorContent';

export const wrapEditorWithState = provideState({
    initialState: () => ({
        editorContent: defaultEditorContent,
        editor: undefined
    }),
    effects: {
        editorMounted: update((state, editor) => {
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