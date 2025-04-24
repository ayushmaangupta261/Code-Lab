import ACCOUNT_TYPE from "../AccountType";

export const DashboardLinks = [
  {
    id: 1,
    name: "Overview",
    path: "/dashboard/overview",
    // type:ACCOUNT_TYPE.STUDENT,
    // icon:"VscMortarBoard"
  },
  {
    id: 2,
    name: "Projects",
    path: "/dashboard/Projects",
    type: ACCOUNT_TYPE.STUDENT,
    // icon:"VscDashboard"
  },
  {
    id: 3,
    name: "Assignments",
    path: "/dashboard/assignments",
    type: ACCOUNT_TYPE.STUDENT,
    // icon:"VscVm"
  },
  {
    id: 7,
    name: "Questions Solved",
    path: "/dashboard/questions-Solved",
    type: ACCOUNT_TYPE.STUDENT,
    // icon:"VscHistory"
  },
  {
    id: 4,
    name: "Create Question",
    path: "/dashboard/create-question",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    // icon:"VscAdd"
  },
  // {
  //   id: 5,
  //   name: "Notification",
  //   path: "/dashboard/notification",
  //   type: ACCOUNT_TYPE.STUDENT,
  //   // icon:"VscAccount"
  // },
  // {
  //   id: 6,
  //   name: "Jobs",
  //   path: "/dashboard/jobs",
  //   type: ACCOUNT_TYPE.STUDENT,
  //   // icon:"VscHistory"
  // },

  // {
  //   id: 8,
  //   name: "Job Updates",
  //   path: "/dashboard/job-updates",
  //   type: ACCOUNT_TYPE.STUDENT,
  //   // icon:"VscHistory"
  // },
  // {
  //   id: 9,
  //   name: "Daily Schedule",
  //   path: "/dashboard/daily-schedule",
  //   type: ACCOUNT_TYPE.STUDENT,
  //   // icon:"VscHistory"
  // },
  {
    id: 10,
    name: "Settings",
    path: "/dashboard/settings",
    // type:ACCOUNT_TYPE.STUDENT,
    // icon:"VscHistory"
  },
  {
    id: 11,
    // name:"Settings",
    path: "view-solved-questions",
    // type:ACCOUNT_TYPE.STUDENT,
    // icon:"VscHistory"
  },
];
