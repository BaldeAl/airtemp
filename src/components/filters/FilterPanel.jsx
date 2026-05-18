import { useState } from "react";
import { HiAdjustments, HiX } from "react-icons/hi";

const FilterPanel = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#232340] border-2 border-[#E8E8E4] dark:border-[#3D3D5C] text-[#636E72] dark:text-[#B2BEC3] hover:border-[#4ECDC4] hover:text-[#4ECDC4] transition-all text-sm font-bold"
      >
        <HiAdjustments className="text-lg" />
        Filters
        {(filters.minPrice > 0 || filters.maxPrice < 1000 || filters.minRooms > 0 || filters.minGuests > 0) && (
          <span className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-white dark:bg-[#232340] border border-[#E8E8E4] dark:border-[#3D3D5C] rounded-t-3xl md:rounded-3xl p-6 animate-fade-in-up z-50 shadow-cartoon-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-[#2D3436] dark:text-white">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-[#F0F0EC] dark:hover:bg-[#1A1A2E] text-[#636E72] hover:text-[#2D3436] dark:hover:text-white transition-all"
              >
                <HiX className="text-xl" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-[#636E72] dark:text-[#B2BEC3] mb-3 block">
                  Price range: {filters.minPrice}€ – {filters.maxPrice}€
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.minPrice}
                    onChange={(e) =>
                      onFilterChange({ ...filters, minPrice: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      onFilterChange({ ...filters, maxPrice: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-[#636E72] dark:text-[#B2BEC3] mb-3 block">
                  Minimum bedrooms
                </label>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => onFilterChange({ ...filters, minRooms: num })}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        filters.minRooms === num
                          ? "bg-[#FF6B6B] text-white"
                          : "bg-[#F0F0EC] dark:bg-[#1A1A2E] text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#E8E8E4] dark:hover:bg-[#2D2D4A]"
                      }`}
                    >
                      {num === 0 ? "Any" : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-[#636E72] dark:text-[#B2BEC3] mb-3 block">
                  Minimum guests
                </label>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 4, 6, 8].map((num) => (
                    <button
                      key={num}
                      onClick={() => onFilterChange({ ...filters, minGuests: num })}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        filters.minGuests === num
                          ? "bg-[#FF6B6B] text-white"
                          : "bg-[#F0F0EC] dark:bg-[#1A1A2E] text-[#636E72] dark:text-[#B2BEC3] hover:bg-[#E8E8E4] dark:hover:bg-[#2D2D4A]"
                      }`}
                    >
                      {num === 0 ? "Any" : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() =>
                  onFilterChange({
                    minPrice: 0,
                    maxPrice: 1000,
                    minRooms: 0,
                    minGuests: 0,
                  })
                }
                className="flex-1 btn-pill-outline py-3"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 btn-pill py-3"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPanel;
