import React from "react";

const HighlightText = ({ text }) => {
  return (
    <span className="font-bold text-blue-200">
      {" "}
      {/* Try to add gradient in the text */} {text}
    </span>
  );
};

export default HighlightText;