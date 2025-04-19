import React, { use } from "react";
import { useSelector } from "react-redux";

export const Overview = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("user in overview -> ", user);

  return (
    <div>
      {/* For institute */}
      <div>
        {user.accountType === "Institute" && (
          <div>
            <p>{user?.fullName}</p>
            <div>
              <p>
                This is your college id share it with your students and teachers{" "}
              </p>
              <div className="flex items-center gap-x-5">
                <span className="bg-gray-200 text-black px-2 py-1 rounded-md">
                  {user?._id}
                </span>
                <button className="bg-amber-300 px-2 py-1 text-black rounded-md hover">
                  copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------------------------------------------------- */}

      {/* For Student */}
      <div>
        {/*  */}
      </div>
      
    </div>
  );
};
