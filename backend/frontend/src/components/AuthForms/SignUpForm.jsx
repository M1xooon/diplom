import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registration } from '../../api/requests';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  getPasswordRequirements,
} from './validateForm';
import '../formStyle/Form.css';

export default function SignUpForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Валидация при изменении (только если поле уже было тронуто)
    if (touched[name]) {
      validateField(name, value);
    }

    // Очистка ошибки сервера при изменении
    if (serverError) {
      setServerError('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let validationResult = { ok: true };

    switch (name) {
      case 'username':
        validationResult = validateUsername(value);
        break;
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'password':
        validationResult = validatePassword(value);
        break;
      case 'passwordConfirm':
        validationResult = validatePasswordConfirm(formData.password, value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validationResult.ok ? '' : validationResult.message,
    }));

    return validationResult.ok;
  };

  const validateForm = () => {
    const newTouched = {
      username: true,
      email: true,
      password: true,
      passwordConfirm: true,
    };
    setTouched(newTouched);

    const isUsernameValid = validateField('username', formData.username);
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);
    const isPasswordConfirmValid = validateField('passwordConfirm', formData.passwordConfirm);

    return isUsernameValid && isEmailValid && isPasswordValid && isPasswordConfirmValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registration(
        formData.email,
        formData.username,
        formData.password,
        formData.passwordConfirm,
        formData.firstName,
        formData.lastName
      );

      if (response.ok) {
        alert('Registration successful! Please log in.');
        navigate('/signin');
      } else {
        const data = await response.json();

        // Обработка ошибок с сервера
        if (typeof data === 'object') {
          const serverErrors = {};
          Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
              serverErrors[key] = data[key][0];
            } else {
              serverErrors[key] = data[key];
            }
          });
          setErrors((prev) => ({ ...prev, ...serverErrors }));
        } else {
          setServerError('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setServerError('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordRequirements = getPasswordRequirements(formData.password);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign Up</h2>

        {serverError && (
          <div className="error-alert">
            {serverError}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.username && touched.username ? 'error' : ''}
          />
          {errors.username && touched.username && (
            <span className="error-message">{errors.username}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? 'error' : ''}
          />
          {errors.email && touched.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.password && touched.password ? 'error' : ''}
          />
          {touched.password && (
            <div className="password-requirements">
              <p>Password requirements:</p>
              <ul>
                {passwordRequirements.map((req, index) => (
                  <li key={index} className={req.met ? 'met' : 'not-met'}>
                    {req.met ? '✓' : '✗'} {req.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="passwordConfirm">Confirm Password *</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.passwordConfirm && touched.passwordConfirm ? 'error' : ''}
          />
          {errors.passwordConfirm && touched.passwordConfirm && (
            <span className="error-message">{errors.passwordConfirm}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>

        <p className="form-footer">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </form>
    </div>
  );
}
