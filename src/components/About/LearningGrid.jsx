import React from 'react'
import HighlightText from '../Home/HighlightText'
import Button from "../../core/Home/Button"

const LearningGridArray = [
    {
        order: -1,
        heading: "World-Class Learning for",
        highlightText: "Anyone, Anywhere",
        description: "StudyNotion partners whith more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
        BtnText: "Learn More",
        BtnLink: "/"
    },
    {
        order: 1,
        heading: "Curriculum based on Industry Needs ",
        // highliteText:"Anyone, Anywhere",
        description: "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
    },
    {
        order: 2,
        heading: "Our Learning Methods ",
        // highliteText:"Anyone, Anywhere",
        description: "StudyNotion partners with more than 275+ leading universities and companies to bring quality courses",
    },
    {
        order: 3,
        heading: "Certification ",
        // highliteText:"Anyone, Anywhere",
        description: "StudyNotion partners with more than 275+ leading universities and companies to bring quality courses",
    },
    {
        order: 4,
        heading: "Rating 'Auto-grading'",
        // highliteText:"Anyone, Anywhere",
        description: "StudyNotion partners with more than 275+ leading universities and companies to bring quality courses",
    },
    {
        order: 5,
        heading: "Ready to work",
        // highliteText:"Anyone, Anywhere",
        description: "StudyNotion partners with more than 275+ leading universities and companies to bring quality courses",
    },
]


const LearningGrid = () => {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mb-10 p-5 w-fit mx-auto  text-center justify-center items-center gap-x-2'>
            {
                LearningGridArray.map((card, index) => {
                    return (
                        <div key={index}
                            className={`${index === 0 && "lg:col-span-2 p-5 lg:h-[20rem]  flex flex-col items-center justify-center hover:scale-100 transition-all duration-200 mb-1  "}
                        ${card.order % 2 === 1 ? "flex flex-col bg-richblack-600 p-5 lg:h-[20rem] rounded-xl hover:scale-105 transition-all duration-200  mt-2 items-center justify-center " : "flex flec-col lg:h-[20rem] bg-richblack-800 p-5   rounded-xl hover:scale-105 transition-all duration-200 mt-2 items-center justify-center  "
                                }
                     ${card.order === 3 && "xl:col-start-2"}
                     ${card.order < 0 && "bg-richblack-800 mb-[3rem] lg:mb-1 hover:scale-100 transition-all duration-200 "}
                        `}
                        >
                            {
                                card.order < 0 ?
                                    (
                                        <div className='w-[90%]  flex flex-col pb-5 gap-3 justify-center items-center rounded-md'>
                                            <div className='text-center text-2xl font-semibold '>
                                                {card.heading}
                                                <HighlightText text={card.highlightText} />
                                            </div>
                                            <p className='text-md  text-center'>
                                                {card.description}
                                            </p>
                                            <div className='w-fit mt-[2rem] lg:mt-0 text-center'>
                                                <Button active={true} linkto={card.BtnLink}>Learn More</Button>
                                            </div>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className='flex flex-col gap-y-3 p-7 '>
                                            <h1 className='text-richblack-50 text-lg font-semibold text-center'>{card.heading}</h1>
                                            <p className='text-richblack-5 font-medium text-center '>{card.description}</p>
                                        </div>
                                    )
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default LearningGrid
