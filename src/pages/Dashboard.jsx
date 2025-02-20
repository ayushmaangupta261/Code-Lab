import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router';
import Sidebar from '../components/Dashboard/Sidebar';


const Dashboard = () => {

    const { user } = useSelector((state) => state.auth);

    console.log("User in dashboard -> ", user);


    return (
        <div className='h-[80.5vh] w-[90%] mx-auto mt-[5rem]  flex gap-x-3 '>
            {/* sidebar */}
            <div className='w-[15%]  h-full px-3 py-3 flex flex-col items-start gap-y-6 bg-gray-800 rounded-xl'>
                {/* top */}
                <div className='mt-7 ml-5'>
                    <p className="text-[#a486ff] text-shadow-glow">{user?.fullName}</p>
                </div>

                <div className='h-[0.1rem] w-[90%] mx-auto bg-gray-200'></div>

                {/* menu */}
                <div className=' flex flex-col gap-y-3 w-full '>
                    <Sidebar accountType={user?.accountType} />
                </div>

            </div>

            {/* Dashboard */}
            <div className='w-[85%] h-full bg-[#282a36] rounded-xl'>
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard