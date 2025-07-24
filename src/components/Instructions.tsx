export default function Instructions() {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mt-4">
      <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
      <ul className="text-blue-700 text-sm space-y-1">
        <li>• Upload multiple images using the upload button</li>
        <li>• Use Previous/Next buttons to navigate between images</li>
        <li>• Click and drag to draw bounding boxes on UI elements</li>
        <li>• Select a tag before drawing or click existing boxes to edit</li>
        <li>• Use the visibility toggle to show/hide annotations</li>
        <li>• Use "Generate GT Boxes" to automatically create annotations</li>
        <li>• Export individual or all annotations as JSON files</li>
      </ul>
    </div>
  );
}
