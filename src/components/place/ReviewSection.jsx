import { useState, useEffect } from "react";
import { HiStar, HiOutlineStar } from "react-icons/hi";
import StarRating from "./StarRating";
import { toast } from 'react-toastify';

const ReviewSection = ({ placeId, hostId, reviews: initialReviews }) => {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [showAll, setShowAll] = useState(false);
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Reply state
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);

    if (t) {
      try {
        const payload = JSON.parse(atob(t.split(".")[1]));
        setCurrentUserId(payload.user_id);
        if (payload.user_id === hostId) {
          setIsOwner(true);
        }
        // Check if user already reviewed
        const already = initialReviews?.find(
          (r) => r.userId === payload.user_id
        );
        if (already) setHasReviewed(true);
      } catch {
        // ignore
      }
    }
  }, [hostId, initialReviews]);

  // Fetch fresh reviews
  useEffect(() => {
    if (placeId !== undefined) {
      fetch(`/api/reviews?placeId=${placeId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setReviews(data);
        })
        .catch(() => {});
    }
  }, [placeId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token || rating === 0) return;

    setSubmitting(true);
    setFormMessage("");
    setFormError(false);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ placeId, rating, comment }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviews((prev) => [data, ...prev]);
        setRating(0);
        setComment("");
        setHasReviewed(true);
        setFormMessage("Review submitted successfully!");
        setFormError(false);
      } else {
        setFormMessage(data.message || "Failed to submit review.");
        setFormError(true);
      }
    } catch {
      setFormMessage("Network error. Please try again.");
      setFormError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (reviewId) => {
    if (!token || !replyText.trim()) return;

    setReplySubmitting(true);
    try {
      const res = await fetch("/api/reviews/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewId, reply: replyText }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.review_id === reviewId
              ? { ...r, hostReply: data.hostReply, hostReplyAt: data.hostReplyAt }
              : r
          )
        );
        setReplyingTo(null);
        setReplyText("");
        toast.success("Reply submitted successfully!");
      } else {
        toast.error(data.message || "Failed to submit reply.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setReplySubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white">
          Reviews
        </h3>
        {reviews.length > 0 && (
          <StarRating
            rating={avgRating}
            size="md"
            reviewCount={reviews.length}
          />
        )}
      </div>

      {/* Review Form - only for logged-in users who are NOT the host */}
      {token && !isOwner && !hasReviewed && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 p-5 rounded-2xl bg-white dark:bg-[#232340] border-2 border-[#E8E8E4] dark:border-[#3D3D5C] animate-fade-in-up"
        >
          <h4 className="text-sm font-extrabold text-[#2D3436] dark:text-white mb-4">
            Leave a Review
          </h4>

          {/* Interactive Star Rating */}
          <div className="mb-4">
            <p className="text-xs font-bold text-[#636E72] dark:text-[#B2BEC3] mb-2">
              Your Rating *
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-125"
                >
                  {star <= (hoverRating || rating) ? (
                    <HiStar className="text-2xl text-[#FFE66D] drop-shadow-sm" />
                  ) : (
                    <HiOutlineStar className="text-2xl text-[#FFE66D]/40" />
                  )}
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-bold text-[#2D3436] dark:text-white">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              placeholder="Share your experience..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#E8E8E4] dark:border-[#3D3D5C] bg-[#FAFAF8] dark:bg-[#1A1A2E] text-[#2D3436] dark:text-white text-sm font-semibold focus:border-[#4ECDC4] focus:ring-0 outline-none transition-all placeholder:text-[#B2BEC3] resize-none"
            />
          </div>

          {/* Message */}
          {formMessage && (
            <div
              className={`mb-3 p-3 rounded-2xl text-sm font-bold ${
                formError
                  ? "bg-[#FF6B6B]/10 text-[#FF6B6B]"
                  : "bg-[#00B894]/10 text-[#00B894]"
              }`}
            >
              {formMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="px-6 py-2.5 rounded-full font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:opacity-90 transition-all text-sm disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Already reviewed message */}
      {token && !isOwner && hasReviewed && (
        <div className="mb-6 p-4 rounded-2xl bg-[#4ECDC4]/10 border border-[#4ECDC4]/30">
          <p className="text-sm font-bold text-[#4ECDC4]">
            ✓ You have already reviewed this place
          </p>
        </div>
      )}

      {/* Owner hint */}
      {isOwner && (
        <div className="mb-6 p-4 rounded-2xl bg-[#0984E3]/10 border border-[#0984E3]/30">
          <p className="text-sm font-bold text-[#0984E3]">
            🏠 This is your place – You can reply to reviews below
          </p>
        </div>
      )}

      {/* Not logged in hint */}
      {!token && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FDCB6E]/10 border border-[#FDCB6E]/30">
          <p className="text-sm font-bold text-[#C9A227]">
            Log in to leave a review
          </p>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-[#636E72] dark:text-[#B2BEC3]">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedReviews.map((review) => (
              <div
                key={review.review_id}
                className="p-4 rounded-2xl bg-white dark:bg-[#232340] border border-[#E8E8E4] dark:border-[#3D3D5C] transition-all hover:shadow-cartoon"
              >
                {/* Review Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {review.user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#2D3436] dark:text-white truncate">
                      {review.user?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-[#B2BEC3]">
                      {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <StarRating
                    rating={review.rating}
                    size="xs"
                    showValue={false}
                  />
                </div>

                {/* Review Comment */}
                <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] leading-relaxed mb-3">
                  {review.comment}
                </p>

                {/* Host Reply */}
                {review.hostReply && (
                  <div className="mt-3 ml-4 p-3 rounded-xl bg-[#F0F0EC] dark:bg-[#1A1A2E] border-l-3 border-[#0984E3]"
                    style={{ borderLeftWidth: '3px', borderLeftColor: '#0984E3' }}>
                    <p className="text-xs font-extrabold text-[#0984E3] mb-1">
                      🏠 Host Reply
                    </p>
                    <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] leading-relaxed">
                      {review.hostReply}
                    </p>
                    {review.hostReplyAt && (
                      <p className="text-xs text-[#B2BEC3] mt-1">
                        {new Date(review.hostReplyAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                )}

                {/* Reply Button for Host (only if no reply yet) */}
                {isOwner && !review.hostReply && (
                  <div className="mt-3">
                    {replyingTo === review.review_id ? (
                      <div className="space-y-2 animate-fade-in">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                          placeholder="Write your reply..."
                          className="w-full px-3 py-2 rounded-xl border-2 border-[#E8E8E4] dark:border-[#3D3D5C] bg-[#FAFAF8] dark:bg-[#1A1A2E] text-[#2D3436] dark:text-white text-sm focus:border-[#0984E3] focus:ring-0 outline-none transition-all placeholder:text-[#B2BEC3] resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSubmitReply(review.review_id)}
                            disabled={replySubmitting || !replyText.trim()}
                            className="px-4 py-1.5 rounded-full font-bold text-white bg-[#0984E3] hover:bg-[#0871C4] transition-all text-xs disabled:opacity-50"
                          >
                            {replySubmitting ? "Sending..." : "Send Reply"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="px-4 py-1.5 rounded-full font-bold text-[#636E72] border border-[#E8E8E4] dark:border-[#3D3D5C] hover:bg-[#F0F0EC] dark:hover:bg-[#2D2D4A] transition-all text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReplyingTo(review.review_id)}
                        className="text-xs font-bold text-[#0984E3] hover:text-[#0871C4] transition-colors"
                      >
                        Reply to this review
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {reviews.length > 6 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-6 btn-pill-outline px-6 py-3"
            >
              Show all {reviews.length} reviews
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewSection;
