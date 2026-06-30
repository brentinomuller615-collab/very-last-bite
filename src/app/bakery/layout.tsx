export default function BakeryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-[100dvh] font-body"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-mobile min-h-[100dvh] relative overflow-hidden hide-scrollbar" style={{ background: "var(--bg-primary)" }}>
        {children}
      </div>
    </div>
  );
}
