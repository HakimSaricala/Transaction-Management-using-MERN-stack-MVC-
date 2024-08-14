import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function navbar() {
    const [activeLink, setActiveLink] = useState("/");
    const userinfo = JSON.parse(localStorage.getItem('user_info'));
    const handleLinkClick = (link) => {
        setActiveLink(link);
    };
    const handleLogout=()=>{
        localStorage.removeItem('user_info');
   
    }

    return (
        <> 
        <div className="flex justify-between items-center">
           

            <div className="drawer z-50 mt-3 select-none">
                
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="flex-none drawer-content ml-5 ">
                    <label htmlFor="my-drawer" className="btn bg-custom-green drawer-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                </div>

                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content">
                        <Link
                            className={`btn btn-ghost text-xl ${activeLink == "/" ? 'bg-custom-green' : ""}`}
                            to="/"
                            onClick={() => handleLinkClick("/")}
                            style={{ marginTop: "10px" }}
                        >
                            Home
                        </Link>
                        <Link
                            className={`btn btn-ghost text-xl ${activeLink == "/about" ? 'bg-custom-green' : ""}`}
                            to="/about"
                            onClick={() => handleLinkClick("/about")}
                            style={{ marginTop: "10px" }}
                        >
                            About
                        </Link>
                      
                        <Link
                                className={`btn btn-ghost text-xl bg-custom-green`} // Add bg-custom-green class here
                                to="/login"
                                onClick={() => handleLogout("/login")}
                                style={{ marginTop: "500px" }} // Adjust the margin value as needed
                            >
                                Logout
                        </Link>


                    </ul>
                </div>
            </div>

            <div className="flex-grow">
                <p className="font-bold text-xl mr-5 block whitespace-nowrap overflow-hidden overflow-ellipsis">Welcome {userinfo.name}!</p>
            </div>
        </div>
             
         
            
            <Outlet />
        </>
    );

}

export default navbar;