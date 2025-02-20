import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../../constants/Actions.js";


const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!textareaRef.current) return;

        // Initialize CodeMirror only once
        editorRef.current = Codemirror.fromTextArea(textareaRef.current, {
            mode: { name: "javascript", json: true },
            theme: "dracula",
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
        });

        // Listen for local code changes
        editorRef.current.on("change", (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();
            onCodeChange(code);
            if (origin !== 'setValue') {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
        });


        return () => {
            if (editorRef.current) {
                editorRef.current.toTextArea();
                editorRef.current = null;
            }
        };
    }, []);

    // useEffect(() => {
    //     if (!socketRef.current) {
    //         console.error("Socket reference is null or undefined");
    //         return;
    //     }

    //     console.log("Socket reference initialized:", socketRef.current);

    //     const handleCodeChange = ({ code }) => {
    //         console.log("Received Code ->", code);
    //         if (editorRef.current) {
    //             editorRef.current.setValue(code);
    //         } else {
    //             console.warn("Editor reference is null");
    //         }
    //     };

    //     socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

    //     return () => {
    //         socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
    //     };
    // }, [socketRef]); // <-- Ensure socketRef is in dependencies


    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);



    return <textarea ref={textareaRef} />;
};

export default Editor;
