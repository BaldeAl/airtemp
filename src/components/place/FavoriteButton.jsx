import { useState, useEffect } from "react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";

const FavoriteButton = ({ placeId, className = "" }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favs.includes(placeId));
  }, [placeId]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

    const newState = !isFavorite;
    setIsFavorite(newState);

    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (newState) {
      favs.push(placeId);
    } else {
      const index = favs.indexOf(placeId);
      if (index > -1) favs.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favs));

    if (token) {
      try {
        await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ placeId }),
        });
      } catch (err) {
        console.error("Failed to sync favorite");
      }
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
