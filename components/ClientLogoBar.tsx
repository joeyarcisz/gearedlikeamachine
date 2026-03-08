const CLIENTS = [
  "SpaceX",
  "Coca-Cola",
  "Chevrolet",
  "U.S. Polo Assn.",
  "Tige Boats",
  "Power Digital",
  "Agazul Tequila",
];

export default function ClientLogoBar() {
  return (
    <section className="py-12 sm:py-16 bg-black border-y border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-muted text-center mb-8 font-[family-name:var(--font-heading)]">
          Brands We&apos;ve Built For
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {CLIENTS.map((name) => (
            <span
              key={name}
              className="px-4 py-2 text-xs sm:text-sm uppercase tracking-widest text-chrome border border-card-border bg-card font-[family-name:var(--font-heading)]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
