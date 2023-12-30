/** @jsxImportSource @emotion/react */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as styles from '../components/styles/css';
import { Input, FormGroup } from '../components/Shared.componentsb';
import { Image } from '../components/Image.components';
import { LoginTextInput } from '../components/Form.components';
import { ButtonText } from '../components/Buttons.components';

function ForgotPasswordForm({
  onFormInputChange,
  onSubmitEmail,
  onSubmitPasswords,
  onSubmitReset,
}) {
  const [resetMode, setResetMode] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  function handleSubmit(event) {
    event.preventDefault();
    const { email, password, passwordConfirmation } = event.target.elements;
    if (resetMode) {
      // Submit password-related data
      onSubmitPasswords({
        password: password.value,
        passwordConfirmation: passwordConfirmation.value,
      });
    } else {
      // Submit email data
      onSubmitEmail({
        email: email.value,
      });
      setResetMode(true);
    }
  }

  return (
    <form css={styles.formStyle} onSubmit={handleSubmit}>
      <FormGroup>
        <Input
          id="email"
          placeholder="Email"
          onChange={onFormInputChange}
          disabled={resetMode} // Disable the email field when resetMode is true
        />
      </FormGroup>
      {resetMode ? (
        // Render the password and passwordConfirmation fields when resetMode is true
        <>
          <FormGroup>
            <LoginTextInput
              id="password"
              type="password"
              placeholder="Password"
              onChange={onFormInputChange}
            />
          </FormGroup>
          <FormGroup>
            <LoginTextInput
              id="passwordConfirmation"
              type="password"
              placeholder="Repeat password"
              onChange={onFormInputChange}
            />
          </FormGroup>
          <div css={styles.elementsInRow}>
            <FormGroup>
              <ButtonText
                variant="primary"
                type="button"
                width="120px"
                onClick={() => setResetMode(false)}
              >
                Resend Email
              </ButtonText>
            </FormGroup>
            <FormGroup>
              <ButtonText
                variant="primary"
                type="button"
                width="120px"
                onClick={onSubmitReset}
              >
                Reset Password
              </ButtonText>
            </FormGroup>
          </div>
        </>
      ) : (
        <FormGroup>
          <ButtonText variant="primary" type="submit">
            Continue
          </ButtonText>
        </FormGroup>
      )}
    </form>
  );
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToLoginPage = () => {
    const redirectTo = location.search.replace('?redirectTo=', '');
    navigate(redirectTo ? redirectTo : '/');
  };

  const onSubmitEmail = async (formData) => {
    try {
      // Implement your email submission logic here
      // Call redirectNow() or navigate to the next step
    } catch (error) {
      alert(error);
    }
  };

  const onSubmitPasswords = async (formData) => {
    try {
      // Implement your password submission logic here
      // Call redirectNow() or navigate to the next step
    } catch (error) {
      alert(error);
    }
  };

  const onSubmitReset = () => {
    // Handle the reset action (e.g., redirect to the login page)
    // Call redirectNow() or navigate to the login page
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
          onSubmitEmail={onSubmitEmail}
          onSubmitPasswords={onSubmitPasswords}
          onSubmitReset={onSubmitReset}
        />
        <div>
          <p>
            Have an account already?{' '}
            <Link to="/login" css={styles.linkSignup}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
