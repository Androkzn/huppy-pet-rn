/** @jsxImportSource @emotion/react */

import { useState } from 'react';
import * as styles from '../components/styles/Login.css';
import { ButtonText } from '../components/Buttons.components';
import { LoginTextInput, FormGroup } from '../components/Form.components';

function LoginForm({ onSubmit }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
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
          id="username"
          placeholder="Username"
          value={form.username}
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </FormGroup>
      <FormGroup>
        <LoginTextInput
          id="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
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
