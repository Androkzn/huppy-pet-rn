/** @jsxImportSource @emotion/react */

import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from '../contexts/data.context';
import * as styles from '../components/styles/Login.css';
import { LoginTextInput, FormGroup } from '../components/Form.components';
import { ButtonText } from '../components/Buttons.components';

function SignUpForm({ onSubmit, buttonText }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
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
          isPassword= {true}
          placeholder="Password"
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <LoginTextInput
          id="passwordConfirmation"
          isPassword= {true}
          placeholder="Repeat password"
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <ButtonText
          variant="login"
          onClick={handleSubmit}
          disabled={
            form.email.length === 0 ||
            form.password.length === 0 ||
            form.passwordConfirmation.length === 0
          }
        >
          {buttonText}
        </ButtonText>
      </FormGroup>
    </form>
  );
}

const Signup = () => {
  const { setCurrentPage } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  // As explained in the Login page.
  const { emailPasswordSignup } = useContext(DataContext);

  // As explained in the Login page.
  const redirectNow = () => {
    const redirectTo = location.search.replace('?redirectTo=', '');
    setCurrentPage('register');
    navigate(redirectTo ? redirectTo : '/register');
  };

  const navigatedTo = (link) => {
    setCurrentPage(link);
  };

  // As explained in the Login page.
  const onSubmit = async (formData) => {
    try {
      const user = await emailPasswordSignup(formData.email, formData.password);
      if (user) {
        redirectNow();
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div css={styles.containerStyle}>
      <div css={styles.loginConteinerStyle}>
        <div css={styles.loginHeaderStyle}>
          <div css={styles.headingLoginStyle}>CREATE ACCOUNT</div>
        </div>
        <SignUpForm onSubmit={onSubmit} buttonText="Continue" />
        <div>
          <p onClick={navigatedTo('login')}>
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

export default Signup;
