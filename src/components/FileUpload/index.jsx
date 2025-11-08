import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, resetUploadProgress } from '../../redux/reducers/fileSlice';
import { toast } from 'react-toastify';
import styles from './index.module.scss';

export default function FileUpload() {
  const dispatch = useDispatch();
  const uploadProgress = useSelector((state) => state.files.uploadProgress);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

const handleUpload = async () => {
  if (!selectedFile) {
    toast.warn('Please select a file to upload');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile);

//   // Debug check:
//   for (const [key, value] of formData.entries()) {
//     console.log('FormData entry:', key, value);
//   }

  try {
    await dispatch(
      uploadFile({
        formData,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          dispatch({ type: 'files/uploadProgress', payload: percent });
        },
      })
    ).unwrap();

    toast.success('File uploaded successfully');
    setSelectedFile(null);
    setTimeout(() => dispatch(resetUploadProgress()), 800);
  } catch (err) {
    toast.error(err?.message || 'File upload failed');
    dispatch(resetUploadProgress());
  }
};


  return (
    <div className={styles.uploadContainer}>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
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
