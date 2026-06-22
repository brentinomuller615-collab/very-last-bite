import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({ label, error, helperText, className = "", ...props }: InputProps) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-[#1F2937] ml-1 font-body">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-200
          bg-[#F9FAFB] text-[#1F2937] border-2 
          ${error ? "border-red-400 focus:border-red-500" : "border-[#F3F4F6] focus:border-[#F59E0B]"}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500 ml-1 mt-1">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-[#6B7280] ml-1 mt-1">{helperText}</p>
      )}
    </div>
  );
}
