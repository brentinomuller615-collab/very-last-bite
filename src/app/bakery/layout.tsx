export default function BakeryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-[var(--bakery-bg)] text-[var(--bakery-text)] font-body">
      {/* We apply the max-mobile constraint only to the content containers if needed,
          or we can apply it globally here for the whole portal MVP. */}
      <div className="max-mobile bg-[var(--bakery-bg)] min-h-[100dvh] shadow-xl relative overflow-hidden hide-scrollbar">
        {children}
      </div>
    </div>
  );
}
