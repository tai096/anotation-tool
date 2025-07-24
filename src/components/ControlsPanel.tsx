import ImageUpload from "./ImageUpload";
import TagSelector from "./TagSelector";
import BoxEditor from "./BoxEditor";
import ActionButtons from "./ActionButtons";
import type { ImageData } from "./types";

interface ControlsPanelProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedTag: string;
  selectedBoxId: string | null;
  images: ImageData[];
  currentImage?: ImageData;
  isLoading: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTagSelect: (tag: string) => void;
  onUpdateSelectedBoxTag: (newTag: string) => void;
  onDeleteSelectedBox: () => void;
  onSimulatePrediction: () => void;
  onExportAnnotations: () => void;
  onExportCoco: () => void;
}

export default function ControlsPanel({
  fileInputRef,
  selectedTag,
  selectedBoxId,
  images,
  currentImage,
  isLoading,
  onImageUpload,
  onTagSelect,
  onUpdateSelectedBoxTag,
  onDeleteSelectedBox,
  onSimulatePrediction,
  onExportCoco,
}: ControlsPanelProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Upload Section */}
      <ImageUpload onImageUpload={onImageUpload} fileInputRef={fileInputRef} />

      {/* Tag Selection */}
      <TagSelector selectedTag={selectedTag} onTagSelect={onTagSelect} />

      {/* Selected Box Controls */}
      {selectedBoxId && (
        <BoxEditor
          onUpdateTag={onUpdateSelectedBoxTag}
          onDelete={onDeleteSelectedBox}
        />
      )}

      {/* Actions */}
      <ActionButtons
        currentImage={currentImage}
        images={images}
        isLoading={isLoading}
        onSimulatePrediction={onSimulatePrediction}
        onExportCoco={onExportCoco}
      />
    </div>
  );
}
