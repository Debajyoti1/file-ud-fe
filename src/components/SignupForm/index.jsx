import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signupUser } from '../../redux/reducers/authSlice';
import { toast } from 'react-toastify';
import styles from './index.module.scss';

export default function SignupForm() {
  const dispatch = useDispatch();
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signupUser(signupData)).unwrap();
      toast.success('Signup successful! Logging in.');
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    }
  };

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={signupData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={signupData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={signupData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Signup</button>
    </form>
  );
}
