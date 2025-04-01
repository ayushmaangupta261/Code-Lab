// import React, { useEffect, useRef } from "react";
// import Codemirror from "codemirror";
// import { getFiles } from "../../services/operations/codeEditorApi.js";
// import "./Editor.css";

// // ✅ Import required styles & themes
// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/dracula.css";

// // ✅ Import language modes
// import "codemirror/mode/javascript/javascript";
// import "codemirror/mode/xml/xml";
// import "codemirror/mode/css/css";
// import "codemirror/mode/python/python";
// import "codemirror/mode/clike/clike";
// import "codemirror/mode/sql/sql";

// // ✅ Import autocomplete addons
// import "codemirror/addon/hint/show-hint";
// import "codemirror/addon/hint/javascript-hint";
// import "codemirror/addon/hint/html-hint";
// import "codemirror/addon/hint/css-hint";
// import "codemirror/addon/hint/sql-hint";
// import "codemirror/addon/hint/anyword-hint";
// import "codemirror/addon/hint/show-hint.css";

// // ✅ Auto-closing tags and brackets
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";

// // ✅ Enable matching brackets & highlighting active line
// import "codemirror/addon/edit/matchbrackets";
// import "codemirror/addon/selection/active-line";

// import ACTIONS from "../../constants/Actions.js";

// const Editor = ({
//   socketRef,
//   roomId,
//   onCodeChange,
//   language = "javascript",
//   selectedFile,
// }) => {
//   const editorRef = useRef(null);
//   const textareaRef = useRef(null);
//   const codeRef = useRef(""); // ✅ Stores code without re-rendering
//   const selectedFileContentRef = useRef(""); // ✅ Stores file content without re-rendering
//   const timeoutRef = useRef(null); // ✅ Prevents multiple backend calls

//   useEffect(() => {
//     if (!textareaRef.current) return;

//     const modeMap = {
//       javascript: "javascript",
//       python: "python",
//       java: "text/x-java",
//       cpp: "text/x-c++src",
//       sql: "sql",
//       html: "xml",
//     };

//     editorRef.current = Codemirror.fromTextArea(textareaRef.current, {
//       mode: modeMap[language] || "javascript",
//       theme: "dracula",
//       autoCloseTags: true,
//       autoCloseBrackets: true,
//       lineNumbers: true,
//       matchBrackets: true,
//       styleActiveLine: true,
//       extraKeys: {
//         "Ctrl-Space": "autocomplete",
//       },
//       hintOptions: { completeSingle: false },
//     });

//     editorRef.current.setSize("100%", "370px");

//     // ✅ Handle Code Changes Without Re-render
//     editorRef.current.on("change", (instance) => {
//       // console.log(`Real time collaboration ${}`)
//       codeRef.current = instance.getValue(); // ✅ Store in ref instead of state
//       onCodeChange(codeRef.current);

//       // ✅ Emit CODE_CHANGE for real-time updates
//       socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//         roomId,
//         code: codeRef.current,
//       });

//       // ✅ Ensure selectedFile is valid before sending to backend
//       // if (!selectedFile) {
//       //   console.warn("⚠️ No file selected! Skipping save.");
//       //   return;
//       // }

//       // ✅ Debounced Backend Call (Prevents Repeated Calls)
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         if (codeRef.current !== selectedFileContentRef.current) {
//           console.log("🚀 Sending Code to Backend:", codeRef.current);
//           console.log(`Selected file: ${selectedFile}`);

//           // ✅ Ensure socket is connected before emitting
//           if (socketRef.current && socketRef.current.connected) {
//             socketRef.current.emit(ACTIONS.FILE_CHANGE, {
//               path: selectedFile,
//               content: codeRef.current,
//             });
//           } else {
//             console.error("❌ Socket is not connected. Cannot send file data.");
//           }
//         }
//       }, 5000);
//     });

//     return () => {
//       if (editorRef.current) {
//         editorRef.current.toTextArea();
//         editorRef.current = null;
//       }
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, [language]);

//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null) {
//           editorRef.current.setValue(code);
//           codeRef.current = code;
//         }
//       });
//     }

//     return () => {
//       socketRef.current.off(ACTIONS.CODE_CHANGE);
//     };
//   }, [socketRef]);

//   // ✅ Fetch File Content Without Re-rendering
//   const getFileContents = async () => {
//     if (!selectedFile) {
//       console.warn("⚠️ No file selected! Cannot fetch content.");
//       return;
//     }

//     try {
//       console.log(`📂 Fetching content for: ${selectedFile}`);
//       const fileContent = await getFiles(selectedFile);

//       if (fileContent !== null && fileContent !== undefined) {
//         selectedFileContentRef.current = fileContent;
//         editorRef.current.setValue(fileContent);
//         codeRef.current = fileContent;
//         console.log("✅ File content loaded successfully.");
//       } else {
//         console.error("❌ Empty response from backend.");
//       }
//     } catch (error) {
//       console.error("❌ Error fetching file content:", error);
//     }
//   };

