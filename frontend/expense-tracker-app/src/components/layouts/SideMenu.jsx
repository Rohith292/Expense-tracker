import React, { useContext } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../Cards/CharAvatar';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === "logout") {
            console.log("Logout button clicked.");
            handleLogout();
            return;
        }
        console.log("Navigating to route:", route);
        navigate(route);
    };

    const handleLogout = () => {
        console.log("Clearing user data and navigating to login.");
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    console.log("User context data:", user);
    console.log("SIDE_MENU_DATA:", SIDE_MENU_DATA);

    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20'>
            <div className='flex flex-col items-center justify-center gap-3 mt-3 mb-7'>
                {user?.profileImageUrl ? (
                    <>
                        <img 
                            src={user?.profileImageUrl || ""}
                            alt="User profile"
                            className='w-20 h-20 bg-slate-400 rounded-full'
                            onError={(e) => (e.target.style.display = "none")} 
                        />
                        {console.log("Profile image displayed:", user?.profileImageUrl)}
                    </>
                ) : (
                    <>
                        {console.log("Using CharAvatar fallback for user:", user?.fullName || "Guest User")}
                        <CharAvatar
                            fullName={user?.fullName || "Guest User"}
                            width="w-20"
                            height="h-20"
                            style="text-2xl"
                        />
                    </>
                )}

                <h5 className='text-gray-950 font-medium leading-6'>
                    {console.log("Displaying user name:", user?.fullName || "Guest User")}
                    {user?.fullName || "Guest User"}
                </h5>
            </div>

            {SIDE_MENU_DATA.map((item, index) => (
                <>
                    {console.log(`Rendering menu item: ${item.label} with path: ${item.path}`)}
                    <button 
                        key={`menu_${index}`} 
                        aria-label={`Navigate to ${item.label}`}
                        className={`w-full flex items-center gap-4 text-[15px] ${
                            activeMenu == item.label ? "text-white bg-primary" : ""
                        } py-3 px-6 rounded-lg mb-3`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className='text-xl' />
                        {item.label}
                    </button>
                </>
            ))}
        </div>
    );
};

export default SideMenu;
