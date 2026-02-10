// app/drive/[folderId]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { HardDrive, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Breadcrumb from '../../components/drive/Breadcrumb';
import DriveToolbar from '../../components/drive/DriveToolbar';
import FileUploader from '../../components/drive/FileUploader';
import FolderItem from '../../components/drive/FolderItem';
import FileItem from '../../components/drive/FileItem';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { use } from 'react';

export default function FolderPage({ params }) {
  const resolvedParams = use(params);
  const folderId = parseInt(resolvedParams.folderId);
  const router = useRouter();
  const [folder, setFolder] = useState(null);
  const [path, setPath] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [folderId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch folder details and path
      const folderResponse = await fetch(`/api/drive/folders/${folderId}`);
      if (folderResponse.ok) {
        const folderData = await folderResponse.json();
        setFolder(folderData.folder);
        setPath(folderData.folder.path || []);
      } else {
        router.push('/drive');
        return;
      }

      // Fetch subfolders
      const foldersResponse = await fetch(`/api/drive/folders?parentId=${folderId}`);
      if (foldersResponse.ok) {
        const foldersData = await foldersResponse.json();
        setFolders(foldersData.folders || []);
      }

      // Fetch files in this folder
      const filesResponse = await fetch(`/api/drive/files?folderId=${folderId}`);
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

  const handleFolderCreated = (newFolder) => {
    setFolders([...folders, newFolder]);
  };

  const handleFileDelete = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
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
  };

  const handleFolderOpen = (folderId) => {
    router.push(`/drive/${folderId}`);
  };

  const handleBack = () => {
    if (path.length > 1) {
      router.push(`/drive/${path[path.length - 2].id}`);
    } else {
      router.push('/drive');
    }
  };

  // Filter items based on search
  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <HardDrive className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">{folder?.name}</h1>
        </div>
        <Breadcrumb path={path} />
      </div>

      {/* Toolbar */}
      <div className="mb-6">
        <DriveToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onUploadClick={() => setShowUploadDialog(true)}
          onFolderCreated={handleFolderCreated}
          onSearch={setSearchQuery}
          folderId={folderId}
        />
      </div>

      {/* Content */}
      {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
        <div className="text-center py-16">
          <HardDrive className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No results found' : 'This folder is empty'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? 'Try a different search term'
              : 'Start by uploading files or creating subfolders'}
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

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Files to {folder?.name}</DialogTitle>
          </DialogHeader>
          <FileUploader
            folderId={folderId}
            onUploadComplete={handleUploadComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}