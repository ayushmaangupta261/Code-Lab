import React from "react";
import { useSelector } from "react-redux";
import  InstituteOverview  from "./Overview/InstituteOverview";
import  StudentOverview  from "./Overview/StudentOverview";
import InstructorOverview from "./Overview/InstructorOverview";

const Overview = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-full h-full p-10">
      {user?.accountType === "Institute" && <InstituteOverview />}

      {user?.accountType === "Student" && <StudentOverview />}

      {user?.accountType === "Instructor" && <InstructorOverview />}
    </div>
  );
};

export default Overview;
