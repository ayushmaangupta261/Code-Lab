import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createAndJoinRoom,
  findRoomByEmail,
} from "../../../services/operations/roomAPi";
import deleteIcon from "../../../assets/Dashboard/delete.png";

const Projects = () => {
  const [roomId, setRoomId] = useState("");
  const [projectName, setprojectName] = useState("");
  const [showCreate, setShowCreate] = useState(true); // toggle for create room
  const [room, setRooms] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [email, setemail] = useState(user?.email || "");

  const createNewRoom = (e) => {
    e.preventDefault();
    const generateRoomId = uuidv4();
    setRoomId(generateRoomId);
    toast.success("Room created successfully");
  };

  const joinRoom = async () => {
    if (!roomId || !email || !projectName) {
      toast.error("Please fill both Room Id and Email");
      return;
    }

    const response = await dispatch(
      createAndJoinRoom({ roomId, email, projectName }, user?.accessToken)
    );

    if (response?.success) {
      //     if (!roomId.trim() || !username.trim()) return;
      //     socketRef.current.emit("join-board", { roomId, userId });
      //     setJoined(true);
      navigate(`/editor/${roomId}`, {
        state: {
          email,
          projectName,
        },
      });

      toast.success("Congratulations you are successfully joined");
    } else {
      toast.error("Error in creating room");
    }
  };

  const handleInputEnter = (e) => {
    if (e.key === "Enter") {
      joinRoom();
    }
  };

  useEffect(() => {
    const findRooms = async () => {
      try {
        if(email){
          const response = await dispatch(
            findRoomByEmail(email, user?.accessToken)
          );
          console.log("Res in ui -> ", response);
          setRooms(response || []);
        }
      } catch (error) {
        console.log("Error in ui -> ", error);
      }
    };

    if (email.trim() !== "") { 
      findRooms();
    }
  }, [dispatch, email, user?.accessToken]);

  return (
    <div className="flex flex-col items-center justify-start text-gray-100 w-full  p-5">
      <div className="w-full h-full  flex flex-col ">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-green-400">Your Rooms</h2>
          {/* <button
            className="text-sm text-blue-400 border border-blue-400 px-3 py-1 rounded hover:bg-blue-500 hover:text-white"
            onClick={() => setShowCreate((prev) => !prev)}
          >
            {/* {showCreate ? "Hide Create Form" : "Create New Room"} */}
          {/* </button> */}
        </div>

        {/* Existing Rooms */}
        {room.length > 0 ? (
          <ul className="space-y-2 flex flex-col h-[16.5rem] overflow-y-auto">
            {room.map((r) => (
              <li
                key={r._id}
                className="bg-gray-700 rounded-md p-3 flex justify-between items-center "
              >
                <div>
                  <p className="text-lg font-medium text-white">
                    Project Name: {r?.projectName}
                  </p>
                  <p className="text-lg font-medium text-white">
                    Room ID: {r.roomId}
                  </p>
                  <p className="text-sm text-gray-300">
                    Members: {r.students?.length || 0}
                  </p>
                  {r.instructor && (
                    <p className="text-sm text-gray-400">
                      Instructor: {r.instructor.fullName}
                    </p>
                  )}
                </div>
                <div className="flex gap-x-5 items-center px-2 py-1 rounded-md ">
                  {/* <button className="w-[1.5rem] hover:scale-95 duration-200">
                    <img src={deleteIcon} alt="" className="" />
                  </button> */}
                  <button
                    className="bg-green-500 px-3 py-1 rounded-md text-black hover:bg-green-400 hover:scale-95 duration-200"
                    onClick={() =>
                      navigate(`/editor/${r.roomId}`, {
                        state: { email, projectName:  r.projectName },
                      })
                    }
                  >
                    Join
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No rooms found.</p>
        )}

        {/* Create Room Section */}
        {showCreate && (
          <div className="mt-8 border-t border-gray-600 pt-4">
            <p className="mainLabel mb-4 text-green-400">
              or Create and Join new Room
            </p>
            <div className="flex flex-col gap-y-2">
              <input
                type="text"
                className="inputBox bg-gray-600 px-2 py-1 rounded-md"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyUp={handleInputEnter}
              />
              <div className="flex gap-x-2 justify-between">
                <input
                  type="text"
                  className="inputBox w-full bg-gray-600 px-2 py-1 rounded-md"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setprojectName(e.target.value)}
                  onKeyUp={handleInputEnter}
                />
                <input
                  type="text"
                  className="inputBox w-full bg-gray-600 px-2 py-1 rounded-md cursor-not-allowed select-none"
                  placeholder="Email"
                  value={email}
                  readOnly
                />
              </div>
              <button
                className="btn joinBtn px-2 py-1 bg-green-500 text-black w-[5rem] ml-auto rounded-full mt-2 mb-2 cursor-pointer hover:bg-green-400 hover:scale-105 duration-200"
                onClick={joinRoom}
              >
                Join
              </button>
              <span className="createInfo text-center">
                Or &nbsp;
                <a
                  onClick={createNewRoom}
                  className="createNewBtn cursor-pointer text-green-400 border-b border-green-400 hover:text-blue-500 hover:border-blue-500 duration-200"
                >
                  Generate New Room ID
                </a>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
