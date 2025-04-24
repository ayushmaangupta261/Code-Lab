import React, { useEffect, useState } from "react";
import {
  editDetails,
  getAllCollegeList,
} from "../../../../services/operations/instructorApi.js";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const dropdownVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};

const EditInstructor = () => {
  const user = useSelector((state) => state.auth).user;

  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "");
  const [college, setCollege] = useState(user?.collegeId?._id || "");
  const [subject, setSubject] = useState(user?.subject || "");
  const [collegeList, setCollegeList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  const [showCollegeList, setShowCollegeList] = useState(false);
  const [showSubjectList, setShowSubjectList] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await dispatch(getAllCollegeList(user.accessToken));
        if (res) setCollegeList(res);
      } catch (error) {
        console.error("Error fetching college list: ", error);
      }
    };
    fetchCollege();
  }, [dispatch, user.accessToken]);

  useEffect(() => {
    const selectedCollege = collegeList.find((clg) => clg._id === college);
    if (selectedCollege) {
      setSubjectsList(selectedCollege.subjects || []);
      if (!selectedCollege.subjects.includes(subject)) {
        setSubject("");
      }
    }
  }, [college, collegeList]);

  const toggleCollegeDropdown = () => {
    setShowCollegeList((prev) => !prev);
    setShowSubjectList(false);
  };

  const toggleSubjectDropdown = () => {
    if (subjectsList.length) {
      setShowSubjectList((prev) => !prev);
      setShowCollegeList(false);
    }
  };

  const handleSave = async () => {
    const data = { mobileNumber, college, subject };
    try {
      const response = await dispatch(editDetails(user.accessToken, data));
      if (response?.data?.success) {
        setMobileNumber("");
        setCollege("");
        setSubject("");
      }
    } catch (err) {
      console.error("Error updating instructor details:", err);
    }
  };

  return (
    <div className="p-6 w-[80%] mx-auto">
      <p className="text-2xl text-center font-semibold mb-6">
        Hey <span className="text-emerald-500">{user?.fullName}</span>, edit
        your profile
      </p>

      <div className="mt-6 flex flex-col gap-y-8 relative">
        <div className="flex items-center gap-x-5">
          <label className="font-medium">Email :</label>
          <p className="text-gray-200">{user?.email}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Mobile Number</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter mobile number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring focus:border-emerald-500"
          />
        </div>

        {/* College Dropdown */}
        <div className="relative">
          <label className="block font-medium mb-1">College</label>
          <div
            className="w-full px-4 py-2 border rounded-lg bg-white text-black flex justify-between items-center cursor-pointer hover:border-emerald-500"
            onClick={toggleCollegeDropdown}
          >
            {collegeList.find((c) => c._id === college)?.name ||
              "Select a college"}
            {showCollegeList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <AnimatePresence>
            {showCollegeList && (
              <motion.ul
                className="absolute bottom-full mb-2 w-full max-h-48 overflow-auto border border-gray-300 rounded-lg bg-white z-20 text-black shadow-lg"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
              >
                {collegeList.map((clg) => (
                  <li
                    key={clg._id}
                    className="px-4 py-2 hover:bg-emerald-100 transition-colors cursor-pointer border"
                    onClick={() => {
                      setCollege(clg._id);
                      setShowCollegeList(false);
                    }}
                  >
                    {clg.name}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Subject Dropdown */}
        <div className="relative">
          <label className="block font-medium mb-1">Subject</label>
          <div
            className={`w-full px-4 py-2 border rounded-lg bg-white text-black flex justify-between items-center cursor-pointer ${
              !subjectsList.length
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-emerald-500"
            }`}
            onClick={toggleSubjectDropdown}
          >
            {subject ||
              (subjectsList.length
                ? "Select a subject"
                : "Select a college first")}
            {showSubjectList ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>
          <AnimatePresence>
            {showSubjectList && subjectsList.length > 0 && (
              <motion.ul
                className="absolute bottom-full mb-2 w-full max-h-48 overflow-auto border border-gray-300 rounded-lg bg-white z-20 text-black shadow-lg"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
              >
                {subjectsList.map((subj, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-emerald-100 transition-colors cursor-pointer border"
                    onClick={() => {
                      setSubject(subj);
                      setShowSubjectList(false);
                    }}
                  >
                    {subj}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleSave}
          className="bg-emerald-500 font-semibold text-black px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors self-start"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditInstructor;
