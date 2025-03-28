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

    // Initialize CodeMirror
    editorRef.current = Codemirror.fromTextArea(textareaRef.current, {
      mode: { name: "javascript", json: true },
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    // Ensure CodeMirror takes full height
    editorRef.current.setSize("100%", "100%");

    // Listen for local code changes
    editorRef.current.on("change", (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      console.log("Code changed -> ", code);
      onCodeChange(code);
      if (origin !== "setValue") {
        console.log("Emmiting -> ", roomId, code);
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

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log("Received -> ", code);
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div className="h-[350px] w-full">
      <textarea ref={textareaRef} className="hidden" />
      <div className=" w-full" id="editor-container"></div>
    </div>
  );
};

export default Editor;
