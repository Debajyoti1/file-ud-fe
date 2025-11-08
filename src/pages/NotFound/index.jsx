import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';

export default function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/" className={styles.homeBtn}>
        Go Home
      </Link>
    </div>
  );
}
