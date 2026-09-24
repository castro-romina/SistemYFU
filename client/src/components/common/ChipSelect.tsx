interface Props {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function ChipSelect({ options, selected, onChange }: Props) {
  const toggle = (option: string) =>
    onChange(selected.includes(option) ? selected.filter((s) => s !== option) : [...selected, option]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => toggle(option)}
          className={`px-3 py-2 rounded-full text-sm font-medium transition ${
            selected.includes(option)
              ? "bg-purple-600 text-white"
              : "border border-purple-300 text-purple-600"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}