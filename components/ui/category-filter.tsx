"use client";

export interface CategoryOption {
  id: string;
  label: string;
  count?: number;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: {
  categories: CategoryOption[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar proyectos por categoría"
      className="flex flex-wrap items-center gap-2"
    >
      {categories.map((cat) => {
        const isSelected = selected === cat.id;

        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(cat.id)}
            className={`focus-ring relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono tracking-wide transition-all duration-300 ${
              isSelected
                ? "border-accent bg-accent text-background font-medium shadow-[0_0_20px_rgba(255,77,46,0.3)]"
                : "border border-border bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            <span>{cat.label}</span>
            {cat.count !== undefined && (
              <span
                className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${
                  isSelected
                    ? "bg-background/25 text-background"
                    : "bg-surface-2 text-muted"
                }`}
              >
                {cat.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
