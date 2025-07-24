import { Trash2 } from "lucide-react";
import { TAG_OPTIONS, TAG_COLORS } from "./types";

interface BoxEditorProps {
  onUpdateTag: (newTag: string) => void;
  onDelete: () => void;
}

export default function BoxEditor({ onUpdateTag, onDelete }: BoxEditorProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Edit Selected Box</h3>
      <div className="space-y-2 mb-4">
        {TAG_OPTIONS.map((tag) => (
          <button
            key={tag}
            onClick={() => onUpdateTag(tag)}
            className="w-full text-left px-3 py-2 rounded bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
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
      <button
        onClick={onDelete}
        className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        <Trash2 size={16} />
        Delete Box
      </button>
    </div>
  );
}