//   useEffect(() => {
//     getFileContents();
//   }, [selectedFile]);

//   return (
//     <div className="h-[370px] border border-gray-700 rounded-md overflow-hidden">
//       {/* {selectedFile?.length > 0 && ( */}
//         <textarea ref={textareaRef} className="hidden" />
//       {/* )} */}
//       <div className="w-full h-full" id="editor-container"></div>
//     </div>
//   );
// };

// export default Editor;



// import React, { useEffect, useRef, useCallback } from "react";
// import Codemirror from "codemirror";
// import { getFiles } from "../../services/operations/codeEditorApi.js";
// import "./Editor.css";

// // ✅ Import required styles & themes
// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/dracula.css";

// // ✅ Import language modes
// import "codemirror/mode/javascript/javascript";
// import "codemirror/mode/xml/xml";
// import "codemirror/mode/css/css";
// import "codemirror/mode/python/python";
// import "codemirror/mode/clike/clike";
// import "codemirror/mode/sql/sql";

// // ✅ Import autocomplete addons
// import "codemirror/addon/hint/show-hint";
// import "codemirror/addon/hint/javascript-hint";
// import "codemirror/addon/hint/html-hint";
// import "codemirror/addon/hint/css-hint";
// import "codemirror/addon/hint/sql-hint";
// import "codemirror/addon/hint/anyword-hint";
// import "codemirror/addon/hint/show-hint.css";

// // ✅ Auto-closing tags and brackets
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";

// // ✅ Enable matching brackets & highlighting active line
// import "codemirror/addon/edit/matchbrackets";
// import "codemirror/addon/selection/active-line";

// import ACTIONS from "../../constants/Actions.js";

// const Editor = ({ socketRef, roomId, onCodeChange, language = "javascript", selectedFile }) => {
//   const editorRef = useRef(null);
//   const textareaRef = useRef(null);
//   const codeRef = useRef(""); // ✅ Stores code without re-rendering
//   const selectedFileContentRef = useRef(""); // ✅ Stores file content without re-rendering
//   const timeoutRef = useRef(null); // ✅ Prevents multiple backend calls

//   // ✅ Map languages to modes
//   const modeMap = {
//     javascript: "javascript",
//     python: "python",
//     java: "text/x-java",
//     cpp: "text/x-c++src",
//     sql: "sql",
//     html: "xml",
//   };

//   // ✅ Initialize CodeMirror (Only Once)
//   useEffect(() => {
//     if (!textareaRef.current) return;

//     editorRef.current = Codemirror.fromTextArea(textareaRef.current, {
//       mode: modeMap[language] || "javascript",
//       theme: "dracula",
//       autoCloseTags: true,
//       autoCloseBrackets: true,
//       lineNumbers: true,
//       matchBrackets: true,
//       styleActiveLine: true,
//       extraKeys: { "Ctrl-Space": "autocomplete" },
//       hintOptions: { completeSingle: false },
//     });

//     editorRef.current.setSize("100%", "370px");

//     return () => {
//       editorRef.current?.toTextArea();
//     };
//   }, []); // ✅ Runs only once on mount

//   // ✅ Handle Code Change & Real-time Collaboration
//   const handleCodeChange = useCallback((instance) => {
//     const newCode = instance.getValue();
//     codeRef.current = newCode;
//     onCodeChange(newCode);

//     if (socketRef.current?.connected) {
//       socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: newCode });
//     } else {
//       console.error("❌ Socket is disconnected.");
//     }

