import { Heart } from "lucide-react";

export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
      <Heart className="w-5 h-5 text-primary fill-primary/20" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
    </div>
  );
}
