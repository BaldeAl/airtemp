import Link from "next/link";
import { HiHeart, HiCode } from "react-icons/hi";
import { useTranslation } from "../../lib/i18n/LanguageContext";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[#FAFAF8] dark:bg-[#1A1A2E] border-t border-[#E8E8E4] dark:border-[#2D2D4A] mt-auto">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-extrabold text-[#2D3436] dark:text-white">
            Air<span className="text-[#FF6B6B]">Al</span>
          </Link>
          <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] leading-relaxed max-w-xs">
            {t("footer.description")}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-extrabold text-[#2D3436] dark:text-white uppercase tracking-wider mb-4">{t("footer.support")}</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/help" className="text-sm text-[#636E72] dark:text-[#B2BEC3] hover:text-[#4ECDC4] dark:hover:text-[#4ECDC4] transition-colors">{t("footer.helpCenter")}</Link>
            </li>
            <li>
              <Link href="/safety" className="text-sm text-[#636E72] dark:text-[#B2BEC3] hover:text-[#4ECDC4] dark:hover:text-[#4ECDC4] transition-colors">{t("footer.safetyInfo")}</Link>
            </li>
            <li>
              <Link href="/cancellation" className="text-sm text-[#636E72] dark:text-[#B2BEC3] hover:text-[#4ECDC4] dark:hover:text-[#4ECDC4] transition-colors">{t("footer.cancellationOptions")}</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-[#2D3436] dark:text-white uppercase tracking-wider mb-4">{t("footer.hosting")}</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/host/places" className="text-sm text-[#636E72] dark:text-[#B2BEC3] hover:text-[#FF6B6B] dark:hover:text-[#FF6B6B] transition-colors">{t("footer.manageListings")}</Link>
            </li>
            <li>
              <Link href="/host/bookings" className="text-sm text-[#636E72] dark:text-[#B2BEC3] hover:text-[#FF6B6B] dark:hover:text-[#FF6B6B] transition-colors">{t("footer.guestBookings")}</Link>
            </li>
            <li>
              <Link href="/host/resources" className="text-sm text-[#636E72] dark:text-[#B2BEC3] hover:text-[#FF6B6B] dark:hover:text-[#FF6B6B] transition-colors">{t("footer.hostingResources")}</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-[#2D3436] dark:text-white uppercase tracking-wider mb-4">AirAl</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/about" className="text-sm text-[#636E72] dark:text-[#B2BEC3] hover:text-[#A29BFE] dark:hover:text-[#A29BFE] transition-colors">{t("footer.aboutUs")}</Link>
            </li>
            <li>
              <Link href="/careers" className="text-sm text-[#636E72] dark:text-[#B2BEC3] hover:text-[#A29BFE] dark:hover:text-[#A29BFE] transition-colors">{t("footer.careers")}</Link>
            </li>
            <li>
              <Link href="/investors" className="text-sm text-[#636E72] dark:text-[#B2BEC3] hover:text-[#A29BFE] dark:hover:text-[#A29BFE] transition-colors">{t("footer.investors")}</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 border-t border-[#E8E8E4] dark:border-[#2D2D4A] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#B2BEC3] flex items-center gap-1">
          © {new Date().getFullYear()} AirAl, Inc. {t("footer.allRightsReserved")}
        </p>
        <div className="flex items-center gap-4 text-sm text-[#636E72] dark:text-[#B2BEC3]">
          <Link href="/terms" className="hover:text-[#2D3436] dark:hover:text-white transition-colors">{t("footer.terms")}</Link>
          <span className="text-[#E8E8E4] dark:text-[#2D2D4A]">·</span>
          <Link href="/privacy" className="hover:text-[#2D3436] dark:hover:text-white transition-colors">{t("footer.privacy")}</Link>
          <span className="text-[#E8E8E4] dark:text-[#2D2D4A]">·</span>
          <Link href="/sitemap" className="hover:text-[#2D3436] dark:hover:text-white transition-colors">{t("footer.sitemap")}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
