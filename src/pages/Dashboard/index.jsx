import React from 'react';
import { useSelector } from 'react-redux';
import FileUpload from '../../components/FileUpload';
import FileList from '../../components/FileList';
import styles from './index.module.scss';

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className={styles.dashboardPage}>
      <h2>Dashboard</h2>
      <h4>Welcome {user?.name}</h4>

      {/* Upload Component */}
      <FileUpload />

      {/* Files List Component */}
      <FileList />
    </div>
  );
}
