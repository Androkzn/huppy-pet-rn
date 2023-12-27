/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../contexts/data.context";
import * as styles  from '../components/styles/Login.css'
import LoginForm from '../components/LoginForm.components'
import Spiner from '../components/Spinner.components'

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, fetchUser, emailPasswordLogin, setCurrentPage, loadUserProfiles, currentProfile } = useContext(DataContext);
  const [loading, setLoading] = useState(true);

  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    setCurrentPage("")
    navigate(redirectTo ? redirectTo : "/");
  }

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
  }

  useEffect(() => {
    setCurrentPage("login")
    loadUser();  
  }, []);

  useEffect(() => {
     if (currentProfile) {
      redirectNow();
      setLoading(false); 
     }
  }, [currentProfile]);

 
  const onSubmit = async (formData) => {
    try {
      setLoading(true);  
      await emailPasswordLogin(formData.username, formData.password);
      await fetchUser();
    } catch (error) {
      alert(error);
    } 
  };

  const navigatedTo= (link) => {
    setCurrentPage(link)
  }
  
  return (
    <div css={styles.containerStyle}> 
    {(loading && !currentProfile) || currentProfile? (
      // Display loading spinner while waiting for fetchUser or login
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spiner />
      </div>
    ) : (
      // Display login form when not loading
      <div css={styles.loginConteinerStyle}>
        <div css={styles.loginHeaderStyle}>
          <div css={styles.headingLoginStyle} >WELCOME TO HUPPY!</div>
        </div>
          <LoginForm onSubmit={onSubmit} />
          <div css={styles.elementsInRow}>
            <p onClick={navigatedTo("forgot")}><Link to="/forgot" css={styles.linkForgot}>Forgot password?</Link></p>
            <p onClick={navigatedTo("signup")}><Link to="/signup" css={styles.linkSignup}>Signup</Link></p>
          </div>
      </div>
      
    )}
    </div>
  )
}

export default Login;