import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('https://homeworkdashboardbackend.vercel.app/user/register', {
        name,
        email,
        password
      });
      console.log('User registered:', response.data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <section className="vh-100 bg-light d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-sm p-4">
              <h3 className="text-center mb-4">Create an Account</h3>
              {/* Register Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Your Name"
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
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
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {error && confirmPassword && confirmPassword !== password && (
                    <div className="text-danger mt-2">Passwords do not match</div>
                  )}
                </div>
                <div className="mb-3 d-flex justify-content-between">
                  <div>
                    <input type="checkbox" id="terms" />
                    <label htmlFor="terms" className="ms-2">
                      I agree to the Terms of Service
                    </label>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary w-100">
                    Register
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>
              {error && <div className="text-danger text-center">{error}</div>} 
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
