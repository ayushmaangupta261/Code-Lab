
import React from 'react'
import * as Icons from "react-icons/vsc"
import { useDispatch } from 'react-redux';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';


const SidebarLink = ({ link, iconName }) => {

    // const Icon = Icons[iconName];
    // console.log(Icon)
    console.log("Link - > ", link.path)

    const dispatch = useDispatch();
    const location = useLocation();

    const matchRoute = (route) => {
        // console.log("Loaction -> ", location)
        // console.log("Route -> ", route)
        const res = matchPath(location.pathname, route);
        // console.log("Match route res -> ", res);
        return res;
    }

    return (
        <Link
            to={link.path}
            // className={`relative px-[0.5rem]  py-2 text-sm  font-medium text-center  ${matchRoute(link.path) ? "bg-yellow-25 text-black rounded-lg" : "bg-opacity-0"}`}
        >
            
            {/* <span className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-25 max-[860px]:hidden  ${matchRoute(link.path) ? "opacity-100" :
                "opacity-0"}`}></span> */}

            <div className={`relative px-[0.5rem]  py-2 text-sm  font-medium   ${matchRoute(link.path) ? "text-amber-300 rounded-lg" : "bg-opacity-0"}`}>
                {/* <Icon className="text-lg" /> */}
                <span>{link.name}</span>

            </div>

        </Link >
    )
}

export default SidebarLink
