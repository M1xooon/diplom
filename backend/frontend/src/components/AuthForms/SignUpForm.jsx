import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../api/requests';
import { validateUsername, validatePassword } from './validateForm';
import Preloader from '../Preloader/Preloader';
import '../formStyle/Form.css';
import img from '../formStyle/icons8-close.svg';

function SignUpForm() {
  const navigate = useNavigate();

  // Step control
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Controlled inputs
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [formData, setFormData] = useState({});
  const [sendRequest, setSendRequest] = useState(false);

  // Submit handler
  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (page === 1) {
      // Validate username & password
      const usernameValid = validateUsername(username);
      const passwordValid = validatePassword(password);

      if (!usernameValid.ok) {
        setErrors([usernameValid.message]);
        return;
      }

      if (!passwordValid.ok) {
        setErrors([passwordValid.message]);
        return;
      }

      // Save first page form data
      setFormData({
        email,
        username,
        password,
        password2,
      });

      setErrors([]);
      setPage(2);

      // Reset first page fields
      setEmail('');
      setUsername('');
      setPassword('');
      setPassword2('');
      return;
    }

    // Second page
    const secondPageData = {
      first_name: firstName,
      last_name: lastName,
    };

    setFormData(prev => ({ ...prev, ...secondPageData }));
    setSendRequest(true);
  };

  // Effect to send request
  React.useEffect(() => {
    if (!sendRequest) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await signUp(formData);

        let data;
        if (response.headers.get('content-type')?.includes('application/json')) {
          data = await response.json();
        } else {
          data = { error: 'Server returned non-JSON response' };
        }

        if (!response.ok) {
          // Show errors
          setErrors(Object.values(data));
          setIsLoading(false);
          setSendRequest(false);
          return;
        }

        // Success → navigate to sign-in
        setIsLoading(false);
        navigate('/sign-in/');
      } catch (err) {
        setErrors([err.message]);
        setIsLoading(false);
        setSendRequest(false);
      }
    };

    fetchData();
  }, [sendRequest, formData, navigate]);

  return (
    <>
      <form className="form" onSubmit={onSubmitHandler}>
        <h2 className="form--title">Sign Up</h2>

        {page === 1 ? (
          <>
            <input
              type="email"
              placeholder="email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="username*"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="repeat password*"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
            <input type="submit" value="Next" />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input type="submit" value="Sign Up" />
          </>
        )}

        {/* Errors */}
        {errors.length > 0 && errors.map((err, i) => (
          <span key={i} style={{ color: 'red' }}>{err}</span>
        ))}

        {/* Close button */}
        <button className="close" type="button" aria-label="Close">
          <Link to="/"><img src={img} alt="close" /></Link>
        </button>
      </form>

      {isLoading && <Preloader />}
    </>
  );
}

export default SignUpForm;
