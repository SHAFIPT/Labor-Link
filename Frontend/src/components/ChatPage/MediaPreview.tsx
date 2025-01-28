import React from 'react';
import { X } from 'lucide-react';

const MediaPreview = ({ previewUrl, mediaFile, onCancel }) => {
  if (!previewUrl) return null;

  const isVideo = mediaFile?.type.startsWith('video/');

  return (
    <div className="relative w-full p-4 bg-gray-100 rounded-lg mt-2">
      <button
        onClick={onCancel}
        className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="max-w-sm mx-auto">
        {isVideo ? (
          <video
            src={previewUrl}
            className="w-full rounded-lg"
            controls
          />
        ) : (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full rounded-lg"
          />
        )}
      </div>
      
      <p className="text-sm text-gray-600 mt-2 text-center">
        {isVideo ? 'Video ready to send' : 'Image ready to send'}
      </p>
    </div>
  );
};

export default MediaPreview;