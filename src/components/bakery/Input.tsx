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
        <label
          className="text-xs font-bold tracking-wide ml-1 font-body uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </label>
      )}
      <input
        className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-200 font-body text-sm"
        style={{
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: error
            ? "1px solid #EF4444"
            : "1px solid var(--border-subtle)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-orange)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.15)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? "#EF4444" : "var(--border-subtle)";
          e.currentTarget.style.boxShadow = "none";
        }}
        {...props}
      />
      {error && <p className="text-xs ml-1 mt-0.5" style={{ color: "#EF4444" }}>{error}</p>}
      {!error && helperText && (
        <p className="text-xs ml-1 mt-0.5" style={{ color: "var(--text-muted)" }}>{helperText}</p>
      )}
    </div>
  );
}
