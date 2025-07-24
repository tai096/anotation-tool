import ImageUpload from "./ImageUpload";
import TagSelector from "./TagSelector";
import BoxEditor from "./BoxEditor";
import ActionButtons from "./ActionButtons";
import type { ImageData, BoundingBox } from "./types";

interface ControlsPanelProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedTag: string;
  selectedBoxId: string | null;
  showBoxes: boolean;
  boxes: BoundingBox[];
  images: ImageData[];
  currentImage?: ImageData;
  isLoading: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTagSelect: (tag: string) => void;
  onUpdateSelectedBoxTag: (newTag: string) => void;
  onDeleteSelectedBox: () => void;
  onToggleBoxes: () => void;
  onSimulatePrediction: () => void;
  onExportAnnotations: () => void;
  onExportAllAnnotations: () => void;
  onExportCoco: () => void;
}

export default function ControlsPanel({
  fileInputRef,
  selectedTag,
  selectedBoxId,
  showBoxes,
  boxes,
  images,
  currentImage,
  isLoading,
  onImageUpload,
  onTagSelect,
  onUpdateSelectedBoxTag,
  onDeleteSelectedBox,
  onToggleBoxes,
  onSimulatePrediction,
  onExportAnnotations,
  onExportAllAnnotations,
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
        boxes={boxes}
        images={images}
        isLoading={isLoading}
        onSimulatePrediction={onSimulatePrediction}
        onExportAnnotations={onExportAnnotations}
        onExportAllAnnotations={onExportAllAnnotations}
        onExportCoco={onExportCoco}
      />
    </div>
  );
}
