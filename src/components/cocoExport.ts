import type { ImageData, BoundingBox, ImageAnnotations } from "./types";

export interface CocoInfo {
  year: string;
  version: string;
  description: string;
  contributor: string;
  url: string;
  date_created: string;
}

export interface CocoLicense {
  id: number;
  url: string;
  name: string;
}

export interface CocoCategory {
  id: number;
  name: string;
  supercategory: string;
}

export interface CocoImage {
  id: number;
  license: number;
  file_name: string;
  height: number;
  width: number;
  date_captured: string;
  extra?: {
    name: string;
  };
}

export interface CocoAnnotation {
  id: number;
  image_id: number;
  category_id: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
  area: number;
  segmentation: number[][];
  iscrowd: number;
}

export interface CocoDataset {
  info: CocoInfo;
  licenses: CocoLicense[];
  categories: CocoCategory[];
  images: CocoImage[];
  annotations: CocoAnnotation[];
}

export function exportToCoco(
  images: ImageData[],
  imageAnnotations: ImageAnnotations,
  includeImageDimensions = false
): Promise<CocoDataset> {
  // Create categories mapping from your tag options
  const categories: CocoCategory[] = [
    { id: 0, name: "objects", supercategory: "none" },
    { id: 1, name: "Button", supercategory: "objects" },
    { id: 2, name: "Input", supercategory: "objects" },
    { id: 3, name: "Radio", supercategory: "objects" },
    { id: 4, name: "Dropdown", supercategory: "objects" },
  ];

  // Create category name to ID mapping
  const categoryNameToId: { [key: string]: number } = {
    Button: 1,
    Input: 2,
    Radio: 3,
    Dropdown: 4,
  };

  // Create COCO info
  const info: CocoInfo = {
    year: new Date().getFullYear().toString(),
    version: "1",
    description: "Exported from UI Component Annotation Tool",
    contributor: "",
    url: "",
    date_created: new Date().toISOString(),
  };

  // Create license
  const licenses: CocoLicense[] = [
    {
      id: 1,
      url: "https://creativecommons.org/licenses/by/4.0/",
      name: "CC BY 4.0",
    },
  ];

  // Create COCO images
  const cocoImages: CocoImage[] = [];
  const cocoAnnotations: CocoAnnotation[] = [];
  let annotationId = 0;

  // Helper function to get image dimensions
  const getImageDimensions = (
    imageData: ImageData
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = imageData.url;
    });
  };

  return new Promise((resolve) => {
    const processImages = async () => {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        // Get image dimensions
        let width = 1024; // default width
        let height = 768; // default height

        if (includeImageDimensions) {
          try {
            const dimensions = await getImageDimensions(image);
            width = dimensions.width;
            height = dimensions.height;
          } catch {
            console.warn(
              `Could not get dimensions for ${image.name}, using defaults`
            );
          }
        }

        // Create COCO image entry
        const cocoImage: CocoImage = {
          id: i,
          license: 1,
          file_name: image.name,
          height: height,
          width: width,
          date_captured: new Date().toISOString(),
          extra: {
            name: image.name,
          },
        };
        cocoImages.push(cocoImage);

        // Get annotations for this image
        const annotations = imageAnnotations[image.name]?.groundTruth || [];

        // Convert annotations to COCO format
        annotations.forEach((annotation: BoundingBox) => {
          const categoryId = categoryNameToId[annotation.tag];
          if (categoryId !== undefined) {
            const cocoAnnotation: CocoAnnotation = {
              id: annotationId++,
              image_id: i,
              category_id: categoryId,
              bbox: [
                annotation.x,
                annotation.y,
                annotation.width,
                annotation.height,
              ],
              area: annotation.width * annotation.height,
              segmentation: [],
              iscrowd: 0,
            };
            cocoAnnotations.push(cocoAnnotation);
          }
        });
      }

      const cocoDataset: CocoDataset = {
        info,
        licenses,
        categories,
        images: cocoImages,
        annotations: cocoAnnotations,
      };

      resolve(cocoDataset);
    };

    processImages();
  });
}

export function downloadCocoDataset(
  cocoDataset: CocoDataset,
  filename = "annotations.coco.json"
) {
  const dataStr = JSON.stringify(cocoDataset, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
