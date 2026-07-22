import { useState } from "react";

const FilterBar = () => {
  const [selected, setSelected] = useState("All");

  const categories = ["All", "Music", "Gaming", "Programming", "Sports"];

  return (
    <div className="flex w-full items-center gap-2 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelected(cat)}
          className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            selected === cat
              ? "bg-[var(--accent)] text-white shadow-lg shadow-accent/20"
              : "border border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
