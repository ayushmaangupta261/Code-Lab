import { useRef } from "react"
import SignUp from "./components/Auth/SignUp"
import Template from "./components/Auth/Template"
import Navbar from "./components/Navbar/Navbar"
import { useDispatch, useSelector } from "react-redux"
import { setModal } from "./redux/slices/authSlice"
import Home from "./pages/Home"
import { Outlet } from "react-router-dom"



function App() {

  const modal = useSelector((state) => state.auth.modal);
  const dispatch = useDispatch();
  console.log("Modal value: ", modal);

  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      dispatch(setModal(false));
    }
  }

  return (

    <div ref={modalRef} onClick={closeModal} className="  bg-[#121212] ">

      <div className="fixed top-0 w-full z-10   ">
        <Navbar />
      </div>

      <div className="text-gray-100 flex w-full gap-x-3 pt-[2rem] pb-[2rem] h-full">
        <Outlet />
      </div>


    </div>
  )
}

export default App
 