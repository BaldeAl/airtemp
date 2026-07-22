import { HiStar, HiOutlineStar } from "react-icons/hi";

const StarRating = ({ rating, size = "sm", showValue = true, reviewCount }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <HiStar key={i} className={`text-[#FFE66D] ${sizes[size]}`} />,
      );
    } else {
      stars.push(
        <HiOutlineStar
          key={i}
          className={`text-[#FFE66D]/40 ${sizes[size]}`}
        />,
      );
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">{stars}</div>
      {showValue && (
        <span className="text-sm font-bold text-[#2D3436] dark:text-white">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-[#B2BEC3] font-medium">
          ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
};

export default StarRating;
