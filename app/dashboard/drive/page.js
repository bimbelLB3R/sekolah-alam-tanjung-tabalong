// app/drive/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { HardDrive } from 'lucide-react';
import Breadcrumb from '../components/drive/Breadcrumb';
import DriveToolbar from '../components/drive/DriveToolbar';
import FileUploader from '../components/drive/FileUploader';
import FolderItem from '../components/drive/FolderItem';
import FileItem from '../components/drive/FileItem';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function DrivePage() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageUsage, setStorageUsage] = useState({ totalSize: 0, fileCount: 0 });

  useEffect(() => {
    fetchData();
    fetchStorageUsage();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch folders
      const foldersResponse = await fetch('/api/drive/folders');
      if (foldersResponse.ok) {
        const foldersData = await foldersResponse.json();
        setFolders(foldersData.folders || []);
      }

      // Fetch files
      const filesResponse = await fetch('/api/drive/files');
      if (filesResponse.ok) {
        const filesData = await filesResponse.json();
        setFiles(filesData.files || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageUsage = async () => {
    try {
      const response = await fetch('/api/drive/storage');
      if (response.ok) {
        const data = await response.json();
        setStorageUsage(data);
      }
    } catch (error) {
      console.error('Error fetching storage usage:', error);
    }
  };

  const handleFolderCreated = (folder) => {
    setFolders([...folders, folder]);
  };

  const handleFileDelete = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
    fetchStorageUsage();
  };

  const handleFolderDelete = (folderId) => {
    setFolders(folders.filter(f => f.id !== folderId));
  };

  const handleFileRename = (fileId, newName) => {
    setFiles(files.map(f => f.id === fileId ? { ...f, name: newName } : f));
  };

  const handleFolderRename = (folderId, newName) => {
    setFolders(folders.map(f => f.id === folderId ? { ...f, name: newName } : f));
  };

  const handleUploadComplete = () => {
    setShowUploadDialog(false);
    fetchData();
    fetchStorageUsage();
  };

  const handleFolderOpen = (folderId) => {
    router.push(`/drive/${folderId}`);
  };

  // Filter items based on search
  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format storage size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <HardDrive className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">My Drive</h1>
        </div>
        <Breadcrumb path={[]} />
      </div>

      {/* Storage Usage */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Storage Used</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatSize(storageUsage.totalSize)}
            </p>
            <p className="text-xs text-gray-500">
              {storageUsage.fileCount} file{storageUsage.fileCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-lg font-semibold text-gray-700">
              {formatSize(5 * 1024 * 1024 * 1024 - storageUsage.totalSize)}
            </p>
            <p className="text-xs text-gray-500">of 5 GB</p>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${Math.min((storageUsage.totalSize / (5 * 1024 * 1024 * 1024)) * 100, 100)}%`
            }}
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6">
        <DriveToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onUploadClick={() => setShowUploadDialog(true)}
          onFolderCreated={handleFolderCreated}
          onSearch={setSearchQuery}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
            <div className="text-center py-16">
              <HardDrive className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No results found' : 'Your drive is empty'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start by uploading files or creating folders'}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-1'
            }>
              {/* Folders */}
              {filteredFolders.map((folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  onDelete={handleFolderDelete}
                  onRename={handleFolderRename}
                  onOpen={handleFolderOpen}
                />
              ))}

              {/* Files */}
              {filteredFiles.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  onDelete={handleFileDelete}
                  onRename={handleFileRename}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <FileUploader onUploadComplete={handleUploadComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
}