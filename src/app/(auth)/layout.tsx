import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Very Last Bite",
  description: "Sign in or create an account to discover surplus food deals near you.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout min-h-screen bg-[var(--bg-primary)]">
      {children}
    </div>
  );
}
