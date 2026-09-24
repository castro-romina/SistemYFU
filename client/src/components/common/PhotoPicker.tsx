import React, { useRef, useState } from "react";

interface Props {
  value: string; // data URL ("" si no hay imagen)
  onChange: (dataUrl: string) => void;
  maxPx?: number;
}

// Reduce la imagen para que entre en localStorage y en la base
const resizeImage = (file: File, maxPx: number) =>
  new Promise<string>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });

export default function PhotoPicker({ value, onChange, maxPx = 400 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");
    if (!file) return;

    if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      setError("SVG files are not allowed for security reasons. Please use JPG or PNG.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please upload a JPG or PNG image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }
    try {
      onChange(await resizeImage(file, maxPx));
    } catch {
      setError("Could not read the image. Try another file.");
    }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" onChange={handleChange} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center mx-auto mb-2 cursor-pointer hover:bg-purple-300 transition overflow-hidden"
      >
        {value ? <img src={value} alt="Preview" className="w-full h-full object-cover" /> : <span>📸</span>}
      </button>
      {error && <p className="text-sm text-red-600 text-center mb-2">{error}</p>}
      <p className="text-xs text-gray-500 text-center">Formats: JPG, PNG, MAX. 5MB (SVG not allowed)</p>
    </div>
  );
}