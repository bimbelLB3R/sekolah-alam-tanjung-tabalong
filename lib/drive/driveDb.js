// lib/drive-db.js
import pool from "../db";

/**
 * FOLDER OPERATIONS
 */

// Create folder
export async function createFolder(userId, folderName, parentId = null) {
  const [result] = await pool.execute(
    `INSERT INTO drive_folders (user_id, name, parent_id, created_at, updated_at) 
     VALUES (?, ?, ?, NOW(), NOW())`,
    [userId, folderName, parentId]
  );
  
  return {
    id: result.insertId,
    name: folderName,
    parentId,
  };
}

// Get folders by user and parent
export async function getFolders(userId, parentId = null) {
  const [folders] = await pool.execute(
    `SELECT id, name, parent_id, created_at, updated_at 
     FROM drive_folders 
     WHERE user_id = ? AND parent_id <=> ?
     ORDER BY name ASC`,
    [userId, parentId]
  );
  
  return folders;
}

// Get folder by ID
export async function getFolderById(folderId, userId) {
  const [folders] = await pool.execute(
    `SELECT id, name, parent_id, created_at, updated_at 
     FROM drive_folders 
     WHERE id = ? AND user_id = ?`,
    [folderId, userId]
  );
  
  return folders[0] || null;
}

// Update folder name
export async function updateFolderName(folderId, userId, newName) {
  const [result] = await pool.execute(
    `UPDATE drive_folders 
     SET name = ?, updated_at = NOW() 
     WHERE id = ? AND user_id = ?`,
    [newName, folderId, userId]
  );
  
  return result.affectedRows > 0;
}

// Delete folder (cascade akan handle files & subfolders jika ada foreign key)
export async function deleteFolder(folderId, userId) {
  const [result] = await pool.execute(
    `DELETE FROM drive_folders 
     WHERE id = ? AND user_id = ?`,
    [folderId, userId]
  );
  
  return result.affectedRows > 0;
}

// Get folder path (breadcrumb)
export async function getFolderPath(folderId, userId) {
  const path = [];
  let currentId = folderId;
  
  while (currentId) {
    const folder = await getFolderById(currentId, userId);
    if (!folder) break;
    
    path.unshift({
      id: folder.id,
      name: folder.name,
    });
    
    currentId = folder.parent_id;
  }
  
  return path;
}

/**
 * FILE OPERATIONS
 */

// Create file record
export async function createFile(userId, fileName, fileSize, fileType, s3Key, folderId = null) {
  const [result] = await pool.execute(
    `INSERT INTO drive_files 
     (user_id, name, size, type, s3_key, folder_id, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [userId, fileName, fileSize, fileType, s3Key, folderId]
  );
  
  return {
    id: result.insertId,
    name: fileName,
    size: fileSize,
    type: fileType,
    s3Key,
    folderId,
  };
}

// Get files by user and folder
export async function getFiles(userId, folderId = null) {
  const [files] = await pool.execute(
    `SELECT id, name, size, type, s3_key, folder_id, created_at, updated_at 
     FROM drive_files 
     WHERE user_id = ? AND folder_id <=> ?
     ORDER BY created_at DESC`,
    [userId, folderId]
  );
  
  return files;
}

// Get file by ID
export async function getFileById(fileId, userId) {
  const [files] = await pool.execute(
    `SELECT id, name, size, type, s3_key, folder_id, created_at, updated_at 
     FROM drive_files 
     WHERE id = ? AND user_id = ?`,
    [fileId, userId]
  );
  
  return files[0] || null;
}

// Update file name
export async function updateFileName(fileId, userId, newName) {
  const [result] = await pool.execute(
    `UPDATE drive_files 
     SET name = ?, updated_at = NOW() 
     WHERE id = ? AND user_id = ?`,
    [newName, fileId, userId]
  );
  
  return result.affectedRows > 0;
}

// Move file to different folder
export async function moveFile(fileId, userId, newFolderId) {
  const [result] = await pool.execute(
    `UPDATE drive_files 
     SET folder_id = ?, updated_at = NOW() 
     WHERE id = ? AND user_id = ?`,
    [newFolderId, fileId, userId]
  );
  
  return result.affectedRows > 0;
}

// Delete file
export async function deleteFile(fileId, userId) {
  const [result] = await pool.execute(
    `DELETE FROM drive_files 
     WHERE id = ? AND user_id = ?`,
    [fileId, userId]
  );
  
  return result.affectedRows > 0;
}

// Get storage usage by user
export async function getStorageUsage(userId) {
  const [result] = await pool.execute(
    `SELECT COALESCE(SUM(size), 0) as total_size, COUNT(*) as file_count
     FROM drive_files 
     WHERE user_id = ?`,
    [userId]
  );
  
  return {
    totalSize: parseInt(result[0].total_size) || 0,  // Convert to number
    fileCount: parseInt(result[0].file_count) || 0,  // Convert to number
  };
}

// Search files and folders
export async function searchDrive(userId, query) {
  const searchQuery = `%${query}%`;
  
  const [files] = await pool.execute(
    `SELECT id, name, size, type, folder_id, 'file' as item_type, created_at 
     FROM drive_files 
     WHERE user_id = ? AND name LIKE ?
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId, searchQuery]
  );
  
  const [folders] = await pool.execute(
    `SELECT id, name, parent_id as folder_id, 'folder' as item_type, created_at 
     FROM drive_folders 
     WHERE user_id = ? AND name LIKE ?
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId, searchQuery]
  );
  
  return [...folders, ...files];
}

