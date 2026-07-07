import { formatDistanceToNowStrict } from "date-fns";

export const formatTimeAgo = (date: string | Date) => {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
  });
};
