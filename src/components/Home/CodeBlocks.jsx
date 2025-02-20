import React from "react";
import Button from "./Button.jsx";
import HighlightText from "./HighlightText.jsx";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";




const CodeBlocks = ({
    position,

    codeblock,
    //   backkgroundGrdient,
    codeColor,
    //   colorstp1,
    //   colorstp2
}) => {
    return (
        <div
        >

            <div
                className={`flex   w-[100%] text-[10px] py-4 lg:w-[500px] rounded-xl shadow  bg-gradient-to-r from-[#BBD2C5] to-[#536976]`}
            >
                {/* HW - Gradient */}
                <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold text-gray-700">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                    <p >12</p>
                   
                </div>

                <div
                    className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}
                >
                    <TypeAnimation
                        sequence={[codeblock, 2000, ""]}
                        repeat={Infinity}
                        cursor={true}
                        omitDeletionAnimation={true}
                        style={{
                            whiteSpace: "pre-line",
                            display: "block",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CodeBlocks;
