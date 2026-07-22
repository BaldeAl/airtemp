import { useState } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useTranslation } from "../../lib/i18n/LanguageContext";

const ImageGallery = ({ images, name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useTranslation();

  if (!images || images.length === 0) return null;

  const goTo = (index) => {
    setCurrentIndex(index);
  };

  const goPrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden group shadow-cartoon">
        <div className="relative aspect-[16/9] md:aspect-[2/1] overflow-hidden bg-[#F0F0EC] dark:bg-[#232340]">
          <Image
            src={images[currentIndex]}
            alt={`${name} - Photo ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>

        <button
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 dark:bg-[#232340]/90 text-[#2D3436] dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-cartoon"
        >
          <HiChevronLeft className="text-xl" />
        </button>

        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 dark:bg-[#232340]/90 text-[#2D3436] dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-cartoon"
        >
          <HiChevronRight className="text-xl" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#232340]/90 text-[#2D3436] dark:text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-all hover:shadow-cartoon"
        >
          {t("gallery.showAllPhotos")}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-2">
        {images.slice(0, 4).map((img, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
              i === currentIndex
                ? "ring-3 ring-[#FF6B6B] ring-offset-2 ring-offset-[#FAFAF8] dark:ring-offset-[#1A1A2E]"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt={`${name} thumbnail ${i + 1}`}
              fill
              className="object-cover"
              sizes="200px"
            />
          </button>
        ))}
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-[#FF6B6B] z-50 transition-colors"
          >
            ✕
          </button>
          <button
            onClick={goPrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <HiChevronLeft className="text-2xl sm:text-3xl" />
          </button>
          <div
            className="relative w-full max-w-4xl aspect-[16/10] mx-4 sm:mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`${name} - Photo ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            onClick={goNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <HiChevronRight className="text-2xl sm:text-3xl" />
          </button>
          <div className="absolute bottom-8 text-white text-sm font-bold">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
