import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  targetId?: string;
}

export function ScrollIndicator({ targetId }: ScrollIndicatorProps) {
  const handleClick = () => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      data-testid="button-scroll-down"
    >
      <span className="text-sm font-body tracking-wider uppercase">Scroll to begin</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </motion.button>
  );
}
