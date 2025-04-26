import React, { useEffect, useRef, useCallback } from "react";
import Codemirror from "codemirror";
import { getFiles } from "../../services/operations/codeEditorApi.js";
import "./Editor.css";

// Styles & themes
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";

// Language modes
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/mode/sql/sql";

// Autocomplete addons
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/css-hint";
import "codemirror/addon/hint/sql-hint";
import "codemirror/addon/hint/anyword-hint";
import "codemirror/addon/hint/show-hint.css";

// Auto close and match
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/selection/active-line";

import ACTIONS from "../../constants/Actions.js";

const Editor = ({ socketRef, roomId, onCodeChange, language = "javascript", selectedFile }) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const codeRef = useRef("");
  const selectedFileContentRef = useRef("");
  const timeoutRef = useRef(null);
  

  const modeMap = {
    javascript: "javascript",
    python: "python",
    java: "text/x-java",
    cpp: "text/x-c++src",
    sql: "sql",
    html: "xml",
  };

  // Initialize CodeMirror
  useEffect(() => {
    if (!textareaRef.current) return;

    editorRef.current = Codemirror.fromTextArea(textareaRef.current, {
      mode: modeMap[language] || "javascript",
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      extraKeys: { "Ctrl-Space": "autocomplete" },
      hintOptions: { completeSingle: false },
    });

    editorRef.current.setSize("100%", "370px");

    return () => {
      editorRef.current?.toTextArea();
    };
  }, []);

  // Join the room (with acknowledgment)
  useEffect(() => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(ACTIONS.JOIN, { roomId }, () => {
        console.log("✅ Joined room:", roomId);
      });
    }

    socket?.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      socket.emit(ACTIONS.JOIN, { roomId }, () => {
        console.log("✅ Rejoined room after reconnect:", roomId);
      });
    });

    return () => {
      socket?.off("connect");
    };
  }, [socketRef, roomId]);

  // Handle code changes from user
  const handleCodeChange = useCallback((instance) => {
    const newCode = instance.getValue();
    if (newCode === codeRef.current) return;

    codeRef.current = newCode;
    onCodeChange(newCode);

    if (socketRef.current?.connected) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: newCode });
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (newCode !== selectedFileContentRef.current) {
        socketRef.current?.emit(ACTIONS.FILE_CHANGE, {
          path: selectedFile,
          content: newCode,
        });
      }
    }, 3000);
  }, [roomId, selectedFile, onCodeChange]);

  // Register CodeMirror change handler
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.on("change", handleCodeChange);
    }

    return () => {
      editor?.off("change", handleCodeChange);
    };
  }, [handleCodeChange]);

  // Handle incoming code from socket
  useEffect(() => {
    const socket = socketRef.current;
    const editor = editorRef.current;

    if (!socket || !editor) return;

    const handleIncomingCodeChange = ({ code }) => {
      if (code !== codeRef.current) {
        editor.setValue(code);
        codeRef.current = code;
      }
    };

    socket.on(ACTIONS.CODE_CHANGE, handleIncomingCodeChange);

    return () => {
      socket.off(ACTIONS.CODE_CHANGE, handleIncomingCodeChange);
    };
  }, [socketRef]);

  // Load selected file content
  const loadFileContent = useCallback(async () => {
    if (!selectedFile) return;

    try {
      const fileContent = await getFiles(selectedFile);
      if (fileContent) {
        selectedFileContentRef.current = fileContent;
        codeRef.current = fileContent;
        editorRef.current?.setValue(fileContent);
      }
    } catch (error) {
      console.error("❌ Error fetching file:", error);
    }
  }, [selectedFile]);

  useEffect(() => {
    loadFileContent();
  }, [loadFileContent]);

  return (
    <div className="h-[370px] border border-gray-700 rounded-md overflow-hidden">
      <textarea ref={textareaRef} className="hidden" />
      <div className="w-full h-full" id="editor-container"></div>
    </div>
  );
};

export default Editor;
