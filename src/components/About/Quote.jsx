import React from 'react'
import HighlightText from '../Home/HighlightText'

const Quote = () => {
    return (
        <div className=' text-center mt-10 font-semibold text-xl'>
            We are passionate about revolutionizing the way we learn. Our innovative platform
            <HighlightText text={"combines technologies"} />
            <span className='text-pink-200'>
                {" "}
                expertise
            </span>
            , and comunity to create an
            <span className='text-pink-200'>
                {" "}
                unparalleled educational experience.
            </span>


        </div>
    )
}

export default Quote
