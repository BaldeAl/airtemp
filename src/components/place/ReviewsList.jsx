import Image from "next/image";
import StarRating from "./StarRating";

const ReviewsList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-6">
        <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white mb-4">Reviews</h3>
        <p className="text-[#636E72] dark:text-[#B2BEC3]">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="py-6">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white">Reviews</h3>
        <StarRating rating={avgRating} size="md" reviewCount={reviews.length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.slice(0, 6).map((review) => (
          <div
            key={review.review_id}
            className="p-4 rounded-2xl bg-white dark:bg-[#232340] border border-[#E8E8E4] dark:border-[#3D3D5C] transition-all hover:shadow-cartoon"
          >
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={review.user?.avatar || "/default-avatar.png"}
                alt={review.user?.name || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-[#2D3436] dark:text-white">{review.user?.name || "Anonymous"}</p>
                <p className="text-xs text-[#B2BEC3]">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <StarRating rating={review.rating} size="xs" showValue={false} />
            </div>
            <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>

      {reviews.length > 6 && (
        <button className="mt-6 btn-pill-outline px-6 py-3">
          Show all {reviews.length} reviews
        </button>
      )}
    </div>
  );
};

export default ReviewsList;
