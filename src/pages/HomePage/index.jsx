import React from 'react';
import LoginForm from '../../components/LoginForm';
import SignupForm from '../../components/SignupForm';
import styles from './index.module.scss';

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <h2>Welcome to File UD</h2>
      <div className={styles.formsContainer}>
        <LoginForm />
        <SignupForm />
      </div>
    </div>
  );
}
