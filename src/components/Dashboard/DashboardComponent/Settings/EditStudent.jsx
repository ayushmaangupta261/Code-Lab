import React, { useEffect, useState } from "react";
import { editStudentDetails, getAllCollegeListForStudent } from "../../../../services/operations/studentApi";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const dropdownVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};

const EditStudent = () => {
  const user = useSelector((state) => state.auth)?.user;

  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber);
  const [college, setCollege] = useState(""); // _id
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState(""); // _id
  const [teacherName, setTeacherName] = useState("");
  const [collegeList, setCollegeList] = useState([]);

  const [showCollegeList, setShowCollegeList] = useState(false);
  const [showSubjectList, setShowSubjectList] = useState(false);
  const [showTeacherList, setShowTeacherList] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setMobileNumber(user?.mobileNumber || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchColleges = async () => {
      const colleges = await dispatch(getAllCollegeListForStudent(user?.accessToken));
      setCollegeList(colleges);
    };

    if (user?.accessToken) {
      fetchColleges();
    }
  }, [dispatch, user?.accessToken]);

  const toggleCollegeDropdown = () => {
    setShowCollegeList((prev) => !prev);
    setShowSubjectList(false);
    setShowTeacherList(false);
  };

  const toggleSubjectDropdown = () => {
    setShowSubjectList((prev) => !prev);
    setShowCollegeList(false);
    setShowTeacherList(false);
  };

  const toggleTeacherDropdown = () => {
    setShowTeacherList((prev) => !prev);
    setShowCollegeList(false);
    setShowSubjectList(false);
  };

  const handleSave = async () => {
    const data = { mobileNumber, college, subject, teacher };

    const response = await dispatch(editStudentDetails(data, user.accessToken));

    if (response?.data?.success) {
      setMobileNumber("");
      setCollege("");
      setSubject("");
      setTeacher("");
      setTeacherName("");
    }
  };

  return (
    <div className="p-6 w-[80%] mx-auto">
      <p className="text-2xl text-center font-semibold mb-6">
        Hey <span className="text-emerald-500">{user?.fullName}</span>, edit your profile
      </p>

      <div className="mt-6 flex flex-col gap-y-8 relative">
        {/* Mobile Number */}
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
            {collegeList.find((c) => c._id === college)?.name || "Select a college"}
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
                      setSubject("");
                      setTeacher("");
                      setTeacherName("");
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
        {college && (
          <div className="relative">
            <label className="block font-medium mb-1">Subject</label>
            <div
              className="w-full px-4 py-2 border rounded-lg bg-white text-black flex justify-between items-center cursor-pointer hover:border-emerald-500"
              onClick={toggleSubjectDropdown}
            >
              {subject || "Select a subject"}
              {showSubjectList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            <AnimatePresence>
              {showSubjectList && (
                <motion.ul
                  className="absolute bottom-full mb-2 w-full max-h-48 overflow-auto border border-gray-300 rounded-lg bg-white z-20 text-black shadow-lg"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  {collegeList
                    .find((clg) => clg._id === college)
                    ?.subjects?.map((subj, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-emerald-100 transition-colors cursor-pointer border"
                        onClick={() => {
                          setSubject(subj);
                          setShowSubjectList(false);
                          setTeacher("");
                          setTeacherName("");
                        }}
                      >
                        {subj}
                      </li>
                    ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Teacher Dropdown */}
        {subject && (
          <div className="relative">
            <label className="block font-medium mb-1">Teacher</label>
            <div
              className="w-full px-4 py-2 border rounded-lg bg-white text-black flex justify-between items-center cursor-pointer hover:border-emerald-500"
              onClick={toggleTeacherDropdown}
            >
              {teacherName || "Select a teacher"}
              {showTeacherList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            <AnimatePresence>
              {showTeacherList && (
                <motion.ul
                  className="absolute bottom-full mb-2 w-full max-h-48 overflow-auto border border-gray-300 rounded-lg bg-white z-20 text-black shadow-lg"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  {collegeList
                    .find((clg) => clg._id === college)
                    ?.instructorsPresent?.filter((inst) => inst.subject === subject)
                    ?.map((inst) => (
                      <li
                        key={inst._id}
                        className="px-4 py-2 hover:bg-emerald-100 transition-colors cursor-pointer border"
                        onClick={() => {
                          setTeacher(inst._id);
                          setTeacherName(inst.fullName);
                          setShowTeacherList(false);
                        }}
                      >
                        {inst.fullName}
                      </li>
                    ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Save Button */}
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

export default EditStudent;
