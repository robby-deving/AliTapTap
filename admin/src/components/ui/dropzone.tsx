import React, { ReactNode } from "react";

interface DropzoneProps {
  children: ReactNode;
}

export const Dropzone: React.FC<DropzoneProps> = ({ children }) => {
  return (
    <div className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center cursor-pointer hover:border-yellow-400">
      {children}
    </div>
  );
};

interface ImagePreviewProps {
  src: string;
  alt?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt = "preview" }) => (
  <img
    src={src}
    alt={alt}
    className="w-full h-32 object-contain border border-gray-200 rounded-md"
  />
);

export const UploadText: React.FC = () => (
  <p className="text-sm text-gray-500">Click to upload or drag an image</p>
);
