import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import Client from "../components/Editor/Client.jsx"
import Editor from '../components/Editor/Editor.jsx';

import { initSocket } from '../services/socket.js';
import ACTIONS from '../constants/Actions.js';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';



const EditorPage = () => {

    const socketRef = useRef(null); // It won't re-render our component
    const location = useLocation();
    const codeRef = useRef(null);
    const ReactNavigate = useNavigate();

    const { roomId } = useParams();
    // console.log("Room id -> ", roomId);


    const [clients, setClients] = useState([]);


    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on("connect_error", (err) => handleErrors(err));
            socketRef.current.on("connect_failed", (err) => handleErrors(err));

            function handleErrors(e) {
                // console.log("Socket-Error");
                toast.error("Socket connection failed, try again later..");
                ReactNavigate("/");
            }

            // Join room
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                userName: location.state?.userName,
            });


            if (socketRef.current) {
                socketRef.current.on(ACTIONS.JOINED, ({ clients, userName, socketId }) => {
                    if (userName !== location.state?.userName) {
                        toast.success(`${userName} joined the room.`);
                        // console.log(`${userName} joined`);
                    }
                    setClients(clients);

                    if (socketRef.current) {
                        socketRef.current.emit(ACTIONS.SYNC_CODE, {
                            code: codeRef.current,
                            socketId,
                        });
                    }
                });
            }


            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, userName }) => {
                    toast.success(`${userName} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };

        init(); // ✅ Call the async function properly

        // Cleanup function
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.off(ACTIONS.CODE_CHANGE);
            }
        };
    }, []); // ✅ Dependencies array remains empty


    //copy room id
    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room Id copied")
        } catch (error) {
            toast.error("Could not copy the room Id");
            // console.log("Error in room id copy -> ", error);
        }
    }

    // leave room
    const leaveRoom = () => {
        ReactNavigate('/');

    }



    if (!location.state) {
        <Navigate to='/' />
    }

    return (
        <div className='mainwrap text-gray-100 flex h-[39rem] w-full gap-x-3 mt-[4rem] overflow-hidden '>

            <div className="aside flex flex-col justify-between bg-gray-700 py-5 px-5 rounded-br-2xl rounded-tr-2xl w-[18rem]">

                <div className="asideInner flex flex-col gap-y-3">
                    <div className="logo">
                        <p className='text-3xl text-green-400'>Code-Sync</p>
                    </div>

                    <div className='bg-gray-300 h-[2px] w-[15rem] mt-5 mr-auto'></div>

                    <div className='flex justify-start items-center mt-2'>
                        <p>Connected</p>
                        {/* <img src={connected} alt="" className='w-[3rem] bg-gray-700 rounded-full' /> */}
                    </div>


                    {/*  Connected clients */}
                    <div className="clientLists h-auto flex flex-wrap gap-x-5 ">
                        {
                            clients.map((client, index) => (
                                <Client userName={client.userName} key={client.socketId} />
                            ))
                        }
                    </div>
                </div>

                <div className=' flex flex-col w-[15rem]'>
                    <button className="btn copyBtn px-2 py-1 bg-gray-200 text-black  ml-auto rounded-lg mt-2 mb-2 cursor-pointer hover:scale-105 duration-200 w-full"
                        onClick={copyRoomId}
                    >Copy Room Id</button>
                    <button className="btn leaveBtn px-2 py-1 bg-green-500 text-black  ml-auto rounded-lg mt-2 mb-2 cursor-pointer hover:bg-green-400 hover:scale-105 duration-200 w-full"
                        onClick={leaveRoom}
                    >Leave the Room</button>
                </div>

            </div>

            <div className="editorwrap w-[90%] mr-5 mb-4 mt-1">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>

        </div>
    )
}

export default EditorPage