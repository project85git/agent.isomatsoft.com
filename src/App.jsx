import { useEffect, useState } from "react";
import "./App.css";
import AllRoute from "./allroute/AllRoute";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./component/Sidebar";
import TopNavbar from "./component/TopNavbar";
import { useDispatch, useSelector } from "react-redux";
import Show from "./component/genralComponent/show";
import AdminPanel from "./component/extraForShort/AdminPanel";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const currentPath = location.pathname;
  const { color,primaryBg,secondaryBg, bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
const navigate=useNavigate()
const getAdminDetails = JSON.parse(localStorage.getItem("adminauth"));
const sidebarVisible = useSelector(state => state.theme.sidebarVisible);
const dispatch = useDispatch();
  useEffect(() => {
    // Check if the user is not on the login page before checking the token
    if (currentPath !== "/login") {
      if (!getAdminDetails || !getAdminDetails?.token) {
        // Redirect to login page if user is not authenticated
        navigate("/login");
      }
     
    }
  }, [currentPath, navigate]);
  

  return (
    <div className="w-[100%] overflow-hidden">
      <Show when={currentPath === "/login" ||currentPath==="/signup"} secondValue={
         <div style={{backgroundColor:secondaryBg}} className={`flex w-[100%] min-h-[100vh] `}>
          <div className="fixed z-50  top-0">
            <div className="hidden lg:contents">
            {/* <Sidebar
            /> */}
            </div>

          </div>
          <div className="flex flex-col w-[100%] gap-4">
            <div className=" fixed top-0 w-[100%] z-10 bg-white ">
              {" "}
              <TopNavbar />
            </div>

            <div className="w-[100%] md:mt-[20px] gap-4 ">
               <AdminPanel/>
              {/* </div> */}
            </div>
          </div>
        </div>}>
        <AllRoute></AllRoute>
     
      </Show>
     
    </div>
  );
}

export default App;



