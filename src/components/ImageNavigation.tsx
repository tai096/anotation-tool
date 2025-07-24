import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ImageData } from "./types";

interface ImageNavigationProps {
  images: ImageData[];
  currentImageIndex: number;
  onNavigate: (direction: "prev" | "next") => void;
  currentImage?: ImageData;
}

export default function ImageNavigation({
  images,
  currentImageIndex,
  onNavigate,
  currentImage,
}: ImageNavigationProps) {
  if (images.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 mb-2">
        {images.length} image{images.length > 1 ? "s" : ""} loaded
      </p>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
        <button
          onClick={() => onNavigate("prev")}
          disabled={currentImageIndex === 0}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <span className="text-sm text-gray-600">
          {currentImageIndex + 1} / {images.length}
        </span>

        <button
          onClick={() => onNavigate("next")}
          disabled={currentImageIndex === images.length - 1}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {currentImage && (
        <p className="text-xs text-gray-500 mt-2 truncate">
          {currentImage.name}
        </p>
      )}
    </div>
  );
}
