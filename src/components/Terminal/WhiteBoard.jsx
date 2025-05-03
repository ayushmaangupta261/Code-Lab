import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

const Whiteboard = () => {
  const drawCanvasRef = useRef(null);
  const cursorCanvasRef = useRef(null);
  const cursorsRef = useRef({});
  const socketRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { roomId } = useParams();

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  // const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState(user?.fullName || "");
  const [joined, setJoined] = useState(false);
  const [userId] = useState(uuidv4());
  const [lines, setLines] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [brushSize, setBrushSize] = useState(2);
  const [theme, setTheme] = useState("light");
  const [penType, setPenType] = useState("solid");

  const penImg = useRef(new Image());
  const eraserImg = useRef(new Image());

  const handlePointerUp = () => setIsDrawing(false);

  const handlePointerDown = (e) => {
    if (!joined) return;
    const rect = drawCanvasRef.current.getBoundingClientRect();
    drawCanvasRef.current.lastX = e.clientX - rect.left;
    drawCanvasRef.current.lastY = e.clientY - rect.top;
    setIsDrawing(true);
  };

  const undoLast = () => {
    if (undoStack.length === 0) return;

    const newUndoStack = [...undoStack];
    const lastAction = newUndoStack.pop();
    const newLines = lines.slice(0, -1);

    setUndoStack(newUndoStack);
    setRedoStack((prev) => [...prev, lastAction]);
    setLines(newLines);

    // Emit the undo action to the server
    socketRef.current.emit("undo", { lines: newLines, lastAction });

    const ctx = drawCanvasRef.current.getContext("2d");
    ctx.clearRect(
      0,
      0,
      drawCanvasRef.current.width,
      drawCanvasRef.current.height
    );
    newLines.forEach(({ x0, y0, x1, y1, color, size, penType }) => {
      drawLine(x0, y0, x1, y1, color, ctx, false, size, penType);
    });
  };

  const redoLast = () => {
    if (redoStack.length === 0) return;

    const lastRedo = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setLines((prev) => [...prev, lastRedo]);
    setUndoStack((prev) => [...prev, lastRedo]);

    // Emit the redo action to the server
    socketRef.current.emit("redo", {
      lines: [...lines, lastRedo],
      lastAction: lastRedo,
    });

    const ctx = drawCanvasRef.current.getContext("2d");
    drawLine(
      lastRedo.x0,
      lastRedo.y0,
      lastRedo.x1,
      lastRedo.y1,
      lastRedo.color,
      ctx,
      false,
      lastRedo.size,
      lastRedo.penType
    );
  };

  useEffect(() => {
    // Ensure socket reference is not empty
    if (socketRef.current) {
      // Handle undo action
      socketRef.current.on("undo", (data) => {
        const { lines, lastAction } = data;
        setLines(lines);
        const ctx = drawCanvasRef.current.getContext("2d");
        ctx.clearRect(
          0,
          0,
          drawCanvasRef.current.width,
          drawCanvasRef.current.height
        );
        lines.forEach(({ x0, y0, x1, y1, color, size, penType }) => {
          drawLine(x0, y0, x1, y1, color, ctx, false, size, penType);
        });
      });

      // Handle redo action
      socketRef.current.on("redo", (data) => {
        const { lines, lastAction } = data;
        setLines(lines);
        const ctx = drawCanvasRef.current.getContext("2d");
        drawLine(
          lastAction.x0,
          lastAction.y0,
          lastAction.x1,
          lastAction.y1,
          lastAction.color,
          ctx,
          false,
          lastAction.size,
          lastAction.penType
        );
      });

      // Cleanup event listeners on component unmount
      return () => {
        socketRef.current.off("undo");
        socketRef.current.off("redo");
      };
    }
  }, [socketRef.current]); // Dependency array to re-run effect only if socket changes

  const downloadCanvas = () => {
    html2canvas(document.body).then((canvas) => {
      const link = document.createElement("a");
      link.download = `whiteboard-${roomId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    penImg.current.src = "/icons/pen.png";
    eraserImg.current.src = "/icons/eraser.png";
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000"); // Connect using Socket.IO

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    if (joined && drawCanvasRef.current && cursorCanvasRef.current) {
      drawCanvasRef.current.width = window.innerWidth;
      drawCanvasRef.current.height = window.innerHeight;
      cursorCanvasRef.current.width = window.innerWidth;
      cursorCanvasRef.current.height = window.innerHeight;
    }
  }, [joined]);

  useEffect(() => {
    if (!joined || !socketRef.current) return;

    const drawCtx = drawCanvasRef.current.getContext("2d");

    socketRef.current.on("draw", (data) => {
      if (data.userId !== userId) {
        drawLine(
          data.x0,
          data.y0,
          data.x1,
          data.y1,
          data.color,
          drawCtx,
          false,
          data.size,
          data.penType
        );
      }
    });

    socketRef.current.on("history", (data) => {
      console.log("Received data:", data); // Log the entire data object
      if (data && Array.isArray(data.history)) {
        data.history.forEach(({ x0, y0, x1, y1, color, size, penType }) => {
          drawLine(x0, y0, x1, y1, color, drawCtx, false, size, penType);
        });
      } else {
        console.error(
          "Received 'history' is not an array or is missing:",
          data.history
        );
      }
    });

    socketRef.current.on("cursor", (data) => {
      if (data.userId !== userId) {
        cursorsRef.current[data.userId] = {
          x: data.x,
          y: data.y,
          color: data.color,
          username: data.username,
        };
      }
    });

    const interval = setInterval(() => {
      const ctx = cursorCanvasRef.current.getContext("2d");
      ctx.clearRect(
        0,
        0,
        cursorCanvasRef.current.width,
        cursorCanvasRef.current.height
      );

      Object.values(cursorsRef.current).forEach(({ x, y, color, username }) => {
        ctx.font = "12px Arial";
        ctx.fillStyle = theme === "dark" ? "white" : "black";
        ctx.fillText(username, x + 15, y + 5);

        const icon = color === "white" ? eraserImg.current : penImg.current;
        ctx.drawImage(icon, x - 8, y - 8, 20, 20);
      });
    }, 30);

    return () => {
      clearInterval(interval);
      socketRef.current.off("draw");
      socketRef.current.off("history");
      socketRef.current.off("cursor");
    };
  }, [joined, theme]);

  useEffect(() => {
    const socket = socketRef.current;

    const handleCursor = (data) => {
      if (data.userId !== userId) {
        cursorsRef.current[data.userId] = {
          x: data.x,
          y: data.y,
          color: data.color,
          username: data.username,
        };
      }
    };

    socket.on("cursor", handleCursor);

    return () => {
      // 🧹 Clean up listener on unmount or before re-run
      socket.off("cursor", handleCursor);
    };
  }, [userId]); // Only re-run if userId changes

  const drawLine = (
    x0,
    y0,
    x1,
    y1,
    color,
    ctx,
    emit = false,
    size = brushSize,
    penType = "solid"
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    if (penType === "dashed") ctx.setLineDash([10, 5]);
    else if (penType === "dotted") ctx.setLineDash([2, 2]);
    else ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();

    if (emit) {
      const lineData = {
        x0,
        y0,
        x1,
        y1,
        color,
        size,
        penType,
        userId,
        username,
        roomId,
      };
      socketRef.current.emit("draw", lineData);
      setLines((prev) => [...prev, lineData]);
      setUndoStack((prev) => [...prev, lineData]);
      setRedoStack([]);
    }
  };

  useEffect(() => {
    const joinRoom = () => {
      if (!roomId.trim() || !username.trim()) return;
      socketRef.current.emit("join-board", { roomId, userId });
      setJoined(true);
    };

    joinRoom();
  },[roomId]);

  const handlePointerMove = (e) => {
    if (!joined) return;
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    socketRef.current.emit("cursor", {
      x,
      y,
      color,
      userId,
      username,
      roomId,
    });

    if (!isDrawing) return;

    drawLine(
      drawCanvasRef.current.lastX,
      drawCanvasRef.current.lastY,
      x,
      y,
      color,
      drawCanvasRef.current.getContext("2d"),
      true,
      brushSize,
      penType
    );

    drawCanvasRef.current.lastX = x;
    drawCanvasRef.current.lastY = y;
  };

  const clearCanvas = () => {
    const ctx = drawCanvasRef.current.getContext("2d");
    ctx.clearRect(
      0,
      0,
      drawCanvasRef.current.width,
      drawCanvasRef.current.height
    );
    setLines([]);
    setUndoStack([]);
    setRedoStack([]);
    socketRef.current.emit("clearCanvas");
  };

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("clearCanvas", () => {
      const ctx = drawCanvasRef.current.getContext("2d");
      ctx.clearRect(
        0,
        0,
        drawCanvasRef.current.width,
        drawCanvasRef.current.height
      );
      setLines([]);
      setUndoStack([]);
      setRedoStack([]);
    });

    return () => {
      socketRef.current.off("clearCanvas");
    };
  }, []);

  useEffect(() => {
    const canvas = drawCanvasRef.current;
    const cursorCanvas = cursorCanvasRef.current;

    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    if (cursorCanvas) {
      cursorCanvas.width = cursorCanvas.offsetWidth;
      cursorCanvas.height = cursorCanvas.offsetHeight;
    }
  }, [joined]); // trigger when joined = true

  return (
    <div
      className={`${
        theme === "dark" ? "bg-[#121212]" : "bg-white"
      } border h-[98%] mb-[1rem] rounded overflow-hidden  flex justify-center items-start `}
    >
      {/* {!joined ? (
        <div
          className={`p-5 ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          <h2 className="text-2xl font-semibold mb-4">
            Join a Whiteboard Room
          </h2>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            // onChange={(e) => setRoomId(e.target.value)}
            className="mb-3 p-2 border rounded w-full"
          />
          <input
            type="text"
            placeholder="Enter Your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-3 p-2 border rounded w-full"
          />
          <button
            onClick={joinRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Join Room
          </button>
        </div>
      ) : ( */}
      <>
        <div className="relative w-[80vw] h-[83vh] border">
          <canvas
            ref={drawCanvasRef}
            className="absolute top-0 left-0 z-10 w-full h-full"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
          <canvas
            ref={cursorCanvasRef}
            className="absolute top-0 left-0 z-20 w-full h-full pointer-events-none"
          />
        </div>

        {/* tools */}
        <div
          className={`fixed bottom-8 w-[70vw]   transform-translate-x-1/2   mx-auto flex justify-between  z-[10] p-2.5 rounded-lg shadow-lg border ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          {/* pen and eraser */}
          <div className="flex  gap-x-2">
            <button
              onClick={() => {
                setColor("black");
                setBrushSize(2);
              }}
              className="bg-black text-white px-3 py-1 rounded"
            >
              Black
            </button>
            <button
              onClick={() => {
                setColor("red");
                setBrushSize(2);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Red
            </button>
            <button
              onClick={() => {
                setColor("blue");
                setBrushSize(2);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Blue
            </button>
            <button
              onClick={() => {
                setColor("white");
                setBrushSize(10);
              }}
              className="bg-gray-300 text-black px-3 py-1 rounded"
            >
              Eraser
            </button>
          </div>

          {/* brush size */}
          <div className="mb-2">
            <label className="mr-2">Brush Size:</label>
            <input
              type="range"
              min="1"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="mr-2"
            />
            <span>{brushSize}</span>
          </div>

          {/* pen type */}
          <div className="mb-2">
            <label className="mr-2">Pen Type:</label>
            <select
              value={penType}
              onChange={(e) => setPenType(e.target.value)}
              className="p-1 border rounded"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2 h-[3rem]">
            <button
              onClick={undoLast}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Undo
            </button>
            <button
              onClick={redoLast}
              className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
            >
              Redo
            </button>
            {/* <button
                onClick={clearCanvas}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Clear
              </button> */}
            <button
              onClick={downloadCanvas}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Download
            </button>
            <button
              onClick={toggleTheme}
              className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
            >
              Toggle Theme
            </button>
          </div>
        </div>
      </>
      {/* )} */}
    </div>
  );
};

export default Whiteboard;
