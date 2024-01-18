/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../contexts/data.context';
import * as styles from '../components/styles/Login.css';
import LoginForm from '../components/LoginForm.components';
import Spiner from '../components/Spinner.components';

const Login = () => {
  const navigate = useNavigate();

  console.log(
    '(min-width: 850px) and (max-width: 1249px)',
    window.matchMedia('(min-width: 850px) and (max-width: 1249px)')
  );
  console.log(' (max-width: 849px)', window.matchMedia('(max-width: 849px)'));
  console.log(' (min-width: 1250px)', window.matchMedia('(min-width: 1250px)'));

  // Retrieve saved credentials from localStorage
  const loginCredentials = JSON.parse(
    localStorage.getItem('loginCredentials')
  ) || { username: '', password: '' };

  const { user, fetchUser, emailPasswordLogin, currentProfile, profiles } =
    useContext(DataContext);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    if (!user) {
      try {
        setLoading(true);
        const user = await fetchUser();
        if (!user) {
          setLoading(false);
        }
      } catch (error) {
        alert(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (currentProfile) {
      navigatedTo('');
      //Clear temporarly saved credentials from local storage
      localStorage.removeItem('loginCredentials');
      localStorage.removeItem('registrationCredentials');
      setLoading(false);
    }
  }, [currentProfile]);

  useEffect(() => {
    if (profiles && profiles?.length === 0) {
      navigatedTo('register');
      setLoading(false);
    }
  }, [profiles]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      await emailPasswordLogin(formData.username, formData.password);
      await fetchUser();
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  const navigatedTo = (link) => {
    navigate('/' + link);
  };

  return (
    <div css={styles.containerStyle}>
      {(loading && !currentProfile) || currentProfile ? (
        // Display loading spinner while waiting for fetchUser or login
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Spiner />
        </div>
      ) : (
        // Display login form when not loading
        <div css={styles.loginConteinerStyle}>
          <div css={styles.loginHeaderStyle}>
            <div css={styles.headingLoginStyle}>WELCOME TO HUPPY!</div>
          </div>
          <LoginForm onSubmit={onSubmit} loginCredentials={loginCredentials} />
          <div css={styles.elementsInRow}>
            <div onClick={() => navigatedTo('forgot')} css={styles.linkForgot}>
              Forgot password?
            </div>
            <div onClick={() => navigatedTo('signup')} css={styles.linkSignup}>
              Signup
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
