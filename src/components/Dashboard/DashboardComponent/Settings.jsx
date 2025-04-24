import React from "react";
import { useSelector } from "react-redux";
import EditInstructor from "./Settings/EditInstructor";
import EditStudent from "./Settings/EditStudent";
import EditInstitute from "./Settings/EditInstitute";

const Settings = () => {
  const user = useSelector((state) => state.auth).user;
  console.log("User -> ", user);

  return (
    <div>
      {/* User */}
      <div> {user?.accountType === "Student" && <EditStudent />}</div>

      {/* ---------------------------------------------------------------------------------------------------------------------------------- */}

      {/* Instructor */}
      <div>
        {" "}
        {user?.accountType === "Instructor" && <EditInstructor user={user} />}
      </div>

      {/* ---------------------------------------------------------------------------------------------------------------------------------- */}

      {/* Instructor */}
      <div> {user?.accountType === "Institute" && <EditInstitute />}</div>
    </div>
  );
};

export default Settings;
