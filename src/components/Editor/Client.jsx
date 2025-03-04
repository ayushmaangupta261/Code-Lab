import React from "react";
import { useLocation } from "react-router";

const Client = ({userName}) => {
//   const location = useLocation();
//   const userName = location.state?.userName || "Guest"; // Default value if undefined

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;

  return (
    <div className="client flex flex-col justify-center items-center mt-3">
      <img src={avatarUrl}  className="rounded-xl w-[4rem]" />
      <span className=" overflow-hidden text-ellipsis  whitespace-nowrap  px-2 py-1">
        {userName}
      </span>
    </div>
  );
};

export default Client;
