import Image from "next/image";
import Link from "next/link";
import { HiCalendar, HiHome, HiChat } from "react-icons/hi";
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

  return (
    <div className="card-cartoon p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <Image
            className="rounded-full ring-3 ring-[#4ECDC4]/30"
            src={host.avatar || "/default-avatar.png"}
            alt={host.name}
            width={64}
            height={64}
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#55EFC4] rounded-full border-2 border-white dark:border-[#232340]" />
        </div>
        <div>
          <h4 className="text-lg font-extrabold text-[#2D3436] dark:text-white">
            {host.name}
          </h4>
          <p className="text-sm text-[#B2BEC3] font-medium">
            {t("host_card.superhost")}
          </p>
        </div>
      </div>

      {host.bio && (
        <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] mb-4 leading-relaxed">
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
          <span className="text-[#636E72] dark:text-[#B2BEC3]">
            {listingsCount}{" "}
            {listingsCount !== 1
              ? t("host_card.listings")
              : t("host_card.listing")}
          </span>
        </div>
      </div>

      {placeId && host.user_id && (
        <Link
          href={`/messages?contact=${host.user_id}&placeId=${placeId}`}
          className="w-full mt-6 btn-pill-outline py-3 flex items-center justify-center gap-2"
        >
          <HiChat className="text-lg" />
          {t("place.contactHost")}
        </Link>
      )}
    </div>
  );
};

export default HostCard;
