export interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tag: string;
  color: string;
}

export interface ImageData {
  url: string;
  name: string;
  file: File;
}

export interface AnnotationData {
  imageUrl: string;
  imageName: string;
  annotations: BoundingBox[];
  timestamp: string;
}

export interface ImageAnnotations {
  [imageName: string]: {
    groundTruth: BoundingBox[];
    predictions: BoundingBox[];
  };
}

export const TAG_OPTIONS = ["Button", "Input", "Radio", "Dropdown"];
export const TAG_COLORS = {
  Button: "#ef4444",
  Input: "#3b82f6",
  Radio: "#10b981",
  Dropdown: "#f59e0b",
};
