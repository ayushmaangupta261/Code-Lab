import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { VscSignOut } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'
import { DashboardLinks } from '../../constants/Links/DashboardLinks'
import SidebarLink from './SidebarLink'


const Sidebar = ({ accountType }) => {



    const navigate = useNavigate();
    const dispatch = useDispatch();
 


    return (



        <div className='flex flex-col gap-y-6 w-full '>
            <div className=''>
                {
                    DashboardLinks?.map((link, index) => {
                        if (link?.type && accountType !== link?.type) return null;
                        return (
                            <SidebarLink link={link} iconName={link?.icon} key={link?.id} />
                        )
                    })
                }
            </div>

            <div className='h-[0.1rem] w-[90%] mx-auto bg-gray-200'></div>


            <div className=''>
               

                {/* <button
                    onClick={() => setConfirmationModal({
                        text1: "Are you sure ?",
                        text2: "You will be logged out of your Account",
                        btn1Text: "Log out",
                        btn2Text: "Cancel",
                        btn1Handler: () => dispatch(logout(navigate)),
                        // btn2Handle: () => setConfirmationModal(null)
                    })}
                    className='text-sm font-medium text-richblack-300'
                >
                    <div className='flex min-[1075px]:ml-[3rem] gap-x-2 min-[1075px]:mt-[1rem] '>
                        <VscSignOut className='text-lg' />
                        <span>Log out</span>



                    </div>
                </button> */}

                




            </div>


        </div>





    )
}

export default Sidebar