//     // ✅ Prevent frequent API calls
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     timeoutRef.current = setTimeout(() => {
//       if (newCode !== selectedFileContentRef.current) {
//         console.log("🚀 Saving Code:", newCode);
//         socketRef.current.emit(ACTIONS.FILE_CHANGE, { path: selectedFile, content: newCode });
//       }
//     }, 5000);
//   }, [roomId, selectedFile, onCodeChange]);

//   // ✅ Attach Change Event Listener (Runs Once)
//   useEffect(() => {
//     if (editorRef.current) {
//       editorRef.current.on("change", handleCodeChange);
//     }
//     return () => {
//       editorRef.current?.off("change", handleCodeChange);
//     };
//   }, [handleCodeChange]);

//   // ✅ Handle Incoming CODE_CHANGE Events
//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (editorRef.current && code !== codeRef.current) {
//           editorRef.current.setValue(code);
//           codeRef.current = code;
//         }
//       });

//       return () => {
//         socketRef.current.off(ACTIONS.CODE_CHANGE);
//       };
//     }
//   }, [socketRef]);

//   // ✅ Load File Content (Prevents Re-rendering)
//   const loadFileContent = useCallback(async () => {
//     if (!selectedFile) {
//       console.warn("⚠️ No file selected! Skipping fetch.");
//       return;
//     }

//     try {
//       console.log(`📂 Fetching: ${selectedFile}`);
//       const fileContent = await getFiles(selectedFile);

//       if (fileContent) {
//         selectedFileContentRef.current = fileContent;
//         editorRef.current.setValue(fileContent);
//         codeRef.current = fileContent;
//       } else {
//         console.error("❌ Empty file content.");
//       }
//     } catch (error) {
//       console.error("❌ Error fetching file:", error);
//     }
//   }, [selectedFile]);

//   // ✅ Load File When Selected
//   useEffect(() => {
//     loadFileContent();
//   }, [selectedFile, loadFileContent]);

//   return (
//     <div className="h-[370px] border border-gray-700 rounded-md overflow-hidden">
//       <textarea ref={textareaRef} className="hidden" />
//       <div className="w-full h-full" id="editor-container"></div>
//     </div>
//   );
// };

// export default Editor;



import React, { useEffect, useRef, useCallback } from "react";
import Codemirror from "codemirror";
import { getFiles } from "../../services/operations/codeEditorApi.js";
import "./Editor.css";

// ✅ Import required styles & themes
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";

// ✅ Import language modes
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/mode/sql/sql";

// ✅ Import autocomplete addons
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/css-hint";
import "codemirror/addon/hint/sql-hint";
import "codemirror/addon/hint/anyword-hint";
import "codemirror/addon/hint/show-hint.css";

// ✅ Auto-closing tags and brackets
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

// ✅ Enable matching brackets & highlighting active line
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/selection/active-line";

import ACTIONS from "../../constants/Actions.js";

const Editor = ({ socketRef, roomId, onCodeChange, language = "javascript", selectedFile }) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const codeRef = useRef(""); // ✅ Stores code without re-rendering
  const selectedFileContentRef = useRef(""); // ✅ Stores file content without re-rendering
  const timeoutRef = useRef(null); // ✅ Prevents multiple backend calls

  // ✅ Map languages to modes
  const modeMap = {
    javascript: "javascript",
    python: "python",
    java: "text/x-java",
    cpp: "text/x-c++src",
    sql: "sql",
    html: "xml",
  };

  // ✅ Initialize CodeMirror (Only Once)
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
  }, []); // ✅ Runs only once on mount

  // ✅ Handle Code Change & Real-time Collaboration
  const handleCodeChange = useCallback((instance) => {
    const newCode = instance.getValue();
    if (newCode === codeRef.current) return; // ✅ Prevent unnecessary updates
    codeRef.current = newCode;
    onCodeChange(newCode);

    if (socketRef.current?.connected) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: newCode });
    } else {
      console.error("❌ Socket is disconnected.");
    }

    // ✅ Prevent frequent API calls
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (newCode !== selectedFileContentRef.current) {
        console.log("🚀 Saving Code:", newCode);
        socketRef.current.emit(ACTIONS.FILE_CHANGE, { path: selectedFile, content: newCode });
      }
    }, 3000);
  }, [roomId, selectedFile, onCodeChange]);

  // ✅ Attach Change Event Listener (Runs Once)
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.on("change", handleCodeChange);
    }
    return () => {
      editorRef.current?.off("change", handleCodeChange);
    };
  }, [handleCodeChange]);

  // ✅ Handle Incoming CODE_CHANGE Events
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        // console.log(`Incoming code ${editorRef.current.getValue()}`)
        // console.log(`Code Ref code ${codeRef.current}`)

        if (editorRef.current && code !== codeRef.current) {
          editorRef.current.setValue(code);
          codeRef.current = code;
        }
      });

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      };
    }
  }, [socketRef]);

  // ✅ Load File Content (Prevents Re-rendering)
  const loadFileContent = useCallback(async () => {
    if (!selectedFile) {
      console.warn("⚠️ No file selected! Skipping fetch.");
      return;
    }

    try {
      console.log(`📂 Fetching: ${selectedFile}`);
      const fileContent = await getFiles(selectedFile);

      if (fileContent) {
        selectedFileContentRef.current = fileContent;
        editorRef.current.setValue(fileContent);
        codeRef.current = fileContent;
      } else {
        console.error("❌ Empty file content.");
      }
    } catch (error) {
      console.error("❌ Error fetching file:", error);
    }
  }, [selectedFile]);

  // ✅ Load File When Selected
  useEffect(() => {
    loadFileContent();
  }, [selectedFile, loadFileContent]);

  return (
    <div className="h-[370px] border border-gray-700 rounded-md overflow-hidden">
      <textarea ref={textareaRef} className="hidden" />
      <div className="w-full h-full" id="editor-container"></div>
    </div>
  );
};

export default Editor;
