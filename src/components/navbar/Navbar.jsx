import Link from "next/link";
import React, { useContext } from "react";
import {ThemeContext } from '../context/theme'
import {UserContext } from '../context/UserContext'
const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const {user, setUser } = useContext(UserContext)
     const handleLogout = () => {
    // Implement your logout logic here...
    setUser(null); // Clear user from context when logout
  }; 
    return (
        <nav >
        <div className="__className_0ec1f4">
            <div className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
              <header className="flex items-center justify-between w-full max-w-4xl px-4 py-8 mx-auto">
                <Link className="text-3xl font-bold text-slate-900 dark:text-slate-200" href="/">Airwo</Link>
                <div className="flex items-center gap-4">
                    <button type="button" onClick={toggleTheme} className="p-1 text-slate-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none">
{/*                         <span className="sr-only">
                        

                            <div id="extwaiokist" v="fcoon" q="d31d8581" c="511.8" 
                            i="518" u="42.51" s="05022301" sg="svr_04262315-ga_05022301-bai_04242318"
                            d="1" w="false" e="true" a="2"m="BMe=" vn="3gtra" >
                                
                                <div id="extwaigglbit" v="fcoon" q="d31d8581"
                                 c="511.8" i="518" u="42.51" s="05022301" sg="svr_04262315-ga_05022301-bai_04242318" 
                                 d="1" w="false" e="" a="2" m="BMe=">

                                 </div>


                            </div>

                        </span> */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path className="text-slate-200" strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z">

                            </path>
                        </svg>
                        
                    </button>
                   
                    {
                        user ?
                               ( 
                                 <Link href={`/Auth/me`}>
                                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path stroke-linecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </Link>,
                                 <button onClick={handleLogout}>Logout</button> ): 
                                 <Link href={`/Auth/login/`}>
                        <span className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700">
                            Login
                        </span>
                    </Link>}
                    
                </div>

              </header>
            </div>
        </div>
        </nav>
    );
}
 
export default Navbar;