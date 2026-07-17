import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useTranslation } from "../../lib/i18n/LanguageContext";

const HeroBanner = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF5F5] via-[#FAFAF8] to-[#F0FFFE] dark:from-[#1A1A2E] dark:via-[#1F1F3A] dark:to-[#1A2A2E] py-16 sm:py-20 md:py-28 px-4">
      <div className="absolute top-10 right-10 w-20 h-20 bg-[#FFE66D]/20 rounded-full blur-xl animate-bounce-soft hidden sm:block" />
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-[#4ECDC4]/15 rounded-full blur-xl animate-bounce-soft hidden sm:block" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="animate-fade-in-up">
          <span className="inline-block text-4xl sm:text-5xl mb-4">🏡</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2D3436] dark:text-white mb-4 animate-fade-in-up stagger-1 leading-tight">
          {t("hero.title1")}{" "}
          <span className="text-[#FF6B6B]">{t("hero.title2")}</span>
        </h1>

        <p className="text-base sm:text-lg text-[#636E72] dark:text-[#B2BEC3] mb-8 sm:mb-10 animate-fade-in-up stagger-2 max-w-xl mx-auto px-4">
          {t("hero.subtitle")}
        </p>

        <form onSubmit={handleSearch} className="animate-fade-in-up stagger-3 px-2">
          <div className="flex items-center max-w-xl mx-auto bg-white dark:bg-[#232340] rounded-full shadow-cartoon p-1.5 sm:p-2 border border-[#E8E8E4] dark:border-[#3D3D5C]">
            <BsSearch className="text-[#B2BEC3] ml-3 sm:ml-4 text-lg flex-shrink-0" />
            <input
              type="text"
              placeholder={t("hero.searchPlaceholder")}
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="flex-1 bg-transparent border-none outline-none px-3 sm:px-4 py-2.5 sm:py-3 text-[#2D3436] dark:text-white placeholder-[#B2BEC3] text-sm sm:text-base font-medium"
            />
            <button
              type="submit"
              className="btn-pill px-4 sm:px-6 py-2.5 text-sm flex-shrink-0"
            >
              {t("hero.search")}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-10 sm:mt-12 animate-fade-in-up stagger-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">100+</div>
            <div className="text-xs sm:text-sm text-[#B2BEC3] font-medium">{t("hero.properties")}</div>
          </div>
          <div className="w-px h-8 bg-[#E8E8E4] dark:bg-[#3D3D5C]" />
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-extrabold text-[#2D3436] dark:text-white">50+</div>
            <div className="text-xs sm:text-sm text-[#B2BEC3] font-medium">{t("hero.cities")}</div>
          </div>
          <div className="w-px h-8 bg-[#E8E8E4] dark:bg-[#3D3D5C]" />
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-extrabold text-[#FF6B6B]">4.8</div>
            <div className="text-xs sm:text-sm text-[#B2BEC3] font-medium">{t("hero.avgRating")}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
