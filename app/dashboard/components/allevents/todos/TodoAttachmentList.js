'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Eye, 
  Trash2,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function TodoAttachmentList({ eventId, todoId, userId }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttachments();
  }, [eventId, todoId]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/allevents/${eventId}/todos/${todoId}/attachments`
      );
      const result = await response.json();

      if (result.success) {
        setAttachments(result.data);
      }
    } catch (error) {
      console.error('Error fetching attachments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    if (!confirm('Hapus file ini?')) return;

    try {
      setDeleting(attachmentId);

      const response = await fetch(
        `/api/allevents/${eventId}/todos/${todoId}/attachments/${attachmentId}`,
        { method: 'DELETE' }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Berhasil',
          description: 'File berhasil dihapus',
        });
        
        fetchAttachments();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menghapus file',
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleView = (url) => {
    window.open(url, '_blank');
  };

  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal download file',
      });
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-600" />;
    if (fileType.includes('word')) return <FileText className="w-5 h-5 text-blue-600" />;
    if (fileType.includes('excel') || fileType.includes('sheet')) 
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    if (fileType.includes('image')) return <ImageIcon className="w-5 h-5 text-purple-600" />;
    return <File className="w-5 h-5 text-gray-600" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Belum ada file yang diupload
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Dokumen ({attachments.length}):</p>
      {attachments.map((attachment) => (
        <Card key={attachment.id} className="bg-gray-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getFileIcon(attachment.file_type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {attachment.file_original_name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{formatFileSize(attachment.file_size)}</span>
                  <span>•</span>
                  <span>
                    {format(new Date(attachment.uploaded_at), 'dd MMM yyyy HH:mm', { locale: id })}
                  </span>
                  <span>•</span>
                  <span>{attachment.uploaded_by_name}</span>
                </div>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleView(attachment.viewUrl)}
                  title="Lihat"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownload(attachment.viewUrl, attachment.file_original_name)}
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(attachment.id)}
                  disabled={deleting === attachment.id}
                  title="Hapus"
                  className="text-red-600 hover:text-red-700"
                >
                  {deleting === attachment.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}