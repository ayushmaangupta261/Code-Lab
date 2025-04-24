import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editInstituteDetails } from "../../../../services/operations/instituteApi.js";

const EditInstitute = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth).user;
  console.log("USer -> ", user);

  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);

  const handleAddSubject = async () => {
    if (subjectInput.trim() !== "") {
      // Split by commas, newlines or spaces
      const newSubjects = subjectInput
        .split(/[\n,]+/)
        .map((subj) => subj.trim())
        .filter((subj) => subj.length > 0);

      // Remove duplicates using Set
      const uniqueSubjects = Array.from(new Set([...subjects, ...newSubjects]));

      setSubjects(uniqueSubjects);
      setSubjectInput("");

      // Call backend to update
      await dispatch(editInstituteDetails(uniqueSubjects, user?.accessToken));
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-700 shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-4">Add Subjects</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
          placeholder="Enter subjects separated by commas "
          className="flex-1 px-3 py-2 border rounded text-black"
        />
        <button
          onClick={handleAddSubject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default EditInstitute;
