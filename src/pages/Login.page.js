/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/Login.css'
import {Image} from '../components/Image.components'
import LoginForm from '../components/LoginForm.components'
import Spiner from '../components/Spinner.components'

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // We are consuming our user-management context to 
  // get & set the user details here
  const { user, fetchUser, emailPasswordLogin } = useContext(UserContext);
  // State variable to track the loading state
  const [loading, setLoading] = useState(false);

  // This function will redirect the user to the 
  // appropriate page once the authentication is done.
  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  }

  // Since there can be chances that the user is already logged in
  // but whenever the app gets refreshed the user context will become
  // empty. So we are checking if the user is already logged in and
  // if so we are redirecting the user to the home page.
  // Otherwise we will do nothing and let the user to login.
  const loadUser = async () => {
    if (!user) {
      try {
        setLoading(true); // Set loading to true when starting to fetch user
        const fetchedUser = await fetchUser();
        if (fetchedUser) {
          // Redirecting them once fetched.
          redirectNow();
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false); // Set loading to false when fetch is complete (success or failure)
      }
    }
  }

  // This useEffect will run only once when the component is mounted.
  // Hence this is helping us in verifying whether the user is already logged in
  // or not.
  useEffect(() => {
    loadUser(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This function gets fired when the user clicks on the "Login" button.
  const onSubmit = async (formData) => {
    try {
      setLoading(true); // Set loading to true when starting to log in
      // Here we are passing user details to our emailPasswordLogin
      // function that we imported from our realm/authentication.js
      // to validate the user credentials and log in the user into our App.
      //console.log(form)
      const loggedInUser = await emailPasswordLogin(formData.username, formData.password);
      if (loggedInUser) {
        redirectNow();
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false); // Set loading to false when login is complete (success or failure)
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