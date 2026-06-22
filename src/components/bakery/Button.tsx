import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline";
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
  const baseStyles = "w-full py-3.5 px-6 rounded-2xl font-bold font-display transition-all flex items-center justify-center";
  
  const variants = {
    primary: "bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-[0_4px_14px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)]",
    secondary: "bg-[#FFFDF8] text-[#1F2937] hover:bg-[#F3F4F6] border border-[#F3F4F6] shadow-sm",
    outline: "bg-transparent text-[#F59E0B] border-2 border-[#F59E0B] hover:bg-[#FFFDF8]",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${
        disabled || isLoading ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
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
