import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#1A1A2E] border-t border-[#E8E8E4] dark:border-[#2D2D4A] mt-auto">
      <div className="w-full mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link href="/" className="text-xl font-extrabold text-[#2D3436] dark:text-white">
          Air<span className="text-[#FF6B6B]">Al</span>
        </Link>
        <p className="text-sm text-[#B2BEC3]">
          © {new Date().getFullYear()} AirAl · Made with ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;
