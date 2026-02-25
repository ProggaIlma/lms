import { format, formatDistanceToNow } from "date-fns";

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), "MMM dd, yyyy • hh:mm a");
};

export const formatRelative = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(" ");
};
// * convert any youtube URL to embed format
export const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  // ? already an embed URL
  if (url.includes("youtube.com/embed/")) return url;

  // * handle youtube.com/watch?v=
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  // * handle youtu.be/
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // * return original if not youtube
  return url;
};