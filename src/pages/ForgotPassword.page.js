/** @jsxImportSource @emotion/react */

import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import * as styles from '../components/styles/Login.css';
import { Button, Input, FormGroup } from '../components/Lib';
import { Image } from '../components/Image.components';

function ForgotPasswordForm({ onFormInputChange, onSubmit}) {
  function handleSubmit(event) {
    const { email, password, passwordConfirmation } = event.target.elements;
      onSubmit({
        email: email.value,
        password: password.value,
        passwordConfirmation: passwordConfirmation.value,
      });
  }

  return (
    <form css={styles.formStyle} onSubmit={handleSubmit}>
      <FormGroup>
        <Input
          id="email"
          placeholder="Email"
          onChange={onFormInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          onChange={onFormInputChange}
        />
      </FormGroup>
      <FormGroup>
        <Input
          id="passwordConfirmation"
          type="password"
          placeholder="Repeat password"
          onChange={onFormInputChange}
        />
      </FormGroup>
      <div css={styles.elementsInRow}>
        <FormGroup>
          <Button
            variant="primary"
            type="button"
            width="120px"
            onClick={onSubmit}
          >
            Reset Password
          </Button>
        </FormGroup>
      </div>
    </form>
  );
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFormFilled, setIsFormFilled] = useState(false);
  const { emailPasswordSignup } = useContext(UserContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  

  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const redirectToLoginPage = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  };


  const onSubmit = async () => {
    try {
      const user = await emailPasswordSignup(form.email, form.password);
      if (user) {
        redirectToLoginPage();
      }
    } catch (error) {
      alert(error);
    }
  };
 

  return (
    <div css={styles.containerStyle}>
      <div css={styles.loginConteinerStyle}>
        <div css={styles.loginHeaderStyle}>
          <h4 css={styles.headingLoginStyle}>RESET PASSWORD</h4>
          <Image imageName="dog_sit.png" width="40" height="50" />
        </div>
        <ForgotPasswordForm
          onFormInputChange={onFormInputChange}
          onSubmit={onSubmit}
        />
        <div>
          <p>
            Have an account already? <Link to="/login" css={styles.linkSignup}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
