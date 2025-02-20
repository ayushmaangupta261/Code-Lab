import React from 'react'
import HighlightText from '../components/Home/HighlightText';
import Quote from '../components/AboutUs/Quote';
import StatsComponent from '../components/AboutUs/StatsComponent';
import LearningGrid from '../components/AboutUs/LearningGrid';
import ContactFormSection from '../components/AboutUs/ContactFormSection';

import BannerImg1 from "../assets/about/Banner_1.jpeg"
import BannerImg2 from "../assets/about/Banner_2.webp"
import BannerImg3 from "../assets/about/Banner_3.webp"
import FoundingStory from "../assets/about/Founding_Story.jpeg";
import ReviewSlider from '../components/common/ReviewSlider';


const About = () => {
    return (
        <div className='w-[100vw] h-auto mt-[50px] text-richblue-5 mx-auto'> {/*w-11/12 max-w-maxContent */}
            <div className='w-11/12 max-w-maxContent flex flex-col  justify-center items-center mx-auto'>
                {/* section 1 */}
                <section className='w-11/12 flex flex-col'>
                    <div className=''>
                        <header className=' mx-auto'>
                            <p className='text-2xl md:text-4xl text-center'>
                                Driving Innovation in Online Education for a <br />
                                <HighlightText text={"Brighter Future"} />
                            </p>
                            <p className='text-md text-richblack-50 text-center mx-auto mt-5'>
                                StudyNotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging, emerging technologies and nuturing a vibrant learning community.
                            </p>
                        </header>
                        <div className='flex flex-col flex-wrap md:flex-row gap-y-10 md:gap-x-10 justify-between mt-10 mx-auto'>
                            <img src={BannerImg1} className='md:h-[12rem] rounded-md hover:scale-105 transition-all duration-200 shadow mx-auto' />
                            <img src={BannerImg2} className=' md:h-[12rem] rounded-md hover:scale-105 transition-all duration-200 shadow mx-auto' />
                            <img src={BannerImg3} className=' md:h-[12rem] rounded-md hover:scale-105 transition-all duration-200 shadow mx-auto' />
                        </div>
                    </div>
                </section>


                {/* Section 2 */}
                <section className='w-11/12 '>
                    <div className='mx-auto'>
                        <Quote />
                    </div>
                </section>


                {/* Section 3 */}
                <section className='mt-10 w-11/12'>
                    <div className='flex flex-col justify-center items-center'>
                        {/* Founding story */}
                        <div className='flex flex-col md:flex-row justify-between  text-center'>
                            {/* Founding story left part */}
                            <div className='md:w-[50%] mb-3'>
                                <h1 className='text-pink-100 font-semibold text-xl text-center'>Our Founding Story</h1>
                                <p className='text-sm text-richblack-50'>Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologies, and lifelong learners who recognized the need for accessible, flexible and high-quality learning opportunities in a rapidly evolving digital world.</p>
                                <br />
                                <p className='text-sm text-richblack-50 mb-5 md:mb-0'>As experienced educators ourselves, we witnesses firsthand the limitations and challanges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundries we envisioned a platform that could bridge these gaps and empower individual for all walks of life to unlock their full potentail.</p>
                            </div>
                            {/* Founding story right part */}
                            <div className='my-auto mx-auto '>
                                <img src={FoundingStory} className=' h-[200px]  rounded-md hover:scale-105 transition-all duration-200 shadow' />
                            </div>
                        </div>


                        {/* Vision and Mission  */}
                        <div className='flex flex-col gap-5 text-center  md:flex-row  md:justify-evenly items-center mt-10'>
                            {/* left */}
                            <div className='w-full md:w-[40%]  '>
                                <h1 className='text-pink-100 font-semibold text-xl text-center'>Our Vision</h1>
                                <p className='text-sm text-richblack-50'>With this vision in mind, we set out on a journey to create an e-learning platform bthat would revolutionize the way pople learn. Our team of dedicated experts worked tirlessly to develop a robust and intutive platform that combines cutting-edge technologies with engaging content, fostering a dynamic and interactive learning experience.</p>
                            </div>
                            {/* right */}
                            <div className='w-full md:w-[40%]  '>
                                <h1 className='text-pink-100 font-semibold text-xl text-center'>Our Mission</h1>
                                <p className='text-sm text-richblack-50'>Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate and learn from one another. We believe that knowledge thrives in sn environment of sharing and dialogue and we foster thid spirit of collaboration through forums, live sessions and networking opportunities.</p>
                            </div>
                        </div>



                    </div>
                </section>


                {/* Section 4 */}
                <StatsComponent />


                {/* Section 5 */}
                <section className='w-11/12 mt-10 mx-auto flex flex-col items-center justify-center gap-5 '>
                    <div className=''>
                        <LearningGrid />
                    </div>
                    <div className="rounded-xl" >
                        <ContactFormSection />
                    </div>

                </section>
            </div>

            {/* Section 6 */}
            <div className="">
                <ReviewSlider />
            </div>

            {/* Section 7 */}
            {/* <div className=" bg-richblack-800  w-[100vw]">
                <Footer />
            </div> */}

        </div>
    )
}

export default About