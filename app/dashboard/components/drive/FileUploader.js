// components/drive/FileUploader.jsx
'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FileUploader({ folderId = null, onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    setUploading(true);

    for (const file of files) {
      await uploadFile(file);
    }

    setUploading(false);
    onUploadComplete?.();
  };

  const uploadFile = async (file) => {
    try {
      // Update progress
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

      console.log('🔄 Starting upload:', file.name);

      // 1. Request presigned URL
      const response = await fetch('/api/drive/files', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for auth
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type || 'application/octet-stream',
          folderId,
        }),
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to get upload URL';
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.error || errorMessage;
            console.error('❌ API Error:', errorMessage);
          } else {
            const text = await response.text();
            console.error('Non-JSON error response:', text);
            errorMessage = `Server error: ${response.status}`;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          errorMessage = `Server error: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Got presigned URL');

      if (!data.file || !data.file.uploadUrl) {
        throw new Error('Invalid response: missing upload URL');
      }

      const { file: fileData } = data;

      // 2. Upload to S3
      console.log('📤 Uploading to S3...');
      
      const uploadResponse = await fetch(fileData.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
      });

      console.log('📡 S3 Response status:', uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('S3 upload error:', errorText);
        throw new Error(`S3 upload failed: ${uploadResponse.status}`);
      }

      console.log('✅ Upload successful!');

      // Update progress to 100%
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

      // Remove from progress after 1 second
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }, 1000);

    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(`Failed to upload ${file.name}: ${error.message}`);
      
      // Remove from progress
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
    }
  };

  return (
    <div>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or click to select
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          Select Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-2">
          Maximum file size: 100MB
        </p>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate flex-1">
                  {fileName}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}