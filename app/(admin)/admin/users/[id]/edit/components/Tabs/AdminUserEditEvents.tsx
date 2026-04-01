"use client";

import type { PaginationState } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { FilterPanel } from "@/components/FilterPanel";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserEvents } from "@/lib/hooks/api/user/useAdminUserEdit";
import useDebounce from "@/lib/hooks/useDebounce";
import type { UserEventType, UserSensitiveResponse } from "@/lib/types/api";
import { tryParseNumber } from "@/lib/utils/type.util";

import { adminUserEventsColumns } from "../../../../components/AdminUserEventsColumns";
import { AdminUserEventsDataTable } from "../../../../components/AdminUserEventsDataTable";
import { AdminUserEventsFilters } from "../../../../components/AdminUserEventsFilters";

export default function AdminUserEditEvents({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const eventsQuery = searchParams.get("events_query") ?? "";
  const eventsPage = tryParseNumber(searchParams.get("events_page")) ?? 0;
  const eventsSize = tryParseNumber(searchParams.get("events_size")) ?? 25;
  const eventsTypes = searchParams.get("events_types");

  const [searchQuery, setSearchQuery] = useState(eventsQuery);
  const searchValue = useDebounce<string>(searchQuery, 450);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: eventsPage,
    pageSize: eventsSize,
  });

  const [eventTypesFilter, setEventTypesFilter] = useState<
    UserEventType[] | null
  >(
    eventsTypes
      ? (eventsTypes.split(",").filter(Boolean) as UserEventType[])
      : null,
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isCrossfading, setIsCrossfading] = useState(false);

  const createQueryString = useCallback(
    () => {
      const params = new URLSearchParams(window.location.search);
      params.set("events_query", searchValue);
      params.set("events_page", pagination.pageIndex.toString());
      params.set("events_size", pagination.pageSize.toString());
      params.set(
        "events_types",
        eventTypesFilter ? eventTypesFilter.join(",") : "",
      );
      return params.toString();
    },
    [searchValue, pagination.pageIndex, pagination.pageSize, eventTypesFilter],
  );

  useEffect(() => {
    window.history.replaceState(null, "", `${pathname}?${createQueryString()}`);
  }, [pathname, createQueryString]);

  const { data, isLoading, isValidating } = useUserEvents(
    user.user_id,
    searchValue || null,
    pagination.pageIndex + 1,
    pagination.pageSize,
    eventTypesFilter ?? undefined,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  const events = data?.events || [];
  const totalCount = data?.total_count || 0;

  useEffect(() => {
    if (!isValidating && isCrossfading) {
      setIsCrossfading(false);
    }
  }, [isValidating, isCrossfading]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination({ ...pagination, pageIndex: 0 });
    if (value !== searchQuery) {
      setIsCrossfading(true);
    }
  };

  const applyFilters = (filters: { eventTypes: UserEventType[] | null }) => {
    setEventTypesFilter(filters.eventTypes);
    setPagination({ ...pagination, pageIndex: 0 });
    setIsCrossfading(true);
  };

  const dataFingerprint = events.length > 0
    ? events.map(e => e.id).join("-")
    : "empty";

  return (
    <div className="space-y-2">
      <FilterPanel>
        <div className="flex flex-col gap-3 px-3 py-2.5 md:flex-row">
          <div className="flex flex-1 items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="relative"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 size-4" />
              Filters
              {eventTypesFilter != null && (
                <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  1
                </div>
              )}
            </Button>
          </div>
        </div>
      </FilterPanel>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: showFilters ? "500px" : "0" }}
      >
        <div
          className={
            showFilters
              ? "scale-100 opacity-100 transition duration-500"
              : "scale-95 opacity-0 transition duration-300"
          }
        >
          <AdminUserEventsFilters
            onApplyFilters={applyFilters}
            isLoading={isLoading}
            defaultEventTypes={eventTypesFilter}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-border/50 bg-card p-4 shadow-md">
        {isLoading && events.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : events.length > 0
          ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={dataFingerprint}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isCrossfading ? 0.3 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <AdminUserEventsDataTable
                    columns={adminUserEventsColumns}
                    data={events}
                    pagination={pagination}
                    totalCount={totalCount}
                    setPagination={setPagination}
                  />
                </motion.div>
              </AnimatePresence>
            )
          : searchValue || eventTypesFilter
            ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="mb-4 size-12 opacity-50" />
                  <p>
                    No events found
                    {searchValue && ` matching "${searchValue}"`}
                    {eventTypesFilter && " with selected filters"}
                  </p>
                </div>
              )
            : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="mb-4 size-12 opacity-50" />
                  <p>No events found</p>
                </div>
              )}
      </div>
    </div>
  );
}
