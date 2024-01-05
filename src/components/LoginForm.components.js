/** @jsxImportSource @emotion/react */

import { useState, useEffect } from 'react';
import * as styles from '../components/styles/Login.css';
import { ButtonText } from '../components/Buttons.components';
import { LoginTextInput, FormGroup } from '../components/Form.components';

function LoginForm({ onSubmit, loginCredentials }) {
  const [form, setForm] = useState({
    username: loginCredentials.username,
    password: loginCredentials.password,
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
    localStorage.setItem('loginCredentials', JSON.stringify({ username: form.username, password: form.password }));
  }, [form]);

  return (
    <form css={styles.formStyle}>
      <FormGroup>
        <LoginTextInput
          id="username"
          placeholder="Username"
          value={form.username}
          onChange={(e) => {
            handleChange(e);
          }}
          initialValue={loginCredentials.username}
        />
      </FormGroup>
      <FormGroup>
        <LoginTextInput
          id="password"
          placeholder="Password"
          isPassword= {true}
          value={form.password}
          onChange={handleChange}
          initialValue={loginCredentials.password}
        />
      </FormGroup>
      <FormGroup>
        <ButtonText
          variant="login"
          onClick={handleSubmit}
          disabled={form.username.length === 0 || form.password.length === 0}
        >
          Login
        </ButtonText>
      </FormGroup>
    </form>
  );
}

export default LoginForm;
