import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "w-full py-3.5 px-6 rounded-2xl font-bold font-display transition-all flex items-center justify-center gap-2 text-sm";

  const variants: Record<string, string> = {
    primary:
      "text-white",
    secondary:
      "text-[var(--text-secondary)] border border-[var(--border-subtle)]",
    ghost:
      "text-[var(--accent-orange)] border border-[var(--border-subtle)]",
  };

  const primaryStyle =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, var(--accent-orange) 0%, var(--accent-orange-dark) 100%)",
          boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
        }
      : variant === "secondary"
      ? {
          background: "var(--bg-secondary)",
        }
      : {
          background: "transparent",
        };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={!disabled && !isLoading ? { scale: 1.01 } : undefined}
      className={`${base} ${variants[variant]} ${
        disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      style={primaryStyle}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
}
