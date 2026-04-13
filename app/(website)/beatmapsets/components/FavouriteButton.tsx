import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useBeatmapSetFavouriteStatus,
  useUpdateBeatmapSetFavouriteStatus,
} from "@/lib/hooks/api/beatmap/useBeatmapSetFavouriteStatus";
import useSelf from "@/lib/hooks/useSelf";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface FavouriteButtonProps {
  beatmapSet: BeatmapSetResponse;
}

export default function FavouriteButton({ beatmapSet }: FavouriteButtonProps) {
  const { self } = useSelf();

  const beatmapSetFavouritedStatusQuery = useBeatmapSetFavouriteStatus(
    beatmapSet.id,
  );
  const beatmapSetFavouritedStatus = beatmapSetFavouritedStatusQuery.data;

  const { favourited } = beatmapSetFavouritedStatus ?? { favourited: false };

  const { trigger } = useUpdateBeatmapSetFavouriteStatus(beatmapSet.id);

  const handleFavourite = async () => {
    trigger(
      { favourited: !favourited },
      {
        optimisticData: {
          favourited: !favourited,
        },
      },
    );
  };

  return (
    <Button
      onClick={handleFavourite}
      disabled={!self}
      size="xl"
      variant="secondary"
      className="hover:text-primary"
    >
      <Heart
        className={cn(
          `text-secondary-foreground`,
          favourited ? `fill-secondary-foreground` : "",
        )}
      />
    </Button>
  );
}
