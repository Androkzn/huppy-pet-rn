/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/Login.css'
import LoginForm from '../components/LoginForm.components'
import Spiner from '../components/Spinner.components'

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, fetchUser, emailPasswordLogin, setCurrentPage } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    setCurrentPage("home")
    navigate(redirectTo ? redirectTo : "/");
  }

  const loadUser = async () => {
    if (!user) {
      try {
        setLoading(true);  
        const fetchedUser = await fetchUser();
        if (fetchedUser) {
          redirectNow();
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false); 
      }
    }
  }

  useEffect(() => {
    setCurrentPage("login")
    loadUser();  
  }, []);

 
  const onSubmit = async (formData) => {
    try {
      setLoading(true);  
      const loggedInUser = await emailPasswordLogin(formData.username, formData.password);
      if (loggedInUser) {
        redirectNow();
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div css={styles.containerStyle}> 
    {loading ? (
      // Display loading spinner while waiting for fetchUser or login
      <Spiner/> 
    ) : (
      // Display login form when not loading
      <div css={styles.loginConteinerStyle}>
        <div css={styles.loginHeaderStyle}>
          <div css={styles.headingLoginStyle} >WELCOME TO HUPPY!</div>
        </div>
          <LoginForm onSubmit={onSubmit} />
          <div css={styles.elementsInRow}>
            <p><Link to="/forgot" css={styles.linkForgot}>Forgot password?</Link></p>
            <p><Link to="/signup" css={styles.linkSignup}>Signup</Link></p>
          </div>
      </div>
      
    )}
    </div>
  )
}

export default Login;