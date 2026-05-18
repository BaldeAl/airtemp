import Image from "next/image";
import { HiCalendar, HiHome } from "react-icons/hi";

const HostCard = ({ host }) => {
  if (!host) return null;

  const memberSince = host.createdAt
    ? new Date(host.createdAt).toLocaleDateString("en-US", {
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
          <h4 className="text-lg font-extrabold text-[#2D3436] dark:text-white">{host.name}</h4>
          <p className="text-sm text-[#B2BEC3] font-medium">Superhost</p>
        </div>
      </div>

      {host.bio && (
        <p className="text-sm text-[#636E72] dark:text-[#B2BEC3] mb-4 leading-relaxed">{host.bio}</p>
      )}

      <div className="space-y-3 pt-4 border-t border-[#E8E8E4] dark:border-[#3D3D5C]">
        <div className="flex items-center gap-3 text-sm">
          <HiCalendar className="text-[#B2BEC3]" />
          <span className="text-[#636E72] dark:text-[#B2BEC3]">Member since {memberSince}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <HiHome className="text-[#B2BEC3]" />
          <span className="text-[#636E72] dark:text-[#B2BEC3]">{listingsCount} listing{listingsCount !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <button className="w-full mt-6 btn-pill-outline py-3">
        Contact Host
      </button>
    </div>
  );
};

export default HostCard;
