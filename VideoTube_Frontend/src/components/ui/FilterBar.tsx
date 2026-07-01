import { useState } from "react";

const FilterBar = () => {
  const [selected, setSelected] = useState('All')

  const categories = ["All", "Music", "Gaming", "Programming", "Sports"];

  return (
    <h1 className="w-full h-10 flex gap-3 items-center ">
      {categories.map((cat) => (
        <button
        key={cat}
          onClick={() => setSelected(cat)}
          className={`py-2 px-3 text-xl font-bold rounded-xl hover:bg-accent ${selected === cat? 'bg-accent text-white' : 'border border-border'}`}
        >
          {cat}
        </button>
      ))}
    </h1>
  );
};

export default FilterBar;
