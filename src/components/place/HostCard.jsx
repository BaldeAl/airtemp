import Image from "next/image";
import Link from "next/link";
import {
  HiCalendar,
  HiHome,
  HiChat,
  HiExternalLink,
  HiStar,
  HiBadgeCheck,
  HiUser,
} from "react-icons/hi";
import { useTranslation } from "../../lib/i18n/LanguageContext";

const HostCard = ({ host, placeId }) => {
  const { t, dateLocale } = useTranslation();

  if (!host) return null;

  const memberSince = host.createdAt
    ? new Date(host.createdAt).toLocaleDateString(dateLocale, {
        month: "long",
        year: "numeric",
      })
    : "2024";

  const listingsCount = host.Place?.length || 0;
  const hostProfileUrl = `/host/${host.user_id}`;

  const createdDate = host.createdAt ? new Date(host.createdAt) : null;
  const isSenior = createdDate
    ? new Date().getTime() - createdDate.getTime() >= 90 * 24 * 60 * 60 * 1000
    : false;

  const allReviews = host.Place?.flatMap((p) => p.Review || []) || [];
  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

  const isSuperhost = avgRating >= 4.2;
  const isApprovedHost = host.role === "HOST";

  return (
    <div className="card-cartoon p-6">
      <div className="flex items-center gap-4 mb-4">
        <Link href={hostProfileUrl} className="relative group flex-shrink-0">
          <Image
            className="rounded-full ring-3 ring-[#4ECDC4]/30 group-hover:ring-[#FF6B6B] transition-all object-cover"
            src={host.avatar || "/default-avatar.png"}
            alt={host.name}
            width={64}
            height={64}
          />
          {isSuperhost ? (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00B894] text-white rounded-full border-2 border-white dark:border-[#232340] flex items-center justify-center text-xs">
              ★
            </div>
          ) : isApprovedHost && isSenior ? (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0984E3] text-white rounded-full border-2 border-white dark:border-[#232340] flex items-center justify-center text-xs font-bold">
              ✓
            </div>
          ) : (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#55EFC4] rounded-full border-2 border-white dark:border-[#232340]" />
          )}
        </Link>
        <div>
          <Link
            href={hostProfileUrl}
            className="text-lg font-extrabold text-[#2D3436] dark:text-white hover:text-[#FF6B6B] transition-colors block"
          >
            {host.name}
          </Link>

          {isSuperhost ? (
            <div className="inline-flex items-center gap-1 mt-0.5 px-2.5 py-0.5 rounded-full bg-[#00B894]/15 text-[#00B894] text-xs font-extrabold">
              <HiStar className="text-xs" />
              <span>{t("host_card.superhost")}</span>
            </div>
          ) : isApprovedHost && isSenior ? (
            <div className="inline-flex items-center gap-1 mt-0.5 px-2.5 py-0.5 rounded-full bg-[#0984E3]/15 text-[#0984E3] text-xs font-extrabold">
              <HiBadgeCheck className="text-xs" />
              <span>{t("host_card.host")}</span>
            </div>
          ) : isApprovedHost ? (
            <div className="inline-flex items-center gap-1 mt-0.5 text-xs font-bold text-[#636E72] dark:text-[#B2BEC3]">
              <HiUser className="text-xs" />
              <span>{t("host_card.host")}</span>
            </div>
          ) : (
            <p className="text-xs text-[#B2BEC3] font-medium mt-0.5">
              {t("profile.guest")}
            </p>
          )}
        </div>
      </div>

      {host.bio && (
        <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] mb-4 leading-relaxed line-clamp-3">
          {host.bio}
        </p>
      )}

      <div className="space-y-3 pt-4 border-t border-[#E8E8E4] dark:border-[#3D3D5C]">
        <div className="flex items-center gap-3 text-sm">
          <HiCalendar className="text-[#B2BEC3]" />
          <span className="text-[#636E72] dark:text-[#B2BEC3]">
            {t("host_card.memberSince")} {memberSince}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <HiHome className="text-[#B2BEC3]" />
          <Link
            href={hostProfileUrl}
            className="text-[#0984E3] font-semibold hover:underline flex items-center gap-1"
          >
            {listingsCount}{" "}
            {listingsCount !== 1
              ? t("host_card.listings")
              : t("host_card.listing")}
            <HiExternalLink className="text-xs" />
          </Link>
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <Link
          href={hostProfileUrl}
          className="w-full py-2.5 rounded-full font-bold text-center border-2 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white transition-all block text-sm"
        >
          {t("host_places.myPlaces")}
        </Link>

        {placeId && host.user_id && (
          <Link
            href={`/messages?contact=${host.user_id}&placeId=${placeId}`}
            className="w-full py-2.5 btn-pill flex items-center justify-center gap-2 text-sm"
          >
            <HiChat className="text-lg" />
            {t("place.contactHost")}
          </Link>
        )}
      </div>
    </div>
  );
};

export default HostCard;
