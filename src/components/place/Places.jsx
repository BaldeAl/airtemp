import { useState, useEffect } from "react";
import Place from "./Place";
import Loading from "../loading/Loading";
import Categories from "../home/Categories";
import FilterPanel from "../filters/FilterPanel";
import { useTranslation } from "../../lib/i18n/LanguageContext";

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
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    minRooms: 0,
    minGuests: 0,
  });
  const { t } = useTranslation();

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

  if (!places) {
    return <Loading />;
  }

  const filteredPlaces = places.filter((place) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6">
          {filteredPlaces.map((place, i) => (
            <Place key={place.id} place={place} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Places;
