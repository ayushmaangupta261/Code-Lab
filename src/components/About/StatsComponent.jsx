import React from 'react'


const statsforabout = [
    { count: "5K", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards" }
]

const StatsComponent= () => {
    return (
        <section className='mt-20  md:w-[80%] h-auto mx-auto'>
            <div>
                <div className='flex flex-col  md:flex-row items-center md:gap-x-5 md:justify-evenly  py-4 px-10 md:px-3 rounded-xl  bg-richblack-700 h-auto'>
                    {
                        statsforabout.map((data, index) => {
                            return (
                                <div key={index} className='bg-richblack-500 px-2 py-2 rounded-lg mb-2 mt-2  text-center  text-md w-[10rem] hover:scale-105 transition-all duration-200'>
                                <h1>
                                    {data.count}
                                </h1>
                                <h2>
                                    {data.label}
                                </h2>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default StatsComponent

