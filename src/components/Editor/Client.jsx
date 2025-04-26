// import React from "react";
// import { useLocation } from "react-router";

// const Client = ({ email }) => {
//   //   const location = useLocation();
//   //   const email = location.state?.email || "Guest"; // Default value if undefined
//   console.log(`Client email: ${email}`);
  

//   const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${email}`;

//   return (
//     <div className="client flex flex-col justify-center items-center mt-3">
//       <img src={avatarUrl} className="rounded-xl w-[4rem]" />
//       <span className="overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1">
//         {email?.split(/\s+/).slice(0, 7).join(" ") +
//           (email?.split(/\s+/).length > 7 ? "..." : "")}
//       </span>
//     </div>
//   );
// };

// export default Client;


import React from "react";

const Client = ({ email }) => {
  console.log(`Client email: ${email}`);

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${email}`;

  return (
    <div className="client flex flex-col justify-center items-center mt-3">
      <img src={avatarUrl} className="rounded-xl w-[4rem]" alt="avatar" />
      <span className="overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1">
        {email?.slice(0, 10) + (email?.length > 10 ? "..." : "")}
      </span>
    </div>
  );
};

export default Client;
