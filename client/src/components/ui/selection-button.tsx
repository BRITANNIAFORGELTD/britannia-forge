import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SelectionButtonProps {
  icon: LucideIcon;
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
}

export function SelectionButton({
  icon: Icon,
  label,
  value,
  selected,
  onClick,
  className,
  iconClassName
}: SelectionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative w-full p-4 rounded-2xl border-2 transition-all duration-300 group overflow-hidden",
        "bg-white/10 backdrop-blur-sm hover:bg-white/20",
        "border-white/20 hover:border-white/40",
        selected && "border-orange-400 bg-orange-50/20",
        className
      )}
    >
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className={cn(
          "p-3 rounded-full transition-all duration-300",
          "bg-white/20 group-hover:bg-white/30",
          selected && "bg-orange-100/80 text-orange-600",
          iconClassName
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={cn(
          "text-sm font-medium transition-colors",
          selected ? "text-orange-600" : "text-gray-700"
        )}>
          {label}
        </span>
      </div>
      
      {/* Animated background gradient */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300",
        "bg-gradient-to-br from-orange-100/50 to-orange-200/30",
        selected && "opacity-100"
      )} />
      
      {/* Selection indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-3 h-3 rounded-full bg-white"
          />
        </motion.div>
      )}
    </motion.button>
  );
}