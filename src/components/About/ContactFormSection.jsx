import React from 'react'
import ContactUs from '../../Contact_Page/ContactUs'

const ContactFormSection = () => {
    return (
        <div className='shadow px-10 py-10 mx-auto text-center  rounded-xl bg-richblack-800 '>
            <h1 className='text-pink-100 font-semibold text-3xl text-center'>Get in Touch</h1>
            <p className='text-md text-richblack-50 mt-5'>We'd love to be here for you, please fill out this form</p>

            <div className='mt-5'>
                <ContactUs />
            </div>
        </div>
    )
}

export default ContactFormSection
