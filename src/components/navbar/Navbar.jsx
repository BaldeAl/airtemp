import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/theme";
import { BsFillSunFill, BsMoon } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [token, setToken] = useState("");
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <nav>
      <div>
        <div className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
          <header className="flex items-center justify-between w-full max-w-4xl px-4 py-8 mx-auto">
            <Link className="text-3xl font-bold text-slate-900 dark:text-slate-200" href={"/"}>
              Airwo
            </Link>
            <div className="flex items-center gap-4">
              <button
                id="theme-toggle"
                type="button"
                className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <BsFillSunFill /> : <BsMoon />}
              </button>

              {token ? (
                <>
                  <Link href={`/Auth/me`}>
                    
                      <FaRegUserCircle />
                    
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <Link href={`/Auth/login/`} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700">
                   Login
                  
                </Link>
              )}
            </div>
          </header>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
