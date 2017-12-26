export const onCompletion = (codeMirror) => {
    return (editor) => {
        const cur = editor.getCursor(),
            curLine = editor.getLine(cur.line);
        const start = cur.ch,
            end = start;

        return {
            list: [
                "SomeHint",
                "OtherHint",
                "IamGroot!",
                "BeeBoop"
            ],
            from: codeMirror.Pos(cur.line, start),
            to: codeMirror.Pos(cur.line, end)
        };
    };
};