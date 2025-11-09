import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, resetUploadProgress, setUploadProgress } from '../../redux/reducers/fileSlice';
import { toast } from 'react-toastify';
import styles from './index.module.scss';

export default function FileUpload() {
  const dispatch = useDispatch();
  const uploadProgress = useSelector((state) => state.files.fileUploadOperation.uploadProgress);
  const fileUploadStatus = useSelector((state) => state.files.fileUploadOperation.status);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!selectedFile || fileUploadStatus === 'uploading') return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await dispatch(
        uploadFile({
          formData,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            dispatch(setUploadProgress(percent));
          },
        })
      ).unwrap();

      toast.success('File uploaded successfully');
      setSelectedFile(null);
      setTimeout(() => dispatch(resetUploadProgress()), 1000);
    } catch (err) {
      toast.error(err?.message || 'File upload failed');
      dispatch(resetUploadProgress());
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragActive : ''}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {selectedFile ? (
          <p>{selectedFile.name}</p>
        ) : (
          <p>Drag & drop your file here<br />or <span className={styles.browse}>click to select</span></p>
        )}
      </div>

      {/* hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />

      <button
        onClick={handleUpload}
        disabled={!selectedFile || fileUploadStatus === 'uploading'}
      >
        {fileUploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
      </button>

      {uploadProgress > 0 && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
