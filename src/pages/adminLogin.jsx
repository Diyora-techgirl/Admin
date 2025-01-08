import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    axios.post('https://homeworkdashboardbackend.vercel.app/admin/login', { username, password })
      .then((result) => {
        console.log(result.data);
        login(result.data.token, rememberMe, result.data.admin_id);
        navigate('/dashboard');
      })
      .catch((err) => {
        setError('Invalid username or password');
        console.error(err);
      });
  };

  return (
    <section className="vh-100 bg-light d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-4">
            <div className="card shadow-sm p-4">
              <h3 className="text-center mb-4">Login</h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Your username"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3 d-flex justify-content-between">
                  <div>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe" className="ms-2">Remember me</label>
                  </div>
                  <a href="#" className="text-muted">Forgot password?</a>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary w-100">Sign In</button>
                </div>
              </form>

              {error && <p className="text-danger text-center mt-3">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
