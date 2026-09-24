interface Props {
  current: number;
  total?: number;
}

export default function StepDots({ current, total = 4 }: Props) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        return (
          <div
            key={n}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              n <= current ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
            }`}
          >
            {n < current ? "✓" : n}
          </div>
        );
      })}
    </div>
  );
}