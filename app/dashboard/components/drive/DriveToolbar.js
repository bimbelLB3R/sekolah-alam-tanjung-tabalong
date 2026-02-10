// components/drive/DriveToolbar.jsx
'use client';

import { Upload, FolderPlus, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateFolderDialog from './CreateFolderDialog';

export default function DriveToolbar({
  viewMode = 'grid',
  onViewModeChange,
  onUploadClick,
  onFolderCreated,
  onSearch,
  folderId = null,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Left side - Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={onUploadClick} size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
        
        <CreateFolderDialog 
          parentId={folderId}
          onFolderCreated={onFolderCreated}
        />
      </div>

      {/* Right side - View controls and search */}
      <div className="flex gap-2 items-center w-full sm:w-auto">
        {/* Search */}
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-9 w-full sm:w-64"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        {/* View mode toggle */}
        <div className="flex rounded-lg border">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange?.('grid')}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange?.('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}