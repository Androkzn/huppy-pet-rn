/** @jsxImportSource @emotion/react */

import { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/Login.css'
import {Image} from '../components/Image.components'
import LoginForm from '../components/LoginForm.components'

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // We are consuming our user-management context to 
  // get & set the user details here
  const { user, fetchUser, emailPasswordLogin } = useContext(UserContext);

  // This function will redirect the user to the 
  // appropriate page once the authentication is done.
  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/register");
  }

  // Since there can be chances that the user is already logged in
  // but whenever the app gets refreshed the user context will become
  // empty. So we are checking if the user is already logged in and
  // if so we are redirecting the user to the home page.
  // Otherwise we will do nothing and let the user to login.
  const loadUser = async () => {
    if (!user) {
      const fetchedUser = await fetchUser();
      if (fetchedUser) {
        // Redirecting them once fetched.
        redirectNow();
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
      // Here we are passing user details to our emailPasswordLogin
      // function that we imported from our realm/authentication.js
      // to validate the user credentials and login the user into our App.
      //console.log(form)
      const user = await emailPasswordLogin(formData.username, formData.password);
      if (user) {
        redirectNow();
      }
    } catch (error) {
      alert(error)
    }
  };

  return (
    <div css={styles.containerStyle}> 
      <div css={styles.loginConteinerStyle}>
        <div css={styles.loginHeaderStyle}>
          <h4 css={styles.headingLoginStyle} >WELCOME</h4>
          <Image imageName="dog_sit.png" width="40" height="50" />
        </div>
          <LoginForm onSubmit={onSubmit} />
          <div css={styles.elementsInRow}>
            <p><Link to="/forgot" css={styles.linkForgot}>Forgot password?</Link></p>
            <p><Link to="/signup" css={styles.linkSignup}>Signup</Link></p>
          </div>
      </div>
    </div>
    )
}

export default Login;