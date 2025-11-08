import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../configuration/axiosClient';
import styles from './index.module.scss';

export default function DownloadPage() {
  const { id } = useParams();
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function fetchFile() {
      try {
        const res = await axiosClient.get(`/files/${id}`, { responseType: 'blob' });
        setFile(res.data);
      } catch (err) {
        console.error('Error fetching file', err);
      }
    }
    fetchFile();
  }, [id]);

  const handleDownload = () => {
    if (!file) return;
    const url = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `file-${id}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className={styles.downloadPage}>
      <h2>Download File</h2>
      {file ? (
        <button onClick={handleDownload}>Download Now</button>
      ) : (
        <p>Loading file...</p>
      )}
    </div>
  );
}
