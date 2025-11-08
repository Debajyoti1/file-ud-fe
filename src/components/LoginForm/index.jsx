import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/reducers/authSlice';
import { toast } from 'react-toastify';
import styles from './index.module.scss';

export default function LoginForm() {
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(loginData)).unwrap();
      toast.success('Logged in successfully!');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={loginData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={loginData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
