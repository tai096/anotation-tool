import ControlsPanel from "./ControlsPanel";
import AnnotationCanvas from "./AnnotationCanvas";
import { useAnnotationLogic } from "./useAnnotationLogic";

export default function ImageAnnotationTool() {
  const {
    images,
    currentImageIndex,
    currentImage,
    selectedTag,
    selectedBoxId,
    showBoxes,
    isLoading,
    boxes,
    currentBox,
    fileInputRef,
    setSelectedTag,
    setShowBoxes,
    navigateImage,
    handleImageUpload,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    deleteSelectedBox,
    updateSelectedBoxTag,
    exportAnnotations,
    exportAllAnnotations,
    simulateLLMPrediction,
    exportCoco,
  } = useAnnotationLogic();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          UI Component Annotation Tool
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <ControlsPanel
            fileInputRef={fileInputRef}
            selectedTag={selectedTag}
            selectedBoxId={selectedBoxId}
            showBoxes={showBoxes}
            boxes={boxes}
            images={images}
            currentImage={currentImage}
            isLoading={isLoading}
            onImageUpload={handleImageUpload}
            onTagSelect={setSelectedTag}
            onUpdateSelectedBoxTag={updateSelectedBoxTag}
            onDeleteSelectedBox={deleteSelectedBox}
            onToggleBoxes={setShowBoxes}
            onSimulatePrediction={simulateLLMPrediction}
            onExportAnnotations={exportAnnotations}
            onExportAllAnnotations={exportAllAnnotations}
            onExportCoco={exportCoco}
          />

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <AnnotationCanvas
              currentImage={currentImage}
              boxes={boxes}
              selectedTag={selectedTag}
              selectedBoxId={selectedBoxId}
              showBoxes={showBoxes}
              currentBox={currentBox}
              images={images}
              currentImageIndex={currentImageIndex}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onNavigateImage={navigateImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
