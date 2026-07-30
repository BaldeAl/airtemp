import { useState, useEffect, useRef, useMemo } from "react";
import Place from "./Place";
import Loading from "../loading/Loading";
import Categories from "../home/Categories";
import FilterPanel from "../filters/FilterPanel";
import { useTranslation } from "../../lib/i18n/LanguageContext";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const ITEMS_PER_PAGE = 12;

const FALLBACK_PLACES = [
  {
    place_id: "fb1",
    name: "Sunny Beachfront Villa",
    category: "Beach",
    image: "https://picsum.photos/seed/beach1/800/600",
    city: { name: "Malibu" },
    priceByNight: 250,
    numberOfRooms: 3,
    maxGuests: 6,
    Review: [{ rating: 5 }, { rating: 4 }],
  },
  {
    place_id: "fb2",
    name: "Cozy Mountain Cabin",
    category: "Mountain",
    image: "https://picsum.photos/seed/mountain1/800/600",
    city: { name: "Aspen" },
    priceByNight: 150,
    numberOfRooms: 2,
    maxGuests: 4,
    Review: [{ rating: 4 }, { rating: 4 }],
  },
  {
    place_id: "fb3",
    name: "Downtown Penthouse",
    category: "City",
    image: "https://picsum.photos/seed/city1/800/600",
    city: { name: "New York" },
    priceByNight: 400,
    numberOfRooms: 2,
    maxGuests: 4,
    Review: [{ rating: 5 }],
  },
  {
    place_id: "fb4",
    name: "Rustic Farmhouse",
    category: "Countryside",
    image: "https://picsum.photos/seed/country1/800/600",
    city: { name: "Tuscany" },
    priceByNight: 120,
    numberOfRooms: 4,
    maxGuests: 8,
    Review: [{ rating: 5 }, { rating: 5 }],
  },
  {
    place_id: "fb5",
    name: "Luxury Villa",
    category: "Luxury",
    image: "https://picsum.photos/seed/luxury1/800/600",
    city: { name: "Ibiza" },
    priceByNight: 800,
    numberOfRooms: 5,
    maxGuests: 10,
    Review: [{ rating: 5 }, { rating: 5 }],
  },
  {
    place_id: "fb6",
    name: "Tropical Treehouse",
    category: "Tropical",
    image: "https://picsum.photos/seed/tropical1/800/600",
    city: { name: "Bali" },
    priceByNight: 90,
    numberOfRooms: 1,
    maxGuests: 2,
    Review: [{ rating: 4 }, { rating: 5 }],
  },
  {
    place_id: "fb7",
    name: "Lakefront Lodge",
    category: "Lakefront",
    image: "https://picsum.photos/seed/lake1/800/600",
    city: { name: "Lake Tahoe" },
    priceByNight: 200,
    numberOfRooms: 3,
    maxGuests: 6,
    Review: [{ rating: 4 }],
  },
  {
    place_id: "fb8",
    name: "Ski-in/Ski-out Chalet",
    category: "Ski",
    image: "https://picsum.photos/seed/ski1/800/600",
    city: { name: "Chamonix" },
    priceByNight: 300,
    numberOfRooms: 4,
    maxGuests: 8,
    Review: [{ rating: 5 }],
  },
  {
    place_id: "fb9",
    name: "Desert Oasis Resort",
    category: "Desert",
    image: "https://picsum.photos/seed/desert1/800/600",
    city: { name: "Dubai" },
    priceByNight: 500,
    numberOfRooms: 2,
    maxGuests: 4,
    Review: [{ rating: 4 }, { rating: 3 }],
  },
  {
    place_id: "fb10",
    name: "Historic Castle",
    category: "Historic",
    image: "https://picsum.photos/seed/historic1/800/600",
    city: { name: "Edinburgh" },
    priceByNight: 350,
    numberOfRooms: 5,
    maxGuests: 10,
    Review: [{ rating: 5 }, { rating: 5 }],
  },
];

