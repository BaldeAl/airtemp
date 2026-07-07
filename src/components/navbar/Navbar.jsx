import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/theme";
import { BsFillSunFill, BsMoon } from "react-icons/bs";
import { HiHeart, HiCalendar, HiMenu, HiX, HiShieldCheck, HiHome, HiClipboardList, HiChat } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from "next/router";

const Navbar = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setUser(localStorage.getItem("UserName"));
    setRole(localStorage.getItem("role"));

    // Auto-refresh role from server to handle promote_admin or role changes
    if (storedToken) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed");
          return res.json();
        })
        .then((data) => {
          if (data.user && data.user.role) {
            const serverRole = data.user.role;
            const localRole = localStorage.getItem("role");
            if (serverRole !== localRole) {
              localStorage.setItem("role", serverRole);
              setRole(serverRole);
            }
            if (data.user.name) {
              localStorage.setItem("UserName", data.user.name);
              setUser(data.user.name);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserName");
    localStorage.removeItem("favorites");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    router.push("/");
  };

  return (
    <nav
      className={`w-full sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#1A1A2E]/95 backdrop-blur-md shadow-cartoon"
          : "bg-white dark:bg-[#1A1A2E]"
      }`}
    >
      <div className="w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Link
            className="text-2xl font-extrabold text-[#2D3436] dark:text-white hover:opacity-80 transition-opacity"
            href="/"
          >
            Air<span className="text-[#FF6B6B]">Al</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <button
              id="theme-toggle"
              type="button"
              className="p-2.5 rounded-full text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <BsFillSunFill className="text-lg text-[#FFE66D]" />
              ) : (
                <BsMoon className="text-lg" />
              )}
            </button>

            {token ? (
              <>
                {role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                  >
                    <HiShieldCheck className="text-[#6C5CE7]" />
                    <span className="hidden lg:inline">Admin Dashboard</span>
                  </Link>
                )}

                {(role === "HOST" || role === "ADMIN") && (
                  <>
                    <Link
                      href="/host/places"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                    >
                      <HiHome className="text-[#0984E3]" />
                      <span className="hidden lg:inline">Manage Places</span>
                    </Link>
                    <Link
                      href="/host/bookings"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                    >
                      <HiClipboardList className="text-[#00B894]" />
                      <span className="hidden lg:inline">Guest Bookings</span>
                    </Link>
                  </>
                )}

                <Link
                  href="/favorites"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                >
                  <HiHeart className="text-[#FF6B6B]" />
                  <span className="hidden lg:inline">Favorites</span>
                </Link>

                <Link
                  href="/bookings"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                >
                  <HiCalendar className="text-[#4ECDC4]" />
                  <span className="hidden lg:inline">Bookings</span>
                </Link>

                <Link
                  href="/messages"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                >
                  <HiChat className="text-[#A29BFE]" />
                  <span className="hidden lg:inline">Messages</span>
                </Link>

                <Link
                  href="/Auth/me"
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                >
                  <FaRegUserCircle className="text-lg" />
                  <span className="hidden lg:inline">{user}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="ml-1 px-5 py-2 text-sm font-bold text-[#636E72] dark:text-[#B2BEC3] border-2 border-[#E8E8E4] dark:border-[#3D3D5C] rounded-full hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/Auth/login"
                className="btn-pill px-6 py-2.5 text-sm"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2.5 rounded-full text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8E8E4] dark:border-[#2D2D4A] animate-fade-in-up space-y-1">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
            >
              {theme === "dark" ? <BsFillSunFill className="text-[#FFE66D]" /> : <BsMoon />}
              <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            </button>

            {token ? (
              <>
                {role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                  >
                    <HiShieldCheck className="text-[#6C5CE7]" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                {(role === "HOST" || role === "ADMIN") && (
                  <>
                    <Link
                      href="/host/places"
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                    >
                      <HiHome className="text-[#0984E3]" />
                      <span>Manage Places</span>
                    </Link>
                    <Link
                      href="/host/bookings"
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                    >
                      <HiClipboardList className="text-[#00B894]" />
                      <span>Guest Bookings</span>
                    </Link>
                  </>
                )}

                <Link
                  href="/favorites"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                >
                  <HiHeart className="text-[#FF6B6B]" />
                  <span>Favorites</span>
                </Link>

                <Link
                  href="/bookings"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                >
                  <HiCalendar className="text-[#4ECDC4]" />
                  <span>Bookings</span>
                </Link>

                <Link
                  href="/messages"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                >
                  <HiChat className="text-[#A29BFE]" />
                  <span>Messages</span>
                </Link>

                <Link
                  href="/Auth/me"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#F0F0EC] dark:hover:bg-[#232340] transition-all"
                >
                  <FaRegUserCircle />
                  <span>Profile ({user})</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-3 text-sm font-bold text-[#FF6B6B] border-2 border-[#E8E8E4] dark:border-[#3D3D5C] rounded-2xl hover:bg-[#FFF0F0] dark:hover:bg-[#2D1A1A] transition-all text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/Auth/login"
                className="block w-full text-center btn-pill py-3 mt-2"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
