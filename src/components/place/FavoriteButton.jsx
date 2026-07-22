import { useState, useEffect } from "react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";

const FavoriteButton = ({ placeId, className = "", onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    // Ensure consistent number comparison
    setIsFavorite(favs.map(Number).includes(Number(placeId)));
  }, [placeId]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

    const newState = !isFavorite;
    setIsFavorite(newState);

    // Update localStorage with consistent number types
    const numericPlaceId = Number(placeId);
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]").map(
      Number,
    );
    if (newState) {
      if (!favs.includes(numericPlaceId)) favs.push(numericPlaceId);
    } else {
      const index = favs.indexOf(numericPlaceId);
      if (index > -1) favs.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favs));

    if (token) {
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ placeId: numericPlaceId }),
        });
        // If server returned an error, revert the UI state
        if (!res.ok) {
          setIsFavorite(!newState);
          const revertFavs = JSON.parse(
            localStorage.getItem("favorites") || "[]",
          ).map(Number);
          if (!newState) {
            if (!revertFavs.includes(numericPlaceId))
              revertFavs.push(numericPlaceId);
          } else {
            const idx = revertFavs.indexOf(numericPlaceId);
            if (idx > -1) revertFavs.splice(idx, 1);
          }
          localStorage.setItem("favorites", JSON.stringify(revertFavs));
        }
      } catch (err) {
        console.error("Failed to sync favorite");
      }
    }

    if (onToggle) {
      onToggle(placeId, newState);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`group p-2 rounded-full bg-white/80 dark:bg-[#232340]/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-cartoon ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <HiHeart
          className={`text-xl text-[#FF6B6B] ${
            isAnimating ? "animate-pulse-heart" : ""
          }`}
        />
      ) : (
        <HiOutlineHeart className="text-xl text-[#636E72] group-hover:text-[#FF6B6B] transition-colors" />
      )}
    </button>
  );
};

export default FavoriteButton;
