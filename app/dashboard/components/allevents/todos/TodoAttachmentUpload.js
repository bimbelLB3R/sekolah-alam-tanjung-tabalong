'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  File, 
  X, 
  Download, 
  Eye, 
  Trash2,
  Loader2,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function TodoAttachmentUpload({ 
  eventId, 
  todoId, 
  userId, 
  userName, 
  userEmail,
  onUploadComplete 
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validasi ukuran
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File terlalu besar',
          description: `${file.name} melebihi 10MB`,
        });
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Pilih file terlebih dahulu',
      });
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('userId', userId);
      formData.append('userName', userName);
      formData.append('userEmail', userEmail);

      const response = await fetch(
        `/api/allevents/${eventId}/todos/${todoId}/attachments`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Berhasil',
          description: result.message,
        });
        
        setSelectedFiles([]);
        
        if (onUploadComplete) {
          onUploadComplete();
        }
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal upload file',
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${todoId}`}
          disabled={uploading}
        />
        <label
          htmlFor={`file-upload-${todoId}`}
          className="cursor-pointer"
        >
          <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            Klik untuk pilih file atau drag & drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, Word, Excel, atau Gambar (Max 10MB per file)
          </p>
        </label>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">File terpilih ({selectedFiles.length}):</p>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <File className="w-4 h-4 flex-shrink-0 text-gray-500" />
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFile(index)}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {selectedFiles.length} File
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}