const Places = ({ searchValue = "" }) => {
  const [places, setPlaces] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    minRooms: 0,
    minGuests: 0,
  });
  const { t } = useTranslation();
  const gridRef = useRef(null);

  useEffect(() => {
    fetch(`/api/places/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setPlaces(data);
        } else {
          setPlaces(FALLBACK_PLACES);
        }
      })
      .catch((err) => {
        console.error("Database fetch failed, using fallback places:", err);
        setPlaces(FALLBACK_PLACES);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, activeCategory, filters]);

  const filteredPlaces = useMemo(() => {
    if (!places) return [];
    return places.filter((place) => {
      const matchesSearch =
        !searchValue ||
        place.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        place.city.name.toLowerCase().includes(searchValue.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || place.category === activeCategory;

      const matchesPrice =
        place.priceByNight >= filters.minPrice &&
        place.priceByNight <= filters.maxPrice;

      const matchesRooms = place.numberOfRooms >= filters.minRooms;
      const matchesGuests = place.maxGuests >= filters.minGuests;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRooms &&
        matchesGuests
      );
    });
  }, [places, searchValue, activeCategory, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredPlaces.length);
  const paginatedPlaces = filteredPlaces.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (safePage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (safePage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (!places) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <div className="sticky top-16 z-20 bg-[#FAFAF8]/90 dark:bg-[#1A1A2E]/90 backdrop-blur-md -mx-4 px-4 py-3 border-b border-[#E8E8E4] dark:border-[#2D2D4A]">
        <Categories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] font-medium">
            <span className="font-extrabold text-[#2D3436] dark:text-white">
              {filteredPlaces.length}
            </span>{" "}
            {filteredPlaces.length !== 1
              ? t("places.places")
              : t("places.place")}{" "}
            {t("places.found")}
          </p>
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </div>
      </div>

      {filteredPlaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-2">
            {t("places.noPlacesFound")}
          </h3>
          <p className="text-[#636E72] dark:text-[#B2BEC3] text-center max-w-md text-sm">
            {t("places.noPlacesHint")}
          </p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setFilters({
                minPrice: 0,
                maxPrice: 1000,
                minRooms: 0,
                minGuests: 0,
              });
            }}
            className="mt-6 btn-pill px-8 py-3"
          >
            {t("places.resetFilters")}
          </button>
        </div>
      ) : (
        <>
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6"
          >
            {paginatedPlaces.map((place, i) => (
              <Place key={place.place_id || place.id} place={place} index={i} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 mb-2 animate-fade-in">
              <p className="text-center text-sm text-[#636E72] dark:text-[#B2BEC3] mb-4 font-medium">
                {t("places.showing")}{" "}
                <span className="font-extrabold text-[#2D3436] dark:text-white">
                  {startIndex + 1}
                </span>{" "}
                {t("places.to")}{" "}
                <span className="font-extrabold text-[#2D3436] dark:text-white">
                  {endIndex}
                </span>{" "}
                {t("places.of")}{" "}
                <span className="font-extrabold text-[#2D3436] dark:text-white">
                  {filteredPlaces.length}
                </span>{" "}
                {t("places.results")}
              </p>

              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage <= 1}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-full text-sm font-bold transition-all
                    disabled:opacity-30 disabled:cursor-not-allowed
                    text-[#636E72] dark:text-[#B2BEC3]
                    hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4]
                    border border-[#E8E8E4] dark:border-[#3D3D5C]"
                  aria-label={t("places.previous")}
                >
                  <HiChevronLeft className="text-lg" />
                  <span className="hidden sm:inline">{t("places.previous")}</span>
                </button>

                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="w-10 h-10 flex items-center justify-center text-sm text-[#B2BEC3] select-none"
                    >
                      ···
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-full text-sm font-bold transition-all
                        ${
                          page === safePage
                            ? "bg-gradient-to-r from-[#4ECDC4] to-[#44B9B0] text-white shadow-lg shadow-[#4ECDC4]/25 scale-110"
                            : "text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] border border-[#E8E8E4] dark:border-[#3D3D5C]"
                        }`}
                      aria-label={`${t("places.page")} ${page}`}
                      aria-current={page === safePage ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-full text-sm font-bold transition-all
                    disabled:opacity-30 disabled:cursor-not-allowed
                    text-[#636E72] dark:text-[#B2BEC3]
                    hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4]
                    border border-[#E8E8E4] dark:border-[#3D3D5C]"
                  aria-label={t("places.next")}
                >
                  <span className="hidden sm:inline">{t("places.next")}</span>
                  <HiChevronRight className="text-lg" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Places;
