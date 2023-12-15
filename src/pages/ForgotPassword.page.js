/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import * as styles from '../components/styles/Login.css';
import {LoginTextInput, FormGroup } from '../components/Form.components';
import { Image } from '../components/Image.components';
import {ButtonText} from '../components/Buttons.components'

function ForgotPasswordForm({ onSubmit}) {
  const { setCurrentPage } = useContext(UserContext);  
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  function handleChange(event) {
    const { id, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));

  }

  function handleSubmit() {
    onSubmit(form);
  }

  useEffect(() => {
    setCurrentPage("signup")
  }, []);

  return (
    <form css={styles.formStyle}>
      <FormGroup>
        <LoginTextInput
          id="email"
          placeholder="Email"
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <LoginTextInput
          id="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <LoginTextInput
          id="passwordConfirmation"
          type="password"
          placeholder="Repeat password"
          onChange={handleChange}
        />
      </FormGroup>
      <div>
        <FormGroup>
          <ButtonText
            variant="login"
            onClick={handleSubmit}
            disabled={form.email.length === 0 || form.password.length === 0 || form.passwordConfirmation.length === 0}
          >
            Reset Password
          </ButtonText>
        </FormGroup>
      </div>
    </form>
  );
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { emailPasswordSignup, setCurrentPage } = useContext(UserContext);

  const redirectToLoginPage = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    setCurrentPage("login")
    navigate(redirectTo ? redirectTo : "/");
  };


  const onSubmit = async (formData) => {
    try {
      const user = await emailPasswordSignup(formData.email, formData.password);
      if (user) {
        redirectToLoginPage();
      }
    } catch (error) {
      alert(error);
    }
  };
 
  const navigatedTo= (link) => {
    setCurrentPage(link)
  } 

  return (
    <div css={styles.containerStyle}>
      <div css={styles.loginConteinerStyle}>
        <div css={styles.loginHeaderStyle}>
          <div css={styles.headingLoginStyle}>RESET PASSWORD</div>
        </div>
        <ForgotPasswordForm
          onSubmit={onSubmit}
        />
        <div>
          <p onClick={navigatedTo("login")}>
            Have an account already? <Link to="/login" css={styles.linkSignup}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
