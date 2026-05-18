import Navbar from "./navbar/Navbar";
import Footer from "./home/Footer";

const Layout = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex flex-col antialiased bg-[#FAFAF8] text-[#2D3436] dark:bg-[#1A1A2E] dark:text-[#E8E8E4]">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
