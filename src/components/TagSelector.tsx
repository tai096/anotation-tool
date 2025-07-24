import { TAG_OPTIONS, TAG_COLORS } from "./types";

interface TagSelectorProps {
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

export default function TagSelector({
  selectedTag,
  onTagSelect,
}: TagSelectorProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Select Tag</h3>
      <div className="space-y-2">
        {TAG_OPTIONS.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`w-full text-left px-3 py-2 rounded transition-colors ${
              selectedTag === tag
                ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: TAG_COLORS[tag as keyof typeof TAG_COLORS],
                }}
              />
              {tag}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
