import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateAndJoinPage = () => {

    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();


    // Create new room
    const createNewRoom = (e) => {
        e.preventDefault();
        const generateRoomId = uuidv4();
        setRoomId(generateRoomId);
        // console.log('Room Id -> ', roomId);
        toast.success('Room created successfully');
    }

    // Join room
    const joinRoom = () => {
        if (!roomId || !userName) {
            toast.error('Please fill both Room Id and User Name');
            return;
        }

        // redirect
        navigate(`/editor/${roomId}`, {
            state: {
                userName
            }
        });

        toast.success("Congratulations you are successfully joined")

    }

    // Enter key press event
    const handleInputEnter = (e) => {
        if (e.key === 'Enter') {
            joinRoom();
        }
    }




    return (
        <div className='CreateAndJoinPageWrapper flex items-center justify-center text-gray-100 h-screen  w-[100vw]'>

            <div className='formWapper  bg-[#282a36] px-5 py-5 rounded-md w-[400px] max-w-[90%] -mt-[4rem] '>
                {/* <p className='text-3xl text-green-400'>Code-Sync</p> */}
                <p className='mainLabel mt-5 mb-5'>Paste your room id</p>
                <div className='flex flex-col gap-y-2'>
                    <input type="text" className='inputBox bg-gray-600 px-2 py-1 rounded-md' placeholder='Room ID' value={roomId} onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleInputEnter} />
                    <input type="text" className='inputBox bg-gray-600 px-2 py-1 rounded-md' placeholder='User Name' value={userName} onChange={(e) => setUserName(e.target.value)} onKeyUp={handleInputEnter} />
                    <button className='btn joinBtn px-2 py-1 bg-green-500 text-black w-[5rem] ml-auto rounded-full mt-2 mb-2 cursor-pointer hover:bg-green-400 hover:scale-105 duration-200'
                        onClick={joinRoom}
                    >
                        Join
                    </button>
                    <span className='createInfo text-center '>
                        If you don't have an invite then create &nbsp;
                        <a onClick={createNewRoom} className='createNewBtn cursor-pointer text-green-400 border-b border-green-400 hover:text-blue-500 hover:border-blue-500 duration-200'>new room</a>
                    </span>
                </div>
            </div>

            <footer className=' hidden lg:block lg:fixed lg:bottom-5'>
                <p>Made with ❤️ by <span className='text-green-400 cursor-pointer'>Ayushmaan Gupta</span></p>
            </footer>

        </div>
    )
}

export default CreateAndJoinPage