import React from 'react'


const Client = ({ userName }) => {

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;

    return (
        <div className='client flex flex-col justify-center items-center mt-3'>
            <img src={avatarUrl} size={50} className="rounded-[15px]" />
            <span
                className="max-w-[100px] overflow-hidden text-ellipsis  whitespace-nowrap ">
                {userName}
            </span>
        </div>
    )
}

export default Client