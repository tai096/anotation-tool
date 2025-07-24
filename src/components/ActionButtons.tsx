import { Download, Tag } from "lucide-react";
import type { ImageData } from "./types";

interface ActionButtonsProps {
  currentImage: ImageData | undefined;
  images: ImageData[];
  isLoading: boolean;
  onSimulatePrediction: () => void;
  onExportCoco: () => void;
}

export default function ActionButtons({
  currentImage,
  images,
  isLoading,
  onSimulatePrediction,
  onExportCoco,
}: ActionButtonsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Actions</h3>
      <div className="space-y-2">
        <button
          onClick={onSimulatePrediction}
          disabled={!currentImage || isLoading}
          className="w-full flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Tag size={16} />
          {isLoading ? "Predicting..." : "Predict Tags"}
        </button>
        <button
          onClick={onExportCoco}
          disabled={images.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={16} />
          Export COCO Format
        </button>
      </div>
    </div>
  );
}
