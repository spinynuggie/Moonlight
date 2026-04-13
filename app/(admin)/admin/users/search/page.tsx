import { Users } from "lucide-react";

import UsersSearch from "@/app/(admin)/admin/users/components/UsersSearch";
import PrettyHeader from "@/components/General/PrettyHeader";

export default function AdminUsersSearchPage() {
  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader text="Users search" roundBottom icon={<Users />} className="rounded-[10px] border-border/50 shadow-md" />
      <UsersSearch />
    </div>
  );
}
