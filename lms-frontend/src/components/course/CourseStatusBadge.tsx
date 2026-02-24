import Badge from "@/components/ui/Badge";
import { CourseStatus } from "@/types/course.types";

const map: Record<CourseStatus, { variant: "success" | "warning" | "neutral"; label: string }> = {
  PUBLISHED: { variant: "success", label: "Published" },
  DRAFT:     { variant: "warning", label: "Draft"     },
  ARCHIVED:  { variant: "neutral", label: "Archived"  },
};

export default function CourseStatusBadge({ status }: { status: CourseStatus }) {
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}