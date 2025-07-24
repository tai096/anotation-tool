import React, { useRef, useCallback, useEffect } from "react";
import type { BoundingBox, ImageData } from "./types";
import { TAG_COLORS } from "./types";
import ImageNavigation from "./ImageNavigation";

interface AnnotationCanvasProps {
  currentImage: ImageData | undefined;
  boxes: BoundingBox[];
  selectedTag: string;
  selectedBoxId: string | null;
  showBoxes: boolean;
  currentBox: Partial<BoundingBox> | null;
  images: ImageData[];
  currentImageIndex: number;
  onMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onNavigateImage: (direction: "prev" | "next") => void;
}

export default function AnnotationCanvas({
  currentImage,
  boxes,
  selectedTag,
  selectedBoxId,
  showBoxes,
  currentBox,
  images,
  currentImageIndex,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onNavigateImage,
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground truth boxes
    if (showBoxes) {
      boxes.forEach((box) => {
        ctx.strokeStyle = box.id === selectedBoxId ? "#ffffff" : box.color;
        ctx.lineWidth = box.id === selectedBoxId ? 3 : 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        // Draw tag label
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x, box.y - 20, ctx.measureText(box.tag).width + 8, 20);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Arial";
        ctx.fillText(box.tag, box.x + 4, box.y - 6);
      });
    }

    // Draw current box being drawn
    if (
      currentBox &&
      currentBox.x !== undefined &&
      currentBox.y !== undefined &&
      currentBox.width !== undefined &&
      currentBox.height !== undefined
    ) {
      ctx.strokeStyle = TAG_COLORS[selectedTag as keyof typeof TAG_COLORS];
      ctx.lineWidth = 2;
      ctx.strokeRect(
        currentBox.x,
        currentBox.y,
        currentBox.width,
        currentBox.height
      );
    }
  }, [boxes, currentBox, selectedTag, selectedBoxId, showBoxes]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (canvas && img) {
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
      drawCanvas();
    }
  };

  if (!currentImage) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Annotation Canvas</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-500">Upload images to start annotating</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Annotation Canvas</h3>
      <ImageNavigation
        images={images}
        currentImageIndex={currentImageIndex}
        onNavigate={onNavigateImage}
        currentImage={currentImage}
      />
      <div className="relative border border-gray-300 rounded overflow-hidden w-full h-[600px] mt-4">
        <img
          ref={imageRef}
          src={currentImage.url}
          alt={`Screenshot`}
          className="w-full h-full object-fill"
          onLoad={handleImageLoad}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 cursor-crosshair"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        />
      </div>
    </div>
  );
}
