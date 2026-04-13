import Image from "next/image";
import Link from "next/link";

import type { UserResponse } from "@/lib/types/api";

export default function RecentUsersIcons({ users }: { users: UserResponse[] }) {
  return (
    <div className="mr-2 flex -space-x-2">
      {users.map((u, i) => (
        <div
          key={`recent-user-icon-${u.user_id}`}
          className="relative size-8 overflow-hidden rounded-full border-2 transition-transform hover:scale-110"
          style={{ zIndex: (users.length - i) * 10 }}
        >
          <Link href={`/user/${u.user_id}`}>
            <Image
              src={u.avatar_url}
              alt="user avatar"
              width={40}
              height={40}
              className="size-full object-cover"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
