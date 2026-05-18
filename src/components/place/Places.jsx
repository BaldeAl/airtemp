import { useState, useEffect } from "react";
import Place from "./Place";
import Loading from "../loading/Loading";
import Categories from "../home/Categories";
import FilterPanel from "../filters/FilterPanel";

const Places = ({ searchValue = "" }) => {
  const [places, setPlaces] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    minRooms: 0,
    minGuests: 0,
  });

  useEffect(() => {
    fetch(`/api/places/`)
      .then((res) => res.json())
      .then((data) => setPlaces(data));
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
            <span className="font-extrabold text-[#2D3436] dark:text-white">{filteredPlaces.length}</span>{" "}
            place{filteredPlaces.length !== 1 ? "s" : ""} found
          </p>
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </div>
      </div>

      {filteredPlaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-2">No places found</h3>
          <p className="text-[#636E72] dark:text-[#B2BEC3] text-center max-w-md text-sm">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setFilters({ minPrice: 0, maxPrice: 1000, minRooms: 0, minGuests: 0 });
            }}
            className="mt-6 btn-pill px-8 py-3"
          >
            Reset filters
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
