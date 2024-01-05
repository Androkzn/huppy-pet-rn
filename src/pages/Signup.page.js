/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../contexts/data.context';
import * as styles from '../components/styles/Login.css';
import { LoginTextInput, FormGroup } from '../components/Form.components';
import { ButtonText } from '../components/Buttons.components';

function SignUpForm({ onSubmit, buttonText, registrationCredentials }) {

  const [form, setForm] = useState({
    email: registrationCredentials.email,
    password: registrationCredentials.password,
    passwordConfirmation: registrationCredentials.password,
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
    // Save credentials to localStorage when form data changes
    localStorage.setItem('registrationCredentials', JSON.stringify({ email: form.email, password: form.password }));
  }, [form]);

  // Validation for Continue button
  const isFormValid= () => {
     return (
      form.email.length >= 2 &&
      form.password.length >= 8 &&
      form.passwordConfirmation.length >= 8 && 
      form.password === form.passwordConfirmation
      )
  }

  console.log("isFormValid", isFormValid())

  return (
    <form css={styles.formStyle}>
      <FormGroup>
        <LoginTextInput
          id="email"
          placeholder="Email"
          onChange={handleChange}
          initialValue={registrationCredentials.email}
        />
      </FormGroup>
      <FormGroup>
        <LoginTextInput
          id="password"
          isPassword= {true}
          placeholder="Password"
          onChange={handleChange}
          initialValue={registrationCredentials.password}
        />
      </FormGroup>
      <FormGroup>
        <LoginTextInput
          id="passwordConfirmation"
          isPassword= {true}
          placeholder="Repeat password"
          onChange={handleChange}
          initialValue={registrationCredentials.password}
        />
      </FormGroup>
      <FormGroup>
        <ButtonText
          variant="login"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          {buttonText}
        </ButtonText>
      </FormGroup>
    </form>
  );
}

const Signup = () => {
  const { setCurrentPage, logOutUser } = useContext(DataContext);
  const navigate = useNavigate();

  // Retrieve saved credentials from localStorage
  const registrationCredentials = JSON.parse(localStorage.getItem('registrationCredentials')) || { email: '', password: '' };

  // As explained in the Login page.
  const { emailPasswordSignup } = useContext(DataContext);

  const navigatedTo = async (link) => {
    setCurrentPage(link);
    if (link === "login") {
       await logOutUser()
       navigate('/' +link);
    } else {
      navigate('/' + link);
    }
  };

  // As explained in the Login page.
  const onSubmit = async (formData) => {
    try {
      const user = await emailPasswordSignup(formData.email, formData.password);
      if (user) {
        navigatedTo('register') ;
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
        <SignUpForm onSubmit={onSubmit} buttonText="Continue" registrationCredentials={registrationCredentials} />
        <div  style={styles.rowStyle}>
          <div>
            Have an account already?{' '}
          </div>
          <div onClick={() => navigatedTo('login')} style={styles.linkSignup}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
