import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

const ImageZoomViewer = ({ attachment, cardTitle }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/uploads/${attachment.filename}`;
    link.download = attachment.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Image Container */}
      <div 
        className="relative border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default' }}
      >
        <img
          ref={imageRef}
          src={`/uploads/${attachment.filename}`}
          alt={attachment.originalName}
          className="w-full h-auto transition-transform duration-200"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'center',
            maxWidth: 'none',
            maxHeight: 'none'
          }}
          draggable={false}
        />
        
        {/* Zoom Controls Overlay */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
            title="Rotate"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {Math.round(scale * 100)}%
        </div>
      </div>

      {/* Image Details */}
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p><strong>File:</strong> {attachment.originalName}</p>
        <p><strong>Size:</strong> {(attachment.size / 1024).toFixed(2)} KB</p>
        <p><strong>Type:</strong> {attachment.mimetype}</p>
        <p><strong>Dimensions:</strong> <span id={`dimensions-${attachment.filename}`}>Loading...</span></p>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
        <p><strong>Controls:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Use mouse wheel to zoom in/out</li>
          <li>Click and drag to pan when zoomed in</li>
          <li>Use buttons for precise control</li>
          <li>Double-click to reset view</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageZoomViewer;

