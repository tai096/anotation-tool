import React, { useState, useRef, useCallback } from "react";
import type {
  BoundingBox,
  ImageData,
  ImageAnnotations,
  AnnotationData,
} from "./types";
import { TAG_COLORS } from "./types";
import { exportToCoco, downloadCocoDataset } from "./cocoExport";

export function useAnnotationLogic() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [imageAnnotations, setImageAnnotations] = useState<ImageAnnotations>(
    {}
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<Partial<BoundingBox> | null>(
    null
  );
  const [selectedTag, setSelectedTag] = useState<string>("Button");
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [showBoxes, setShowBoxes] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentImage = images[currentImageIndex];
  const currentAnnotations = currentImage
    ? imageAnnotations[currentImage.name]
    : null;
  const boxes = React.useMemo(
    () => currentAnnotations?.groundTruth || [],
    [currentAnnotations]
  );

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const updateCurrentAnnotations = useCallback(
    (
      updater: (prev: BoundingBox[]) => BoundingBox[],
      type: "groundTruth" | "predictions"
    ) => {
      if (!currentImage) return;

      setImageAnnotations((prev) => ({
        ...prev,
        [currentImage.name]: {
          ...prev[currentImage.name],
          [type]: updater(prev[currentImage.name]?.[type] || []),
        },
      }));
    },
    [currentImage]
  );

  const navigateImage = useCallback(
    (direction: "prev" | "next") => {
      if (direction === "prev" && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      } else if (
        direction === "next" &&
        currentImageIndex < images.length - 1
      ) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
      setSelectedBoxId(null);
      setCurrentBox(null);
      setIsDrawing(false);
    },
    [currentImageIndex, images.length]
  );

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newImages: ImageData[] = [];
        const fileArray = Array.from(files);

        let loadedCount = 0;

        fileArray.forEach((file, index) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            newImages[index] = {
              url: e.target?.result as string,
              name: file.name,
              file: file,
            };

            loadedCount++;

            if (loadedCount === fileArray.length) {
              // Sort images by name for consistent ordering
              newImages.sort((a, b) => a.name.localeCompare(b.name));

              setImages(newImages);
              setCurrentImageIndex(0);

              // Initialize annotations for all images
              const newAnnotations: ImageAnnotations = {};
              newImages.forEach((img) => {
                newAnnotations[img.name] = {
                  groundTruth: [],
                  predictions: [],
                };
              });
              setImageAnnotations(newAnnotations);
              setSelectedBoxId(null);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    },
    []
  );

  const getMousePos = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = event.currentTarget;
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    },
    []
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getMousePos(event);

      // Check if clicking on existing box
      const clickedBox = boxes.find(
        (box) =>
          pos.x >= box.x &&
          pos.x <= box.x + box.width &&
          pos.y >= box.y &&
          pos.y <= box.y + box.height
      );

      if (clickedBox) {
        setSelectedBoxId(clickedBox.id);
        return;
      }

      setSelectedBoxId(null);
      setIsDrawing(true);
      setCurrentBox({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
      });
    },
    [boxes, getMousePos]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !currentBox) return;

      const pos = getMousePos(event);
      setCurrentBox((prev) => ({
        ...prev,
        width: pos.x - (prev?.x || 0),
        height: pos.y - (prev?.y || 0),
      }));
    },
    [isDrawing, currentBox, getMousePos]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentBox || !currentBox.x || !currentBox.y) return;

    const width = Math.abs(currentBox.width || 0);
    const height = Math.abs(currentBox.height || 0);

    if (width > 10 && height > 10) {
      const newBox: BoundingBox = {
        id: generateId(),
        x:
          currentBox.width! < 0
            ? currentBox.x + currentBox.width!
            : currentBox.x,
        y:
          currentBox.height! < 0
            ? currentBox.y + currentBox.height!
            : currentBox.y,
        width,
        height,
        tag: selectedTag,
        color: TAG_COLORS[selectedTag as keyof typeof TAG_COLORS],
      };

      updateCurrentAnnotations((prev) => [...prev, newBox], "groundTruth");
    }

    setIsDrawing(false);
    setCurrentBox(null);
  }, [isDrawing, currentBox, selectedTag, updateCurrentAnnotations]);

  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
    setCurrentBox(null);
  }, []);

  const deleteSelectedBox = useCallback(() => {
    if (selectedBoxId) {
      updateCurrentAnnotations(
        (prev) => prev.filter((box) => box.id !== selectedBoxId),
        "groundTruth"
      );
      setSelectedBoxId(null);
    }
  }, [selectedBoxId, updateCurrentAnnotations]);

  const updateSelectedBoxTag = useCallback(
    (newTag: string) => {
      if (selectedBoxId) {
        updateCurrentAnnotations(
          (prev) =>
            prev.map((box) =>
              box.id === selectedBoxId
                ? {
                    ...box,
                    tag: newTag,
                    color: TAG_COLORS[newTag as keyof typeof TAG_COLORS],
                  }
                : box
            ),
          "groundTruth"
        );
      }
    },
    [selectedBoxId, updateCurrentAnnotations]
  );

  const exportAnnotations = useCallback(() => {
    if (!currentImage) return;

    const annotationData: AnnotationData = {
      imageUrl: currentImage.url,
      imageName: currentImage.name,
      annotations: boxes,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(annotationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `annotations_${currentImage.name.replace(
      /\.[^/.]+$/,
      ""
    )}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }, [currentImage, boxes]);

  const exportAllAnnotations = useCallback(() => {
    images.forEach((image, index) => {
      const annotations = imageAnnotations[image.name]?.groundTruth || [];
      if (annotations.length === 0) return;

      const annotationData: AnnotationData = {
        imageUrl: image.url,
        imageName: image.name,
        annotations: annotations,
        timestamp: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(annotationData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `annotations_${image.name.replace(/\.[^/.]+$/, "")}.json`;

      // Add delay between downloads to prevent browser blocking
      setTimeout(() => {
        link.click();
        URL.revokeObjectURL(url);
      }, index * 100);
    });
  }, [images, imageAnnotations]);

  const simulateLLMPrediction = useCallback(async () => {
    if (!currentImage) return;

    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock predictions and add them directly to ground truth
    const mockPredictions: BoundingBox[] = [
      {
        id: generateId(),
        x: 100 + Math.random() * 50,
        y: 50 + Math.random() * 50,
        width: 80,
        height: 30,
        tag: "Button",
        color: TAG_COLORS.Button,
      },
      {
        id: generateId(),
        x: 50 + Math.random() * 50,
        y: 150 + Math.random() * 50,
        width: 200,
        height: 25,
        tag: "Input",
        color: TAG_COLORS.Input,
      },
      {
        id: generateId(),
        x: 300 + Math.random() * 50,
        y: 100 + Math.random() * 50,
        width: 15,
        height: 15,
        tag: "Radio",
        color: TAG_COLORS.Radio,
      },
    ];

    // Add predictions directly to ground truth annotations
    updateCurrentAnnotations(
      (prev) => [...prev, ...mockPredictions],
      "groundTruth"
    );
    setIsLoading(false);
  }, [currentImage, updateCurrentAnnotations]);

  const exportCoco = useCallback(async () => {
    if (images.length === 0) return;

    try {
      setIsLoading(true);
      const cocoDataset = await exportToCoco(images, imageAnnotations, true);
      downloadCocoDataset(cocoDataset, "_annotations.coco.json");
    } catch (error) {
      console.error("Error exporting COCO dataset:", error);
    } finally {
      setIsLoading(false);
    }
  }, [images, imageAnnotations]);

  return {
    // State
    images,
    currentImageIndex,
    currentImage,
    selectedTag,
    selectedBoxId,
    showBoxes,
    isLoading,
    boxes,
    currentBox,
    isDrawing,
    fileInputRef,

    // Actions
    setSelectedTag,
    setShowBoxes: () => setShowBoxes(!showBoxes),
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
  };
}
