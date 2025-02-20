import ACCOUNT_TYPE from "../AccountType";

export const DashboardLinks =[
  
    {
        id:1,
        name:"Dashboard",
        path:"/dashboard",
        // type:ACCOUNT_TYPE.STUDENT,
        // icon:"VscMortarBoard"
    },
    {
        id:2,
        name:"Projects",
        path:"/dashboard/Projects",
        type:ACCOUNT_TYPE.STUDENT,
        // icon:"VscDashboard"
    },
    {
        id:3,
        name:"Assignments",
        path:"/dashboard/assignments",
        type:ACCOUNT_TYPE.STUDENT,
        // icon:"VscVm"
    },
    {
        id:4,
        name:"Assignments",
        path:"/dashboard/assignment-given",
        type:ACCOUNT_TYPE.INSTRUCTOR,
        // icon:"VscAdd"
    },
    {
        id:5,
        name:"Notification",
        path:"/dashboard/notification",
        // icon:"VscAccount"
    },
    {
        id:6,
        name:"Jobs",
        path:"/dashboard/jobs",
        type:ACCOUNT_TYPE.STUDENT,
        // icon:"VscHistory"
    },
    {
        id:7,
        name:"Jobs Applies",
        path:"/dashboard/job-applies",
        type:ACCOUNT_TYPE.STUDENT,
        // icon:"VscHistory"
    },
    {
        id:8,
        name:"Job Updates",
        path:"/dashboard/job-updates",
        type:ACCOUNT_TYPE.STUDENT,
        // icon:"VscHistory"
    },
    {
        id:9,
        name:"Daily Schedule",
        path:"/dashboard/daily-schedule",
        type:ACCOUNT_TYPE.STUDENT,
        // icon:"VscHistory"
    },
    {
        id:10,
        name:"Settings",
        path:"/dashboard/settings",
        // type:ACCOUNT_TYPE.STUDENT,
        // icon:"VscHistory"
    },
];