
/** @jsxImportSource @emotion/react */

import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/css'
import PawActivityIndicatorView from '../components/Spinner.components';
import {Button, Input, FormGroup, Spinner} from '../components/Lib'
import {Image} from '../components/Image.components'

function SignUpForm({onSubmit, buttonText, onFormInputChange}) {
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password, passwordConfirmation} = event.target.elements

    onSubmit({
      username: username.value,
      password: password.value, 
      passwordConfirmation: passwordConfirmation.value
    })
  }

  return (
    <form
    css={styles.formStyle}
    onSubmit={handleSubmit}
    >
      <FormGroup>
        <Input id="email" placeholder="Email" onChange={onFormInputChange}/>
      </FormGroup>
      <FormGroup>
        <Input id="password" type="password" placeholder="Password" onChange={onFormInputChange}/>
      </FormGroup>
      <FormGroup>
        <Input id="passwordConfirmation" type="password" placeholder="Repeat password" onChange={onFormInputChange}/>
      </FormGroup>
      <FormGroup>
        <Button variant="primary" type="submit">{buttonText}</Button>
      </FormGroup>
    </form>
  )
}

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // As explained in the Login page.
  const { emailPasswordSignup } = useContext(UserContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirmation: ""
  });

  // As explained in the Login page.
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };


  // As explained in the Login page.
  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  }

  // As explained in the Login page.
  const onSubmit = async () => {
    try {
      const user = await emailPasswordSignup(form.email, form.password);
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
          <h4 css={styles.headingLoginStyle} >CREATE ACCOUNT</h4>
          <Image imageName="dog_sit.png" width="40" height="50" />
        </div>
          <SignUpForm onSubmit={onSubmit} buttonText="Continue" onChange={onFormInputChange}/>
          <div css={styles.elementsInRow}>
            <p>Have an account already? <Link to="/login"  css={styles.linkSignup}>Login</Link></p>
          </div>
      </div>
    </div>
    )
}

export default Signup;